import { NavLink } from 'react-router-dom';

export function TopNavigation() {
  return (
    <header className="border-b border-cedar-100 bg-cedar-50/90 backdrop-blur">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <NavLink
          to="/"
          className="text-xl font-bold tracking-normal text-cedar-900"
        >
          Cedrus
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            [
              'rounded-full px-4 py-2 text-sm font-semibold transition',
              isActive
                ? 'bg-cedar-700 text-white'
                : 'text-cedar-700 hover:bg-cedar-100'
            ].join(' ')
          }
        >
          Settings
        </NavLink>
      </nav>
    </header>
  );
}
