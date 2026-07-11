import { Outlet } from 'react-router-dom';
import { TopNavigation } from '@/components/layout/TopNavigation';

export function App() {
  return (
    <div className="min-h-screen bg-cedar-50 text-lebanon-ink">
      <TopNavigation />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
