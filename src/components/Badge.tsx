type BadgeProps = {
  type: string;
};

const badgeStyles: Record<string, string> = {
  expression: 'bg-green-100 text-green-700',
  'question word': 'bg-blue-100 text-blue-700',
  preposition: 'bg-amber-100 text-amber-700',
  pronoun: 'bg-purple-100 text-purple-700',
  'subject pronoun': 'bg-purple-100 text-purple-700',
  'demonstrative pronoun': 'bg-purple-100 text-purple-700',
  adjective: 'bg-rose-100 text-rose-700',
  adverb: 'bg-rose-100 text-rose-700',
  noun: 'bg-stone-100 text-stone-700',
  conjunction: 'bg-blue-100 text-blue-700',
  verb: 'bg-cedar-100 text-cedar-700',
  letter: 'bg-sky-100 text-sky-700',
  'vowel sign': 'bg-sky-100 text-sky-700',
  possessive: 'bg-purple-100 text-purple-700',
  'conjunction / adverb': 'bg-blue-100 text-blue-700',
  profession: 'bg-teal-100 text-teal-700',
  person: 'bg-teal-100 text-teal-700',
  country: 'bg-orange-100 text-orange-700',
  place: 'bg-orange-100 text-orange-700',
  number: 'bg-indigo-100 text-indigo-700',
  time: 'bg-indigo-100 text-indigo-700',
  food: 'bg-lime-100 text-lime-700',
  'similar words': 'bg-pink-100 text-pink-700'
};

export function Badge({ type }: BadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${
        badgeStyles[type.toLowerCase()] ?? 'bg-gray-100 text-gray-600'
      }`}
    >
      {type}
    </span>
  );
}
