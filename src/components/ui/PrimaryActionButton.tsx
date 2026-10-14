type PrimaryActionButtonProps = {
  children: string;
  onClick?: () => void;
};

export function PrimaryActionButton({
  children,
  onClick
}: PrimaryActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-24 w-full rounded-lg border border-cedar-300 bg-white px-6 py-5 text-2xl font-bold text-cedar-900 shadow-soft transition hover:-translate-y-0.5 hover:border-cedar-500 hover:bg-cedar-50 focus:outline-none focus:ring-4 focus:ring-cedar-300/50"
    >
      {children}
    </button>
  );
}
