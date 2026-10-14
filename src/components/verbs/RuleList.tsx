import type { VerbRule } from '@/types/verbs';

type RuleListProps = {
  rules: VerbRule[];
  className?: string;
};

export function RuleList({ rules, className = '' }: RuleListProps) {
  return (
    <ul className={`space-y-3 ${className}`}>
      {rules.map((rule) => (
        <li
          key={rule.id}
          className="rounded-xl border border-amber-200 bg-amber-50/60 px-5 py-4 leading-relaxed text-gray-800"
        >
          {rule.about && (
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-amber-700">
              {rule.about}
            </span>
          )}
          {rule.text}
        </li>
      ))}
    </ul>
  );
}
