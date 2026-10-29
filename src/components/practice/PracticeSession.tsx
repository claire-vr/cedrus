import { useEffect, useRef, useState, type FormEvent, type Ref } from 'react';
import { Link } from 'react-router-dom';
import { checkAnswer, type Check } from '@/lib/answers';
import { recordAnswer } from '@/lib/progress';
import { isArabic } from '@/lib/script';

export type PracticeCard = {
  id: string;
  /** Small line above the question, e.g. "to write · katab". */
  context?: string;
  /** The question itself, e.g. "hello" or "hiiye". */
  prompt: string;
  /** Small line under the question, e.g. "she · Present". */
  cue?: string;
  answer: string;
  note?: string;
  /** Small line under the revealed answer, e.g. the infinitive "(katab)". */
  answerHint?: string;
  /** Cards with the same group (a phrase and its replies) stay together, in order. */
  group?: string;
  /** The word and its other forms, shown under "Linked items" after answering. */
  linked?: { label: string; lebanese: string }[];
};

type Mode = 'reveal' | 'type';

type PracticeSessionProps = {
  cards: PracticeCard[];
  mode: Mode;
  backTo: string;
  backLabel: string;
  onRestart: () => void;
};

/** How many cards later a missed card comes back in the same round. */
const RETRY_GAP = 3;

export function PracticeSession({
  cards,
  mode,
  backTo,
  backLabel,
  onRestart
}: PracticeSessionProps) {
  const [queue, setQueue] = useState(cards);
  const [answered, setAnswered] = useState(false);
  const [typed, setTyped] = useState('');
  const [check, setCheck] = useState<Check | null>(null);
  const [gaveUp, setGaveUp] = useState(false);
  const [showLinked, setShowLinked] = useState(false);
  const [showNote, setShowNote] = useState(false);
  // First answer per card in this round; only that one counts for progress.
  const [results, setResults] = useState<Record<string, boolean>>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const card = queue[0];
  const total = cards.length;
  const done = Object.keys(results).length;

  useEffect(() => {
    if (!answered && mode === 'type') inputRef.current?.focus();
    if (answered) nextRef.current?.focus();
  }, [answered, card, mode]);

  if (!card) {
    return (
      <Summary
        cards={cards}
        results={results}
        backTo={backTo}
        backLabel={backLabel}
        onRestart={onRestart}
      />
    );
  }

  function submit(event?: FormEvent) {
    event?.preventDefault();
    if (answered) return;
    if (mode === 'type') {
      setGaveUp(typed.trim() === '');
      setCheck(checkAnswer(typed, card.answer));
    }
    setAnswered(true);
  }

  function grade(knewIt: boolean) {
    if (!(card.id in results)) {
      recordAnswer(card.id, knewIt);
      setResults((r) => ({ ...r, [card.id]: knewIt }));
    }
    setQueue((current) => {
      const rest = current.slice(1);
      if (knewIt) return rest;
      // Missed: try again a few cards later in this round.
      const at = Math.min(RETRY_GAP, rest.length);
      return [...rest.slice(0, at), card, ...rest.slice(at)];
    });
    setAnswered(false);
    setTyped('');
    setCheck(null);
    setGaveUp(false);
    setShowLinked(false);
    setShowNote(false);
  }

  const retry = card.id in results;

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-5 flex items-center gap-3 text-sm text-gray-500">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-cedar-100">
          <div
            className="h-full rounded-full bg-cedar-500 transition-all"
            style={{ width: `${(done / total) * 100}%` }}
          />
        </div>
        <span className="tabular-nums">
          {done}/{total}
        </span>
      </div>

      <form
        onSubmit={submit}
        onClick={() => mode === 'reveal' && !answered && submit()}
        className={[
          'flex flex-1 flex-col justify-center rounded-2xl border bg-white px-6 py-10 text-center shadow-soft',
          mode === 'reveal' && !answered ? 'cursor-pointer' : '',
          check === 'correct'
            ? 'border-cedar-500'
            : check === 'wrong'
              ? 'border-lebanon-red/50'
              : 'border-cedar-300'
        ].join(' ')}
      >
        {retry && (
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-lebanon-redDark">
            Try again
          </p>
        )}
        {card.context && (
          <p className="text-base text-gray-500">{card.context}</p>
        )}
        {isArabic(card.prompt) ? (
          <p
            lang="ar"
            dir="auto"
            className="mt-1 text-7xl leading-tight text-gray-900"
          >
            {card.prompt}
          </p>
        ) : (
          <p className="mt-1 text-4xl font-bold text-gray-900">{card.prompt}</p>
        )}
        {card.cue && <p className="mt-2 text-lg text-cedar-700">{card.cue}</p>}
        {card.note && (
          // A hint you can open before or after revealing the answer.
          <div className="mt-3" onClick={(event) => event.stopPropagation()}>
            {showNote ? (
              <button
                type="button"
                onClick={() => setShowNote(false)}
                className="mx-auto max-w-sm text-sm italic text-gray-600"
              >
                {card.note}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowNote(true)}
                className="rounded-full px-3 py-1 text-xs font-semibold text-gray-500 ring-1 ring-gray-300 hover:bg-gray-50"
              >
                Tap for note
              </button>
            )}
          </div>
        )}

        <div className="mt-10 min-h-[6rem]">
          {mode === 'type' && (
            <input
              ref={inputRef}
              value={typed}
              onChange={(event) => setTyped(event.target.value)}
              readOnly={answered}
              placeholder="Type in Lebanese…"
              aria-label="Your answer"
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              spellCheck={false}
              className={[
                'w-full rounded-xl border px-4 py-3 text-center text-2xl outline-none transition focus:ring-4 focus:ring-cedar-300/40',
                check === 'correct'
                  ? 'border-cedar-500 bg-cedar-50'
                  : check === 'close'
                    ? 'border-amber-400 bg-amber-50'
                    : check === 'wrong'
                      ? 'border-lebanon-red/50 bg-red-50'
                      : 'border-cedar-300'
              ].join(' ')}
            />
          )}

          {answered ? (
            <div className="mt-5">
              {check && <Verdict check={check} gaveUp={gaveUp} />}
              <div className="mt-2 flex items-baseline justify-center gap-4">
                <span className="text-3xl text-lebanon-redDark">
                  {card.answer}
                </span>
              </div>
              {card.answerHint && (
                <p className="mt-1 text-lg text-gray-500">{card.answerHint}</p>
              )}
              {card.linked && (
                <div
                  className="mt-4"
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => setShowLinked((open) => !open)}
                    className="rounded-full px-4 py-1.5 text-sm font-semibold text-cedar-700 ring-1 ring-cedar-300 hover:bg-cedar-50"
                  >
                    {showLinked
                      ? 'Hide linked items'
                      : `Linked items (${card.linked.length})`}
                  </button>
                  {showLinked && (
                    <ul className="mx-auto mt-3 max-w-sm divide-y divide-cedar-100 text-left">
                      {card.linked.map((entry) => (
                        <li
                          key={`${entry.label}:${entry.lebanese}`}
                          className={[
                            'flex justify-between gap-4 px-2 py-1.5',
                            entry.lebanese === card.answer
                              ? 'bg-cedar-50 font-semibold'
                              : ''
                          ].join(' ')}
                        >
                          <span className="text-gray-600">{entry.label}</span>
                          <span className="text-right text-lebanon-redDark">
                            {entry.lebanese}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ) : mode === 'reveal' ? (
            <p className="text-lg text-gray-400">Tap to reveal</p>
          ) : null}
        </div>
      </form>

      <div className="mt-6">
        {!answered ? (
          mode === 'type' ? (
            <div className="grid grid-cols-[1fr_2fr] gap-3">
              <BigButton variant="quiet" onClick={() => submit()}>
                Show
              </BigButton>
              <BigButton variant="primary" onClick={() => submit()}>
                Check
              </BigButton>
            </div>
          ) : null
        ) : check === 'correct' ? (
          <BigButton
            variant="primary"
            onClick={() => grade(true)}
            buttonRef={nextRef}
          >
            Next →
          </BigButton>
        ) : check === 'close' ? (
          <div className="grid grid-cols-2 gap-3">
            <BigButton variant="miss" onClick={() => grade(false)}>
              Mark wrong
            </BigButton>
            <BigButton
              variant="primary"
              onClick={() => grade(true)}
              buttonRef={nextRef}
            >
              Count it
            </BigButton>
          </div>
        ) : check === 'wrong' ? (
          <div className="space-y-2">
            <BigButton
              variant="primary"
              onClick={() => grade(false)}
              buttonRef={nextRef}
            >
              Next →
            </BigButton>
            <button
              type="button"
              onClick={() => grade(true)}
              className="w-full py-2 text-sm text-gray-500 underline-offset-2 hover:underline"
            >
              I was right (count it)
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <BigButton variant="miss" onClick={() => grade(false)}>
              Didn’t know
            </BigButton>
            <BigButton
              variant="primary"
              onClick={() => grade(true)}
              buttonRef={nextRef}
            >
              Knew it
            </BigButton>
          </div>
        )}
      </div>
    </div>
  );
}

function Verdict({ check, gaveUp }: { check: Check; gaveUp: boolean }) {
  const text = {
    correct: 'Correct!',
    close: 'Almost: check the capitals',
    wrong: gaveUp ? 'The answer is:' : 'Not quite. The answer is:'
  }[check];
  const color = {
    correct: 'text-cedar-700',
    close: 'text-amber-700',
    wrong: 'text-lebanon-redDark'
  }[check];
  return <p className={`text-sm font-semibold ${color}`}>{text}</p>;
}

function BigButton({
  children,
  onClick,
  variant,
  buttonRef
}: {
  children: string;
  onClick: () => void;
  variant: 'primary' | 'miss' | 'quiet';
  buttonRef?: Ref<HTMLButtonElement>;
}) {
  const styles = {
    primary: 'bg-cedar-700 text-white hover:bg-cedar-900',
    miss: 'bg-white text-lebanon-redDark ring-1 ring-lebanon-red/30 hover:bg-red-50',
    quiet: 'bg-white text-cedar-700 ring-1 ring-cedar-300 hover:bg-cedar-50'
  }[variant];
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl py-4 text-lg font-semibold transition focus:outline-none focus:ring-4 focus:ring-cedar-300/50 ${styles}`}
    >
      {children}
    </button>
  );
}

function Summary({
  cards,
  results,
  backTo,
  backLabel,
  onRestart
}: {
  cards: PracticeCard[];
  results: Record<string, boolean>;
  backTo: string;
  backLabel: string;
  onRestart: () => void;
}) {
  const missed = cards.filter((card) => results[card.id] === false);
  const knew = cards.length - missed.length;

  return (
    <div className="flex flex-1 flex-col">
      <div className="rounded-2xl border border-cedar-300 bg-white px-6 py-8 text-center shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-wide text-cedar-700">
          Round complete
        </p>
        <p className="mt-2 text-4xl font-bold text-cedar-900">
          {knew} / {cards.length}
        </p>
        <p className="mt-1 text-gray-500">known on the first try</p>
      </div>

      {missed.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-semibold text-gray-600">
            Coming back soon
          </h2>
          <ul className="mt-2 divide-y divide-cedar-100 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {missed.map((card) => (
              <li
                key={card.id}
                className="flex justify-between gap-4 px-5 py-3"
              >
                <span className="text-gray-700">
                  {card.context ? `${card.context} · ` : ''}
                  {card.prompt}
                  {card.cue ? ` (${card.cue})` : ''}
                </span>
                <span className="text-right text-lebanon-redDark">
                  {card.answer}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-8 grid grid-cols-2 gap-3">
        <Link
          to={backTo}
          className="rounded-xl bg-white py-4 text-center text-lg font-semibold text-cedar-700 ring-1 ring-cedar-300 hover:bg-cedar-50"
        >
          {backLabel}
        </Link>
        <BigButton variant="primary" onClick={onRestart}>
          Another round
        </BigButton>
      </div>
    </div>
  );
}
