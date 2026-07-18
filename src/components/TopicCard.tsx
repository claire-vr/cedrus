import { Link } from 'react-router-dom';
import type { Topic } from '@/types/types';
import { Card } from '@/components/Card';

type TopicCardProps = {
  topic: Topic;
  itemCount: number;
};

export function TopicCard({ topic, itemCount }: TopicCardProps) {
  return (
    <Link to={`/topics/${topic.id}`} className="block">
      <Card className="transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
        {' '}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {topic.name}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </p>
          </div>

          <span className="text-2xl text-gray-300">›</span>
        </div>
      </Card>
    </Link>
  );
}
