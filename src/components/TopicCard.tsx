import { Link } from 'react-router-dom';
import type { Topic } from '@/types/types';
import { Card } from '@/components/Card';

type TopicCardProps = {
  topic: Topic;
  itemCount: number;
  ruleCount?: number;
  to: string;
};

export function TopicCard({
  topic,
  itemCount,
  ruleCount = 0,
  to
}: TopicCardProps) {
  const counts = [
    itemCount > 0 && `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`,
    ruleCount > 0 && `${ruleCount} ${ruleCount === 1 ? 'rule' : 'rules'}`
  ].filter(Boolean);

  return (
    <Link to={to} className="block">
      <Card className="transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {topic.name}
            </h2>

            <p className="mt-2 text-sm text-gray-500">{counts.join(' · ')}</p>
          </div>

          <span className="text-2xl text-gray-300">›</span>
        </div>
      </Card>
    </Link>
  );
}
