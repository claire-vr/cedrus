import { Link } from 'react-router-dom';
import { itemsInTopic, items, topics } from '@/data/database';
import { summarize } from '@/lib/progress';

// Only topics with words to review (not rules-only ones like Language rules).
const reviewTopics = topics.filter((topic) =>
  itemsInTopic(topic.id).some((item) => item.lebanese)
);

function idsOf(topicId: string) {
  return itemsInTopic(topicId)
    .filter((item) => item.lebanese)
    .map((item) => item.id);
}

export function ReviewTopicsPage() {
  const totalDue = summarize(
    items.filter((item) => item.lebanese).map((item) => item.id)
  ).due;

  return (
    <main className="mx-auto max-w-xl px-5 py-10">
      <h1 className="text-3xl font-bold text-cedar-900">Review</h1>
      <p className="mt-1 text-gray-600">
        Words you know come back after longer and longer breaks; words you miss
        come back soon.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {totalDue > 0 ? (
          <Link
            to="/review/due"
            className="rounded-2xl bg-cedar-700 px-5 py-5 text-white shadow-soft transition hover:bg-cedar-900"
          >
            <span className="block text-lg font-semibold">Everything due</span>
            <span className="text-sm text-cedar-100">
              {totalDue} {totalDue === 1 ? 'word' : 'words'} across all topics
            </span>
          </Link>
        ) : (
          <div className="rounded-2xl bg-cedar-100 px-5 py-5 text-cedar-900">
            <span className="block text-lg font-semibold">All caught up</span>
            <span className="text-sm">Nothing is due. Pick a topic below.</span>
          </div>
        )}
        <Link
          to="/verbs/drill"
          className="rounded-2xl border border-lebanon-red/25 bg-white px-5 py-5 shadow-soft transition hover:border-lebanon-red/50"
        >
          <span className="block text-lg font-semibold text-lebanon-redDark">
            Conjugation drill
          </span>
          <span className="text-sm text-gray-500">
            Type the right form of a verb
          </span>
        </Link>
      </div>

      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Topics
      </h2>
      <div className="mt-3 space-y-3">
        {reviewTopics.map((topic) => {
          const ids = idsOf(topic.id);
          const counts = summarize(ids);
          const knownShare = ids.length ? counts.known / ids.length : 0;
          return (
            <Link
              key={topic.id}
              to={`/review/${topic.id}`}
              className="block rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm transition hover:border-cedar-500 hover:bg-cedar-50"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {topic.name}
                </h3>
                {counts.due > 0 && (
                  <span className="rounded-full bg-lebanon-redDark px-2.5 py-0.5 text-xs font-semibold text-white">
                    {counts.due} due
                  </span>
                )}
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-cedar-100">
                <div
                  className="h-full rounded-full bg-cedar-500"
                  style={{ width: `${knownShare * 100}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {counts.known} known · {counts.learning + counts.due} learning ·{' '}
                {counts.new} new
              </p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
