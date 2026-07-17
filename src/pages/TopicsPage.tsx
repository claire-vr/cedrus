import { Link } from "react-router-dom";
import { topics } from "../data/topics";

export function TopicsPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="text-4xl font-bold">Browse Topics</h1>

    <ul className="mt-8 space-y-3">
        {topics.map((topic) => (
            <li key={topic.id}>
                <Link
                    to={`/topics/${topic.id}`}
                    className="block rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                    {topic.name}
                </Link>
                </li>
        ))}
    </ul>
    </section>
  );
}