import { Link, useParams } from 'react-router-dom';
import { topics } from '@/data/topics';
import { items } from '@/data/items';

export function TopicPage() {
  const { topicId } = useParams();

  const topic = topics.find((topic) => topic.id === topicId);
  const topicItems = items.filter((item) => item.topicId === topicId);

  return (
    <section className="mx-auto max-w-4xl px-5 py-12">
      <Link to="/topics" className="text-sm text-gray-500 hover:text-black">
        ← Back to Topics
      </Link>

      <h1 className="mt-6 text-4xl font-bold">
        {topic?.name ?? 'Topic not found'}
      </h1>

      <ul className="mt-8 space-y-3">
        {topicItems.map((item) => (
          <li
            key={item.id}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <p className="font-semibold">{item.english}</p>
            <p className="text-gray-600">{item.arabic}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
