import { useState } from 'react';
import { Save, Moon, Sun } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { settings, updateSettings } = useData();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [threshold, setThreshold] = useState(settings.lowStockThreshold);

  function handleSubmit(e) {
    e.preventDefault();
    updateSettings({ lowStockThreshold: Number(threshold) });
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="card p-5">
        <h3 className="mb-4 font-display text-base font-bold text-navy-900 dark:text-white">Account</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="label-field">Name</p>
            <p className="text-navy-800 dark:text-slate-200">{user?.name}</p>
          </div>
          <div>
            <p className="label-field">Email</p>
            <p className="text-navy-800 dark:text-slate-200">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="mb-4 font-display text-base font-bold text-navy-900 dark:text-white">Appearance</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-navy-800 dark:text-slate-200">Dark Mode</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Switch between light and dark interface</p>
          </div>
          <button onClick={toggleTheme} className="btn-secondary">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="mb-1 font-display text-base font-bold text-navy-900 dark:text-white">Inventory Alerts</h3>
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          Set the quantity threshold that triggers a low stock warning.
        </p>
        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          <div className="flex-1">
            <label className="label-field">Low Stock Threshold</label>
            <input
              type="number"
              min="0"
              className="input-field"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary">
            <Save size={16} /> Save
          </button>
        </form>
      </div>
    </div>
  );
}
