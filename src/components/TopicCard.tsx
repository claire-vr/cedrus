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
      <Card>
        <h2 className="text-xl font-semibold text-gray-900">{topic.name}</h2>

        <p className="mt-2 text-sm text-gray-500">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </p>
      </Card>
    </Link>
  );
}
