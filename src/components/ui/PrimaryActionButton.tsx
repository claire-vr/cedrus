import { useNavigate } from 'react-router-dom';

type PrimaryActionButtonProps = {
  children: string;
};

export function PrimaryActionButton({ children }: PrimaryActionButtonProps) {
    const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => {
        if (children === 'Browse') {
        navigate('/topics');
        }
      }}
      className="min-h-24 w-full rounded-lg border border-cedar-300 bg-white px-6 py-5 text-2xl font-bold text-cedar-900 shadow-soft transition hover:-translate-y-0.5 hover:border-cedar-500 hover:bg-cedar-50 focus:outline-none focus:ring-4 focus:ring-cedar-300/50"
    >
      {children}
    </button>
  );
}
