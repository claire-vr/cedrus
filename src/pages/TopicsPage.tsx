import { TopicCard } from '@/components/TopicCard';
import { topics } from '@/data/topics';
import { PageHeader } from '@/components/PageHeader';
import { PageContainer } from '@/components/PageContainer';
import { items } from '@/data/items';

export function TopicsPage() {
  return (
    <PageContainer>
      <PageHeader title="Browse Topics" subtitle={`${topics.length} topics`} />

      <div className="mt-8 space-y-4">
        {topics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            itemCount={items.filter((item) => item.topicId === topic.id).length}
          />
        ))}
      </div>
    </PageContainer>
  );
}
