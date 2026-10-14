import { TopicCard } from '@/components/TopicCard';
import { PageHeader } from '@/components/PageHeader';
import { PageContainer } from '@/components/PageContainer';
import { itemsInTopic, rulesForTopic, topics } from '@/data/database';

export function TopicsPage() {
  return (
    <PageContainer>
      <PageHeader title="Browse" subtitle={`${topics.length} topics`} />

      <div className="mt-2 space-y-4">
        {topics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            itemCount={itemsInTopic(topic.id).length}
            ruleCount={rulesForTopic(topic.name).length}
            // Verbs have their own section with conjugation tables.
            to={topic.id === 'verbs' ? '/verbs' : `/topics/${topic.id}`}
          />
        ))}
      </div>
    </PageContainer>
  );
}
