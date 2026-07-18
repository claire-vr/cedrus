type PageHeaderProps = {
  title: string;
  subtitle?: string;
};

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="text-4xl font-bold tracking-tight">{title}</h1>

      {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
    </header>
  );
}
