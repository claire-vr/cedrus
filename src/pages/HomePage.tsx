import { PrimaryActionButton } from '@/components/ui/PrimaryActionButton';

const primaryActions = ['Learn', 'Review', 'Statistics'];

export function HomePage() {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center px-5 py-12 sm:px-8 lg:grid-cols-[1fr_0.88fr] lg:gap-12">
      <div className="max-w-2xl">
        <p className="mb-5 inline-flex rounded-full border border-lebanon-red/20 bg-white px-4 py-2 text-sm font-semibold text-lebanon-redDark">
          Learn Lebanese Arabic
        </p>
        <h1 className="text-5xl font-black leading-tight text-cedar-900 sm:text-7xl">
          Cedrus
        </h1>
        <p className="mt-5 text-2xl font-semibold text-cedar-700 sm:text-3xl">
          Learn Lebanese Arabic
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3 lg:mt-0 lg:grid-cols-1">
        {primaryActions.map((action) => (
          <PrimaryActionButton key={action}>{action}</PrimaryActionButton>
        ))}
      </div>
    </section>
  );
}
