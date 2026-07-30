import { useState } from 'react';
import { Menu, Moon, Sun, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ onMenuClick, title }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3.5 backdrop-blur dark:border-navy-700 dark:bg-navy-900/90 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="text-navy-600 hover:text-navy-900 dark:text-slate-300 dark:hover:text-white md:hidden"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <h1 className="font-display text-lg font-bold text-navy-900 dark:text-white sm:text-xl">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-navy-500 transition hover:bg-slate-100 dark:text-amber-400 dark:hover:bg-navy-800"
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-slate-100 dark:hover:bg-navy-800"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-700 text-xs font-bold text-white dark:bg-amber-500 dark:text-navy-950">
              {user?.name?.slice(0, 1).toUpperCase() || 'U'}
            </div>
            <span className="hidden text-sm font-medium text-navy-800 dark:text-slate-200 sm:block">
              {user?.name}
            </span>
            <ChevronDown size={16} className="hidden text-navy-400 sm:block" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 rounded-lg border border-slate-200 bg-white py-1.5 shadow-card-lg dark:border-navy-700 dark:bg-navy-800">
              <div className="border-b border-slate-100 px-3.5 py-2 dark:border-navy-700">
                <p className="truncate text-sm font-semibold text-navy-900 dark:text-white">{user?.name}</p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="flex w-full items-center gap-2 px-3.5 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <LogOut size={15} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
