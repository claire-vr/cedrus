import { NavLink, useLocation } from 'react-router-dom';

const links = [
  // Verbs live under Browse, so /verbs highlights Browse too.
  { to: '/topics', label: 'Browse', alsoActiveOn: ['/verbs'] },
  { to: '/settings', label: 'Settings', alsoActiveOn: [] }
];

export function TopNavigation() {
  const { pathname } = useLocation();

  return (
    <header className="border-b border-cedar-100 bg-cedar-50/90 backdrop-blur">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-2 px-4 sm:px-8">
        <NavLink
          to="/"
          className="text-xl font-bold tracking-normal text-cedar-900"
        >
          Cedrus
        </NavLink>
        <div className="flex items-center gap-1 sm:gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                [
                  'rounded-full px-3 py-2 text-sm font-semibold transition sm:px-4',
                  isActive ||
                  link.alsoActiveOn.some((path) => pathname.startsWith(path))
                    ? 'bg-cedar-700 text-white'
                    : 'text-cedar-700 hover:bg-cedar-100'
                ].join(' ')
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
