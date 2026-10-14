import { useMemo, useState, type ReactNode } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { PracticeSession } from '@/components/practice/PracticeSession';
import {
  conjugatedCount,
  getVerb,
  tenseLabels,
  tenseOrder,
  verbs
} from '@/data/verbs';
import { verbCards } from '@/lib/cards';
import { pickSession, summarize } from '@/lib/progress';

type Settings = {
  tenses: string[];
  scope: 'full' | 'all';
  mode: 'type' | 'reveal';
};

const SETTINGS_KEY = 'cedrus-drill-settings';
const DEFAULTS: Settings = {
  tenses: ['present continuous'],
  scope: 'full',
  mode: 'type'
};

function loadSettings(): Settings {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}');
    return { ...DEFAULTS, ...saved };
  } catch {
    return DEFAULTS;
  }
}

function saveSettings(settings: Settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Not important if it can't be saved.
  }
}

/** /verbs/drill, or /verbs/drill?verb=write to drill one verb. */
export function DrillPage() {
  const [params] = useSearchParams();
  const singleVerb = getVerb(params.get('verb') ?? undefined);
  const [settings, setSettings] = useState(loadSettings);
  const [round, setRound] = useState(0);
  const [started, setStarted] = useState(false);
  const navigate = useNavigate();

  function update(change: Partial<Settings>) {
    const next = { ...settings, ...change };
    setSettings(next);
    saveSettings(next);
  }

  // One verb: all of its tenses. Otherwise: the chosen tenses and verbs.
  const pool = useMemo(() => {
    if (singleVerb) {
      return verbCards(singleVerb, tenseOrder as string[]);
    }
    return verbs
      .filter((verb) => settings.scope === 'all' || conjugatedCount(verb) >= 8)
      .flatMap((verb) => verbCards(verb, settings.tenses));
  }, [singleVerb, settings.scope, settings.tenses]);

  const session = useMemo(
    () => pickSession(pool),
    // `round` makes "Another round" pick a fresh set.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pool, round]
  );

  const backTo = singleVerb ? `/verbs/${singleVerb.id}` : '/verbs';
  const header = (
    <div className="mb-4 flex items-center justify-between">
      <button
        type="button"
        onClick={() => (started ? setStarted(false) : navigate(backTo))}
        className="text-sm text-gray-500 hover:text-black"
      >
        ← {started ? 'Options' : 'Back'}
      </button>
      <h1 className="text-lg font-semibold text-cedar-900">
        {singleVerb ? `Drill: ${singleVerb.english}` : 'Conjugation drill'}
      </h1>
    </div>
  );

  if (started && session.cards.length > 0) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-xl flex-col px-5 py-6">
        {header}
        {session.extra && (
          <p className="mb-4 rounded-xl bg-cedar-100 px-4 py-3 text-sm text-cedar-900">
            Nothing is due in this selection. This is an extra practice round.
          </p>
        )}
        <PracticeSession
          key={round}
          cards={session.cards}
          mode={settings.mode}
          backTo={backTo}
          backLabel={singleVerb ? 'Verb' : 'Verbs'}
          onRestart={() => setRound((r) => r + 1)}
        />
      </main>
    );
  }

  const counts = summarize(pool.map((card) => card.id));

  return (
    <main className="mx-auto max-w-xl px-5 py-6">
      {header}

      {!singleVerb && (
        <>
          <Section title="Tenses">
            <div className="flex flex-wrap gap-2">
              {tenseOrder.map((tense) => {
                const on = settings.tenses.includes(tense);
                return (
                  <Chip
                    key={tense}
                    on={on}
                    onClick={() =>
                      update({
                        tenses: on
                          ? settings.tenses.filter((t) => t !== tense)
                          : [...settings.tenses, tense]
                      })
                    }
                  >
                    {tenseLabels[tense]}
                  </Chip>
                );
              })}
            </div>
          </Section>

          <Section title="Verbs">
            <div className="flex flex-wrap gap-2">
              <Chip
                on={settings.scope === 'full'}
                onClick={() => update({ scope: 'full' })}
              >
                Fully conjugated
              </Chip>
              <Chip
                on={settings.scope === 'all'}
                onClick={() => update({ scope: 'all' })}
              >
                All verbs
              </Chip>
            </div>
          </Section>
        </>
      )}

      <Section title="Answer by">
        <div className="flex flex-wrap gap-2">
          <Chip
            on={settings.mode === 'type'}
            onClick={() => update({ mode: 'type' })}
          >
            Typing
          </Chip>
          <Chip
            on={settings.mode === 'reveal'}
            onClick={() => update({ mode: 'reveal' })}
          >
            Just revealing
          </Chip>
        </div>
      </Section>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm text-gray-600">
        {pool.length === 0 ? (
          'Choose at least one tense.'
        ) : (
          <>
            <span className="font-semibold text-gray-900">
              {pool.length} forms
            </span>{' '}
            · {counts.due} due · {counts.new} new · {counts.known} known
          </>
        )}
      </div>

      <button
        type="button"
        disabled={pool.length === 0}
        onClick={() => {
          setRound((r) => r + 1);
          setStarted(true);
        }}
        className="mt-4 w-full rounded-xl bg-cedar-700 py-4 text-lg font-semibold text-white transition hover:bg-cedar-900 disabled:opacity-40"
      >
        Start (up to 20 forms)
      </button>

      <p className="mt-6 text-center text-sm text-gray-500">
        <Link to={backTo} className="hover:text-black">
          {singleVerb ? `Back to ${singleVerb.english}` : 'Back to verbs'}
        </Link>
      </p>
    </main>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Chip({
  on,
  onClick,
  children
}: {
  on: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={[
        'rounded-full px-4 py-2 text-sm font-semibold transition',
        on
          ? 'bg-cedar-700 text-white'
          : 'bg-white text-cedar-700 ring-1 ring-cedar-300 hover:bg-cedar-100'
      ].join(' ')}
    >
      {children}
    </button>
  );
}
