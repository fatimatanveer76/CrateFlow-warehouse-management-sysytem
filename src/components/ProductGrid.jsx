import { useMemo, useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Plus, Pencil, Trash2, Download } from 'lucide-react';
import ProductImage from './ProductImage';
import StatusBadge from './StatusBadge';
import { formatCurrency } from '../utils/helpers';
import { exportToCSV } from '../utils/csvExport';

const PAGE_SIZE = 8;

export default function ProductGrid({
  products,
  categories,
  suppliers,
  settings,
  onAdd,
  onEdit,
  onDelete,
}) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const categoryName = (id) => categories.find((c) => c.id === id)?.name || '—';
  const supplierName = (id) => suppliers.find((s) => s.id === id)?.name || '—';

  const filtered = useMemo(() => {
    if (!query.trim()) return products;
    const q = query.toLowerCase();
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
    );
  }, [products, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const pageItems = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  function handleExport() {
    exportToCSV(
      'products-storefront',
      filtered.map((p) => ({
        Product: p.name,
        SKU: p.sku,
        Category: categoryName(p.category),
        Price: p.sellingPrice,
        Quantity: p.quantity,
        Status: p.status,
      }))
    );
  }

  return (
    <div className="space-y-4">
      <div className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search products..."
            className="input-field pl-9"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="btn-secondary">
            <Download size={16} /> Export CSV
          </button>
          <button onClick={onAdd} className="btn-primary">
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {pageItems.length === 0 ? (
        <div className="card p-12 text-center text-sm text-slate-400">No products found.</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {pageItems.map((p) => {
            const lowStock = Number(p.quantity) <= Number(settings.lowStockThreshold);
            return (
              <div
                key={p.id}
                className="card group flex flex-col overflow-hidden transition hover:shadow-card-lg"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-slate-50 dark:bg-navy-900">
                  <ProductImage src={p.image} alt={p.name} size="lg" rounded="rounded-none" />
                  <div className="absolute left-2 top-2">
                    <StatusBadge status={lowStock ? 'Low Stock' : p.status} />
                  </div>
                  <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition group-hover:opacity-100">
                    <button
                      onClick={() => onEdit(p)}
                      className="rounded-lg bg-white/90 p-1.5 text-navy-700 shadow-card hover:bg-white dark:bg-navy-800/90 dark:text-slate-200"
                      aria-label="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(p.id)}
                      className="rounded-lg bg-white/90 p-1.5 text-red-600 shadow-card hover:bg-white dark:bg-navy-800/90"
                      aria-label="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-1 p-3.5">
                  <p className="truncate text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {categoryName(p.category)}
                  </p>
                  <p className="truncate text-sm font-semibold text-navy-900 dark:text-white" title={p.name}>
                    {p.name}
                  </p>
                  <p className="font-mono text-[11px] text-slate-400">{p.sku}</p>
                  <div className="mt-auto flex items-end justify-between pt-2">
                    <p className="font-display text-lg font-bold text-navy-900 dark:text-amber-400">
                      {formatCurrency(p.sellingPrice)}
                    </p>
                    <p className="text-xs text-slate-400">{p.quantity} in stock</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filtered.length > 0 && (
        <div className="card flex items-center justify-between px-4 py-3">
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
