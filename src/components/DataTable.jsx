import { useMemo, useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Download, Plus } from 'lucide-react';
import { exportToCSV } from '../utils/csvExport';

const PAGE_SIZE = 8;

export default function DataTable({
  columns,
  data,
  searchKeys = [],
  onAdd,
  addLabel = 'Add',
  exportName = 'export',
  emptyMessage = 'No records yet.',
}) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!query.trim()) return data;
    const q = query.toLowerCase();
    return data.filter((row) =>
      searchKeys.some((key) => String(row[key] ?? '').toLowerCase().includes(q))
    );
  }, [data, query, searchKeys]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const pageRows = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  function handleExport() {
    const rows = filtered.map((row) => {
      const flat = {};
      columns.forEach((col) => {
        flat[col.label] = col.csv ? col.csv(row) : row[col.key];
      });
      return flat;
    });
    exportToCSV(exportName, rows);
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 dark:border-navy-700 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search..."
            className="input-field pl-9"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="btn-secondary">
            <Download size={16} /> Export CSV
          </button>
          {onAdd && (
            <button onClick={onAdd} className="btn-primary">
              <Plus size={16} /> {addLabel}
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-navy-700">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-slate-400">
                  {emptyMessage}
                </td>
              </tr>
            )}
            {pageRows.map((row, i) => (
              <tr
                key={row.id || i}
                className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70 dark:border-navy-700/60 dark:hover:bg-navy-700/30"
              >
                {columns.map((col) => (
                  <td key={col.key} className="whitespace-nowrap px-4 py-3 text-navy-800 dark:text-slate-200">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length > 0 && (
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 dark:border-navy-700">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showing {(pageSafe - 1) * PAGE_SIZE + 1}–{Math.min(pageSafe * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={pageSafe === 1}
              className="rounded-lg border border-slate-200 p-1.5 text-navy-600 disabled:opacity-40 dark:border-navy-600 dark:text-slate-300"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-2 text-xs font-medium text-navy-700 dark:text-slate-300">
              {pageSafe} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={pageSafe === totalPages}
              className="rounded-lg border border-slate-200 p-1.5 text-navy-600 disabled:opacity-40 dark:border-navy-600 dark:text-slate-300"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
