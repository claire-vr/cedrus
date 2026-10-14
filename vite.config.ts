import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Builds dist/service-worker.js from pwa/service-worker.js, filling in the
 * list of files to save for offline use and a version number that changes
 * whenever any of those files change.
 */
function cedrusServiceWorker(): Plugin {
  return {
    name: 'cedrus-service-worker',
    apply: 'build',
    generateBundle(_options, bundle) {
      const publicFiles = listFiles('public').filter(
        (file) => !file.endsWith('.DS_Store')
      );
      const built = Object.keys(bundle).filter((file) => file !== 'index.html');
      const files = ['/', ...[...publicFiles, ...built].map((f) => `/${f}`)];

      const hash = createHash('sha256');
      for (const file of Object.values(bundle)) {
        hash.update(file.fileName);
        hash.update(file.type === 'chunk' ? file.code : file.source);
      }
      const version = hash.digest('hex').slice(0, 12);

      const template = readFileSync('pwa/service-worker.js', 'utf-8');
      this.emitFile({
        type: 'asset',
        fileName: 'service-worker.js',
        source: template
          .replace('__VERSION__', version)
          .replace('__PRECACHE__', JSON.stringify(files, null, 2))
      });
    }
  };
}

function listFiles(dir: string, prefix = ''): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? listFiles(join(dir, entry.name), `${prefix}${entry.name}/`)
      : [`${prefix}${entry.name}`]
  );
}

export default defineConfig({
  plugins: [react(), cedrusServiceWorker()],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
