import { useEffect, useMemo, useState } from 'react';
import { items } from '@/data/database';
import { useParams } from 'react-router-dom';
import { shuffle } from '@/utils/shuffle';

export default function ReviewPage() {
  const { topicId } = useParams();

  const reviewItems = useMemo(() => {
    return items.filter((item) => item.topicId === topicId && item.lebanese);
  }, [topicId]);

  const [remaining, setRemaining] = useState<typeof reviewItems>([]);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    setRemaining(shuffle(reviewItems));
    setShowAnswer(false);
  }, [reviewItems]);

  const item = remaining[0];

  if (!item) {
    return (
      <main className="mx-auto max-w-xl px-6 py-10">
        <p>Loading...</p>
      </main>
    );
  }

  function next() {
    setRemaining((current) => {
      if (current.length <= 1) {
        return shuffle(reviewItems);
      }

      return current.slice(1);
    });

    setShowAnswer(false);
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-xl flex-col px-6 py-10">
      <h1 className="mb-8 text-center text-3xl font-bold">Review</h1>

      <div
        onClick={() => !showAnswer && setShowAnswer(true)}
        className="flex flex-1 cursor-pointer flex-col justify-center rounded-2xl border border-cedar-300 bg-white p-10 shadow-soft"
      >
        <p className="text-center text-4xl font-bold">{item.english}</p>

        <div className="mt-16 text-center">
          {showAnswer ? (
            <p className="text-3xl text-lebanon-redDark">{item.lebanese}</p>
          ) : (
            <p className="text-lg text-gray-400">Tap anywhere to reveal</p>
          )}
        </div>
      </div>

      {showAnswer && (
        <button
          onClick={next}
          className="mt-8 rounded-xl bg-cedar-800 py-4 text-xl font-semibold text-white"
        >
          Next →
        </button>
      )}
    </main>
  );
}
