import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import {
  conjugatedCount,
  matchesSearch,
  sortedVerbs,
  tenseLabels,
  tensesOf,
  verbRules
} from '@/data/verbs';
import type { Verb } from '@/types/verbs';

type Filter = 'all' | 'full' | 'participle' | 'imperative';

const filters: { id: Filter; label: string; test: (verb: Verb) => boolean }[] =
  [
    { id: 'all', label: 'All', test: () => true },
    {
      id: 'full',
      label: 'Fully conjugated',
      test: (verb) => conjugatedCount(verb) >= 8
    },
    {
      id: 'participle',
      label: 'Active participle',
      test: (verb) => tensesOf(verb).includes('active participle')
    },
    {
      id: 'imperative',
      label: 'Imperative',
      test: (verb) => tensesOf(verb).includes('imperative')
    }
  ];

export function VerbsPage() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const allVerbs = useMemo(() => sortedVerbs(), []);

  const activeFilter = filters.find((f) => f.id === filter) ?? filters[0];
  const visible = allVerbs.filter(
    (verb) => activeFilter.test(verb) && matchesSearch(verb, query)
  );

  return (
    <PageContainer>
      <Link
        to="/topics"
        className="mb-6 text-sm text-gray-500 hover:text-black"
      >
        ← Browse
      </Link>
      <PageHeader
        title="Verbs"
        subtitle={`${allVerbs.length} verbs from your notes`}
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <Link
          to="/verbs/drill"
          className="flex items-center justify-between rounded-2xl bg-cedar-700 px-5 py-4 text-white transition hover:bg-cedar-900"
        >
          <span>
            <span className="block font-semibold">Conjugation drill</span>
            <span className="text-sm text-cedar-100">
              Type the right form, with spaced repetition
            </span>
          </span>
          <span className="text-2xl text-cedar-300">›</span>
        </Link>
        <Link
          to="/verbs/rules"
          className="flex items-center justify-between rounded-2xl border border-lebanon-red/20 bg-white px-5 py-4 transition hover:border-lebanon-red/40"
        >
          <span>
            <span className="block font-semibold text-lebanon-redDark">
              Verb rules
            </span>
            <span className="text-sm text-gray-500">
              {verbRules.length} rules on conjugation, participles and more
            </span>
          </span>
          <span className="text-2xl text-gray-300">›</span>
        </Link>
      </div>

      <label className="sr-only" htmlFor="verb-search">
        Search verbs
      </label>
      <input
        id="verb-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search in English or Lebanese (e.g. write, bektub)"
        className="w-full rounded-xl border border-cedar-300 bg-white px-4 py-3 text-base shadow-sm outline-none transition placeholder:text-gray-400 focus:border-cedar-500 focus:ring-4 focus:ring-cedar-300/40"
      />

      <div className="mt-4 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={[
              'rounded-full px-4 py-1.5 text-sm font-semibold transition',
              f.id === filter
                ? 'bg-cedar-700 text-white'
                : 'bg-white text-cedar-700 ring-1 ring-cedar-300 hover:bg-cedar-100'
            ].join(' ')}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm text-gray-500">
        {visible.length} {visible.length === 1 ? 'verb' : 'verbs'}
      </p>

      <ul className="mt-3 divide-y divide-cedar-100 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {visible.map((verb) => (
          <li key={verb.id}>
            <Link
              to={`/verbs/${verb.id}`}
              className="flex items-center gap-4 px-5 py-4 transition hover:bg-cedar-50"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-gray-900">
                  {verb.english}
                </p>
                <p className="mt-0.5 flex flex-wrap gap-x-3 text-sm text-gray-500">
                  {tensesOf(verb).map((tense) => (
                    <span key={tense}>{tenseLabels[tense] ?? tense}</span>
                  ))}
                </p>
              </div>
              {verb.infinitive && (
                <span className="shrink-0 text-lg font-medium text-lebanon-redDark">
                  {verb.infinitive}
                </span>
              )}
              <span className="text-xl text-gray-300">›</span>
            </Link>
          </li>
        ))}
        {visible.length === 0 && (
          <li className="px-5 py-10 text-center text-gray-500">
            No verbs match “{query}”.
          </li>
        )}
      </ul>
    </PageContainer>
  );
}
