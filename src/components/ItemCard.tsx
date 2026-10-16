import type { Item } from '@/types/types';
import { Badge } from '@/components/Badge';
import { ConjugationTable } from '@/components/verbs/ConjugationTable';
import { isArabic } from '@/lib/script';
import { examplesForItem, parentOf } from '@/data/database';

type ItemCardProps = {
  item: Item;
};

export function ItemCard({ item }: ItemCardProps) {
  const formGroups = [...new Set(item.forms.map((form) => form.form))];
  const itemExamples = examplesForItem(item);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
        {isArabic(item.english) ? (
          <h3
            lang="ar"
            dir="auto"
            className="text-4xl leading-tight text-gray-900"
          >
            {item.english}
          </h3>
        ) : (
          <h3 className="text-lg font-semibold text-gray-900">
            {item.english}
          </h3>
        )}
        {item.type && <Badge type={item.type} />}
      </div>
      <p className="mt-1 text-xl text-lebanon-redDark">{item.lebanese}</p>
      {parentOf(item) && (
        <p className="mt-1 text-sm text-cedar-700">
          ↩ reply to “{item.follows}” ({parentOf(item)?.lebanese})
        </p>
      )}
      {item.notes && (
        <p className="mt-1 text-sm italic text-gray-500">{item.notes}</p>
      )}

      {itemExamples.length > 0 && (
        <ul className="mt-3 space-y-2 border-l-2 border-cedar-300 pl-3">
          {itemExamples.map((example, index) => (
            <li key={index}>
              <p className="text-sm text-gray-600">{example.english}</p>
              <p className="text-base text-lebanon-redDark">
                {example.lebanese}
              </p>
            </li>
          ))}
        </ul>
      )}

      {formGroups.length > 0 && (
        <details className="group mt-3">
          <summary className="cursor-pointer list-none text-sm font-semibold text-cedar-700 hover:text-cedar-900">
            <span className="inline-block transition group-open:rotate-90">
              ›
            </span>{' '}
            {formGroups.join(' · ')} ({item.forms.length})
          </summary>
          {formGroups.map((group) => (
            <div key={group} className="mt-2">
              {formGroups.length > 1 && (
                <p className="mt-3 text-sm font-semibold capitalize text-gray-600">
                  {group}
                </p>
              )}
              <ConjugationTable
                forms={item.forms
                  .filter((form) => form.form === group)
                  .map((form) => ({ ...form, tense: form.form }))}
              />
            </div>
          ))}
        </details>
      )}
    </div>
  );
}
