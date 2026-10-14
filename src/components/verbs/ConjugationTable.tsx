import { useState } from 'react';
import { objectLabels, personLabels } from '@/data/verbs';
import type { VerbForm } from '@/types/verbs';

type ConjugationTableProps = {
  forms: VerbForm[];
  hidden?: boolean;
};

export function ConjugationTable({
  forms,
  hidden = false
}: ConjugationTableProps) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  function reveal(index: number) {
    setRevealed((current) => new Set(current).add(index));
  }

  return (
    <div className="mt-3 overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <table className="w-full text-left">
        <tbody className="divide-y divide-cedar-100">
          {forms.map((form, index) => {
            const label = form.tense.startsWith('possessive')
              ? { english: objectLabels[form.person] ?? form.person }
              : personLabels[form.person];
            const isBase = form.person === 'infinitive';
            const show = !hidden || isBase || revealed.has(index);
            return (
              <tr
                key={`${form.person}-${form.lebanese}`}
                className={isBase ? 'bg-cedar-50' : ''}
              >
                <th
                  scope="row"
                  className="w-2/5 px-5 py-3 align-top font-normal"
                >
                  <span className="block font-semibold text-cedar-900">
                    {isBase
                      ? 'base'
                      : label?.hint
                        ? label.english
                        : form.person}
                  </span>
                  <span className="block text-sm text-gray-500">
                    {label?.hint ?? label?.english ?? ''}
                  </span>
                </th>
                <td className="px-5 py-3 align-top">
                  {show ? (
                    <span className="text-lg text-lebanon-redDark">
                      {form.lebanese}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => reveal(index)}
                      className="rounded-lg bg-cedar-100 px-3 py-1 text-sm font-semibold text-cedar-700 transition hover:bg-cedar-300/60"
                    >
                      Tap to reveal
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
