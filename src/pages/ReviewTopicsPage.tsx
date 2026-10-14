import { Link } from 'react-router-dom';
import { topics } from '@/data/database';

export function ReviewTopicsPage() {
  return (
    <main className="mx-auto max-w-xl px-6 py-10">
      <h1 className="mb-2 text-3xl font-bold">Choose a topic</h1>
      <p className="mb-8 text-gray-600">Select a topic to review.</p>

      <div className="space-y-4">
        {topics.map((topic) => (
          <Link
            key={topic.id}
            to={`/review/${topic.id}`}
            className="block rounded-xl border border-cedar-300 bg-white p-6 shadow-soft transition hover:border-cedar-500 hover:bg-cedar-50"
          >
            <h2 className="text-xl font-semibold">{topic.name}</h2>
          </Link>
        ))}
      </div>
    </main>
  );
}
