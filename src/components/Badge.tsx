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
  verb: 'bg-cedar-100 text-cedar-700'
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
