/**
 * Checks a typed answer against the expected Lebanese.
 *
 * - Alternatives written with "/" in your notes all count ("fiinei/fiiyei").
 * - Extra spaces and end punctuation are ignored.
 * - Capitals matter in the Latin spelling (T is a strong letter, t is not),
 *   so an answer that only differs in capitals is "close", not "correct".
 */
export type Check = 'correct' | 'close' | 'wrong';

export function checkAnswer(typed: string, expected: string): Check {
  const answer = tidy(typed);
  if (!answer) return 'wrong';
  const options = acceptedAnswers(expected);
  if (options.includes(answer)) return 'correct';
  if (options.some((option) => option.toLowerCase() === answer.toLowerCase())) {
    return 'close';
  }
  return 'wrong';
}

export function acceptedAnswers(expected: string): string[] {
  const whole = tidy(expected);
  const parts = expected.split('/').map(tidy).filter(Boolean);
  // "(m)eikel" style optional letters: accept with and without them.
  const withOptional = [whole, ...parts].flatMap((option) =>
    /\(([^)]*)\)/.test(option)
      ? [
          option,
          tidy(option.replace(/\(([^)]*)\)/g, '$1')),
          tidy(option.replace(/\([^)]*\)/g, ''))
        ]
      : [option]
  );
  return [...new Set(withOptional)];
}

function tidy(value: string) {
  return value
    .replace(/\s+/g, ' ')
    .replace(/[.?!,;]+$/, '')
    .trim();
}
