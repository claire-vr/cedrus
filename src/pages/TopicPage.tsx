import { Link, useParams } from 'react-router-dom';
import { topics } from '@/data/topics';
import { items } from '@/data/items';
import { ItemCard } from '@/components/ItemCard';
import { PageHeader } from '@/components/PageHeader';
import { PageContainer } from '@/components/PageContainer';

export function TopicPage() {
  const { topicId } = useParams();

  const topic = topics.find((topic) => topic.id === topicId);
  const topicItems = items.filter((item) => item.topicId === topicId);

  return (
    <PageContainer>
      <Link to="/topics" className="text-sm text-gray-500 hover:text-black">
        ← Back to Topics
      </Link>

      <PageHeader
        title={topic?.name ?? 'Topic not found'}
        subtitle={`${topicItems.length} items`}
      />

      <div className="mt-8 space-y-4">
        {topicItems.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </PageContainer>
  );
}
