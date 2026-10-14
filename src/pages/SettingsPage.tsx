import { useState } from 'react';
import { loadProgress, resetProgress } from '@/lib/progress';

export function SettingsPage() {
  const [practised, setPractised] = useState(
    () => Object.keys(loadProgress()).length
  );
  const [confirming, setConfirming] = useState(false);

  return (
    <section className="mx-auto w-full max-w-xl px-5 py-10">
      <h1 className="text-3xl font-bold text-cedar-900">Settings</h1>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white px-5 py-5">
        <h2 className="text-lg font-semibold text-gray-900">Your progress</h2>
        <p className="mt-1 text-sm text-gray-600">
          {practised} words and verb forms practised. Progress is saved on this
          device only.
        </p>

        {practised > 0 &&
          (confirming ? (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-sm text-gray-700">
                Start over? This can’t be undone.
              </span>
              <button
                type="button"
                onClick={() => {
                  resetProgress();
                  setPractised(0);
                  setConfirming(false);
                }}
                className="rounded-full bg-lebanon-redDark px-4 py-2 text-sm font-semibold text-white"
              >
                Yes, reset
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="rounded-full px-4 py-2 text-sm font-semibold text-cedar-700 ring-1 ring-cedar-300"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="mt-4 rounded-full px-4 py-2 text-sm font-semibold text-lebanon-redDark ring-1 ring-lebanon-red/30 hover:bg-red-50"
            >
              Reset progress
            </button>
          ))}
      </div>
    </section>
  );
}
