type BadgeProps = {
  type: 'word' | 'grammar' | 'rule' | 'dialogue';
};

const badgeStyles = {
  word: 'bg-green-100 text-green-700',
  grammar: 'bg-blue-100 text-blue-700',
  rule: 'bg-amber-100 text-amber-700',
  dialogue: 'bg-purple-100 text-purple-700'
};

export function Badge({ type }: BadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize tracking-wide ${badgeStyles[type]}`}
    >
      {type}
    </span>
  );
}
