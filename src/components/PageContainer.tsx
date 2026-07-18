import type { ReactNode } from 'react';

type PageContainerProps = {
  children: ReactNode;
};

export function PageContainer({ children }: PageContainerProps) {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col px-6 py-10">
      {children}
    </main>
  );
}
