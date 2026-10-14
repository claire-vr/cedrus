import { Link } from 'react-router-dom';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { RuleList } from '@/components/verbs/RuleList';
import { verbRules } from '@/data/verbs';

export function VerbRulesPage() {
  const topics = [...new Set(verbRules.map((rule) => rule.about))];

  return (
    <PageContainer>
      <Link to="/verbs" className="text-sm text-gray-500 hover:text-black">
        ← All verbs
      </Link>
      <div className="mt-6">
        <PageHeader
          title="Verb rules"
          subtitle={`${verbRules.length} rules from your notes`}
        />
      </div>

      <div className="space-y-8">
        {topics.map((topic) => (
          <section key={topic}>
            <h2 className="mb-3 text-lg font-semibold capitalize text-cedar-900">
              {topic}
            </h2>
            <RuleList
              rules={verbRules.filter((rule) => rule.about === topic)}
            />
          </section>
        ))}
      </div>
    </PageContainer>
  );
}
