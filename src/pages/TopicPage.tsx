import { Link, useParams } from 'react-router-dom';
import { ItemCard } from '@/components/ItemCard';
import { PageHeader } from '@/components/PageHeader';
import { PageContainer } from '@/components/PageContainer';
import { RuleList } from '@/components/verbs/RuleList';
import {
  examplesForTopic,
  getTopic,
  itemsInTopic,
  rulesForTopic
} from '@/data/database';

export function TopicPage() {
  const { topicId } = useParams();
  const topic = getTopic(topicId);
  const topicItems = itemsInTopic(topicId);
  const topicRules = topic ? rulesForTopic(topic.name) : [];
  const topicExamples = topic ? examplesForTopic(topic.name) : [];

  return (
    <PageContainer>
      <Link to="/topics" className="text-sm text-gray-500 hover:text-black">
        ← Browse
      </Link>

      <div className="mt-6">
        <PageHeader
          title={topic?.name ?? 'Topic not found'}
          subtitle={
            topicItems.length > 0
              ? `${topicItems.length} items`
              : `${topicRules.length} rules`
          }
        />
      </div>

      <div className="space-y-3">
        {topicItems.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>

      {topicRules.length > 0 && (
        <section className={topicItems.length > 0 ? 'mt-10' : ''}>
          <h2 className="text-lg font-semibold text-cedar-900">Rules</h2>
          <RuleList rules={topicRules} className="mt-3" />
        </section>
      )}

      {topicExamples.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-cedar-900">
            Example sentences
          </h2>
          <ul className="mt-3 divide-y divide-cedar-100 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {topicExamples.map((example, index) => (
              <li key={index} className="px-5 py-4">
                <p className="text-gray-900">{example.english}</p>
                <p className="mt-1 text-lg text-lebanon-redDark">
                  {example.lebanese}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </PageContainer>
  );
}
