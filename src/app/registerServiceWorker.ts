/**
 * Offline support. On the published site the service worker saves the app on
 * the device and keeps it up to date. During development (`npm run dev`) it
 * is removed instead, so you always see your latest changes.
 */
export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', async () => {
    if (import.meta.env.PROD) {
      try {
        const registration =
          await navigator.serviceWorker.register('/service-worker.js');
        // Look for a new version whenever the app comes back to the front.
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') registration.update();
        });
      } catch (error) {
        console.warn('Offline support could not be enabled', error);
      }
      return;
    }

    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
  });
}
