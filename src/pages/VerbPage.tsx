import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageContainer } from '@/components/PageContainer';
import { ConjugationTable } from '@/components/verbs/ConjugationTable';
import { RuleList } from '@/components/verbs/RuleList';
import {
  formsFor,
  getVerb,
  rulesFor,
  sortedVerbs,
  tenseDescriptions,
  tenseLabels,
  tensesOf
} from '@/data/verbs';

export function VerbPage() {
  const { verbId } = useParams();
  const verb = getVerb(verbId);
  const [practice, setPractice] = useState(false);

  if (!verb) {
    return (
      <PageContainer>
        <BackLink />
        <h1 className="mt-6 text-3xl font-bold">Verb not found</h1>
      </PageContainer>
    );
  }

  const list = sortedVerbs();
  const index = list.findIndex((v) => v.id === verb.id);
  const previous = list[index - 1];
  const next = list[index + 1];
  const rules = rulesFor(verb);

  return (
    <PageContainer>
      <BackLink />

      <header className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-cedar-900">
            {verb.english}
          </h1>
          {verb.infinitive && (
            <p className="mt-2 text-3xl font-medium text-lebanon-redDark">
              {verb.infinitive}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to={`/verbs/drill?verb=${verb.id}`}
            className="rounded-full bg-cedar-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cedar-900"
          >
            Drill this verb
          </Link>
          <button
            type="button"
            onClick={() => setPractice((p) => !p)}
            aria-pressed={practice}
            className={[
              'rounded-full px-4 py-2 text-sm font-semibold transition',
              practice
                ? 'bg-lebanon-redDark text-white'
                : 'bg-white text-cedar-700 ring-1 ring-cedar-300 hover:bg-cedar-100'
            ].join(' ')}
          >
            {practice ? 'Show all forms' : 'Practice: hide forms'}
          </button>
        </div>
      </header>

      {practice && (
        <p className="mt-4 text-sm text-gray-500">
          Say each form out loud, then tap it to check.
        </p>
      )}

      <div className="mt-8 space-y-6">
        {tensesOf(verb).map((tense) => (
          // The key resets revealed cells when switching verbs or toggling practice.
          <section key={`${verb.id}-${tense}-${practice}`}>
            <h2 className="text-lg font-semibold text-cedar-900">
              {tenseLabels[tense] ?? tense}
            </h2>
            {tenseDescriptions[tense] && (
              <p className="text-sm text-gray-500">
                {tenseDescriptions[tense]}
              </p>
            )}
            <ConjugationTable forms={formsFor(verb, tense)} hidden={practice} />
          </section>
        ))}
      </div>

      {verb.examples.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-cedar-900">Examples</h2>
          <ul className="mt-3 space-y-3">
            {verb.examples.map((example) => (
              <li
                key={example.english + example.lebanese}
                className="rounded-xl border border-gray-200 bg-white px-5 py-4"
              >
                <p className="text-gray-900">{example.english}</p>
                <p className="mt-1 text-lg text-lebanon-redDark">
                  {example.lebanese}
                </p>
                {example.reference && (
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    {example.reference}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {rules.length > 0 && (
        <details className="group mt-10">
          <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl border border-amber-200 bg-white px-5 py-4 font-semibold text-cedar-900 transition hover:bg-amber-50/60">
            <span>
              Rules that apply{' '}
              <span className="font-normal text-gray-500">
                ({rules.length})
              </span>
            </span>
            <span className="text-gray-400 transition group-open:rotate-90">
              ›
            </span>
          </summary>
          <RuleList rules={rules} className="mt-3" />
        </details>
      )}

      <nav className="mt-12 grid grid-cols-2 gap-3 border-t border-cedar-100 pt-6 text-sm">
        {previous ? (
          <Link
            to={`/verbs/${previous.id}`}
            className="text-gray-500 hover:text-cedar-900"
          >
            ‹ {previous.english}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            to={`/verbs/${next.id}`}
            className="text-right text-gray-500 hover:text-cedar-900"
          >
            {next.english} ›
          </Link>
        )}
      </nav>
    </PageContainer>
  );
}

function BackLink() {
  return (
    <Link to="/verbs" className="text-sm text-gray-500 hover:text-black">
      ← All verbs
    </Link>
  );
}
