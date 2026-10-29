import { useSearchParams } from 'react-router-dom';
import { TopicCard } from '@/components/TopicCard';
import { ItemCard } from '@/components/ItemCard';
import { PageHeader } from '@/components/PageHeader';
import { PageContainer } from '@/components/PageContainer';
import { itemsInTopic, rulesForTopic, topics } from '@/data/database';
import { searchItems } from '@/lib/search';

export function TopicsPage() {
  // The search lives in the URL (?q=…), so Back returns to the same results.
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const results = searchItems(query);

  return (
    <PageContainer>
      <PageHeader title="Browse" subtitle={`${topics.length} topics`} />

      <div className="relative">
        <input
          type="text"
          inputMode="search"
          enterKeyHint="search"
          value={query}
          onChange={(event) =>
            setParams(event.target.value ? { q: event.target.value } : {}, {
              replace: true
            })
          }
          placeholder="Search in English or Lebanese…"
          aria-label="Search words"
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          className="w-full rounded-xl border border-cedar-300 bg-white py-3 pl-4 pr-12 text-lg outline-none transition focus:ring-4 focus:ring-cedar-300/40"
        />
        {query && (
          <button
            type="button"
            onClick={() => setParams({}, { replace: true })}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-gray-200 text-lg leading-none text-gray-600 hover:bg-gray-300"
          >
            ×
          </button>
        )}
      </div>

      {query ? (
        <section className="mt-4">
          <p className="text-sm text-gray-500">
            {results.length === 0
              ? 'No words found.'
              : `${results.length}${results.length === 60 ? '+' : ''} found`}
          </p>
          <div className="mt-3 space-y-3">
            {results.map((item) => (
              <div key={item.id}>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-cedar-700">
                  {item.topic}
                </p>
                <ItemCard item={item} />
              </div>
            ))}
          </div>
        </section>
      ) : (
        <div className="mt-4 space-y-4">
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
      )}
    </PageContainer>
  );
}
