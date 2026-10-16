import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PracticeSession } from '@/components/practice/PracticeSession';
import { getTopic } from '@/data/database';
import { topicCards } from '@/lib/cards';
import { pickSession, statusOf } from '@/lib/progress';

/** /review/:topicId, or /review/due for everything that is due. */
export default function ReviewPage() {
  const { topicId } = useParams();
  const [round, setRound] = useState(0);
  const allDue = topicId === 'due';
  const topic = getTopic(topicId);

  const session = useMemo(() => {
    const pool = allDue
      ? topicCards().filter((card) => statusOf(card.id) === 'due')
      : topicCards(topicId);
    return pickSession(pool);
    // `round` makes "Another round" pick a fresh set.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId, allDue, round]);

  const title = allDue ? 'Due for review' : (topic?.name ?? 'Review');

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-xl flex-col px-5 py-6">
      <div className="mb-4 flex items-center justify-between">
        <Link to="/review" className="text-sm text-gray-500 hover:text-black">
          ← Review
        </Link>
        <h1 className="text-lg font-semibold text-cedar-900">{title}</h1>
      </div>

      {session.extra && (
        <p className="mb-4 rounded-xl bg-cedar-100 px-4 py-3 text-sm text-cedar-900">
          Nothing is due here right now. This is an extra practice round.
        </p>
      )}

      {session.cards.length === 0 ? (
        <p className="mt-10 text-center text-gray-500">
          Nothing to review here right now.
        </p>
      ) : (
        <PracticeSession
          key={`${topicId}-${round}`}
          cards={session.cards}
          mode="reveal"
          backTo="/review"
          backLabel="Topics"
          onRestart={() => setRound((r) => r + 1)}
        />
      )}
    </main>
  );
}
