import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Layers,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Trash2,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useData } from '../context/DataContext';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency, formatDate } from '../utils/helpers';

export default function Dashboard() {
  const { products, orders, wastageLogs, settings, stockInLogs, stockOutLogs, categories } = useData();

  const stats = useMemo(() => {
    const activeOrders = orders.filter((o) => o.status !== 'Cancelled');
    const revenue = activeOrders.reduce((sum, o) => sum + o.total, 0);
    const profit = activeOrders.reduce(
      (sum, o) => sum + o.items.reduce((s, i) => s + (i.sellingPrice - i.costPrice) * i.qty, 0),
      0
    );
    const loss = wastageLogs.reduce((sum, w) => sum + w.costAtLoss * w.quantity, 0);
    const wastageUnits = wastageLogs.reduce((sum, w) => sum + w.quantity, 0);
    const pending = orders.filter((o) => o.status === 'Pending').length;
    const totalStock = products.reduce((sum, p) => sum + Number(p.quantity || 0), 0);

    return {
      totalProducts: products.length,
      totalStock,
      totalOrders: orders.length,
      revenue,
      profit,
      loss,
      wastageUnits,
      pending,
    };
  }, [products, orders, wastageLogs]);

  const lowStock = products.filter((p) => Number(p.quantity) <= Number(settings.lowStockThreshold));

  const trend = useMemo(() => {
    const days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().slice(0, 10);
    });
    return days.map((date) => ({
      date: date.slice(5),
      in: stockInLogs.filter((l) => l.date === date).reduce((s, l) => s + l.quantity, 0),
      out: stockOutLogs.filter((l) => l.date === date).reduce((s, l) => s + l.quantity, 0),
    }));
  }, [stockInLogs, stockOutLogs]);

  const categoryName = (id) => categories.find((c) => c.id === id)?.name || '—';

  return (
    <div className="space-y-6">
      {lowStock.length > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
              {lowStock.length} product{lowStock.length > 1 ? 's' : ''} running low on stock
            </p>
            <p className="mt-0.5 truncate text-xs text-amber-700/80 dark:text-amber-400/80">
              {lowStock.map((p) => p.name).join(', ')}
            </p>
          </div>
          <Link to="/products" className="ml-auto shrink-0 text-xs font-semibold text-amber-800 hover:underline dark:text-amber-300">
            View
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Package} label="Total Products" value={stats.totalProducts} tone="default" />
        <StatCard icon={Layers} label="Total Stock" value={stats.totalStock} tone="amber" />
        <StatCard icon={ShoppingCart} label="Orders" value={stats.totalOrders} tone="default" />
        <StatCard icon={Clock} label="Pending Orders" value={stats.pending} tone="amber" />
        <StatCard icon={DollarSign} label="Revenue" value={formatCurrency(stats.revenue)} tone="green" />
        <StatCard icon={TrendingUp} label="Profit" value={formatCurrency(stats.profit)} tone="green" />
        <StatCard icon={TrendingDown} label="Loss" value={formatCurrency(stats.loss)} tone="red" />
        <StatCard icon={Trash2} label="Wastage (units)" value={stats.wastageUnits} tone="red" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-navy-900 dark:text-white">
              Stock Movement — Last 7 Days
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="inGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1E3A5F" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#1E3A5F" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="outGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F2A93B" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#F2A93B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94A3B8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94A3B8" allowDecimals={false} />
              <Tooltip />
              <Area type="monotone" dataKey="in" stroke="#1E3A5F" fill="url(#inGrad)" name="Stock In" strokeWidth={2} />
              <Area type="monotone" dataKey="out" stroke="#D98F1F" fill="url(#outGrad)" name="Stock Out" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="mb-4 font-display text-base font-bold text-navy-900 dark:text-white">
            Recent Orders
          </h3>
          <div className="space-y-3">
            {orders.slice(0, 5).map((o) => (
              <div key={o.id} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0 last:pb-0 dark:border-navy-700/60">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-navy-800 dark:text-slate-200">{o.customer}</p>
                  <p className="text-xs text-slate-400">{formatDate(o.date)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-navy-900 dark:text-white">{formatCurrency(o.total)}</p>
                  <StatusBadge status={o.status} />
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="py-6 text-center text-sm text-slate-400">No orders yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-slate-100 p-4 dark:border-navy-700">
          <h3 className="font-display text-base font-bold text-navy-900 dark:text-white">Low Stock Watchlist</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-navy-700">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Product</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Category</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Quantity</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {lowStock.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-400">
                    All products are well stocked.
                  </td>
                </tr>
              )}
              {lowStock.map((p) => (
                <tr key={p.id} className="border-b border-slate-50 last:border-0 dark:border-navy-700/60">
                  <td className="px-4 py-3 font-medium text-navy-800 dark:text-slate-200">{p.name}</td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{categoryName(p.category)}</td>
                  <td className="px-4 py-3 font-mono text-navy-800 dark:text-slate-200">{p.quantity}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status="Low Stock" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
