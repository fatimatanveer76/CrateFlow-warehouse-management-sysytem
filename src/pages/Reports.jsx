import { useMemo } from 'react';
import { Download } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useData } from '../context/DataContext';
import { formatCurrency } from '../utils/helpers';
import { exportToCSV } from '../utils/csvExport';

const PIE_COLORS = ['#1E3A5F', '#F2A93B', '#16A34A', '#DC2626', '#334155', '#0EA5E9'];

export default function Reports() {
  const { orders, products, categories, wastageLogs } = useData();

  const revenueByDate = useMemo(() => {
    const map = {};
    orders
      .filter((o) => o.status !== 'Cancelled')
      .forEach((o) => {
        const profit = o.items.reduce((s, i) => s + (i.sellingPrice - i.costPrice) * i.qty, 0);
        if (!map[o.date]) map[o.date] = { date: o.date.slice(5), revenue: 0, profit: 0 };
        map[o.date].revenue += o.total;
        map[o.date].profit += profit;
      });
    return Object.values(map).sort((a, b) => (a.date > b.date ? 1 : -1)).slice(-10);
  }, [orders]);

  const stockByCategory = useMemo(() => {
    return categories
      .map((c) => ({
        name: c.name,
        value: products.filter((p) => p.category === c.id).reduce((s, p) => s + Number(p.quantity), 0),
      }))
      .filter((c) => c.value > 0);
  }, [categories, products]);

  const topProducts = useMemo(() => {
    const soldQty = {};
    orders.forEach((o) => {
      o.items.forEach((i) => {
        soldQty[i.name] = (soldQty[i.name] || 0) + i.qty;
      });
    });
    return Object.entries(soldQty)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 6);
  }, [orders]);

  function handleFullExport() {
    const rows = products.map((p) => ({
      Product: p.name,
      SKU: p.sku,
      Category: categories.find((c) => c.id === p.category)?.name || '',
      CostPrice: p.costPrice,
      SellingPrice: p.sellingPrice,
      Quantity: p.quantity,
      Status: p.status,
    }));
    exportToCSV('full-inventory-report', rows);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <button onClick={handleFullExport} className="btn-primary">
          <Download size={16} /> Export Full Inventory Report
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="mb-4 font-display text-base font-bold text-navy-900 dark:text-white">
            Revenue vs Profit
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueByDate}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94A3B8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94A3B8" />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Legend />
              <Bar dataKey="revenue" fill="#1E3A5F" radius={[4, 4, 0, 0]} name="Revenue" />
              <Bar dataKey="profit" fill="#F2A93B" radius={[4, 4, 0, 0]} name="Profit" />
            </BarChart>
          </ResponsiveContainer>
          {revenueByDate.length === 0 && (
            <p className="text-center text-sm text-slate-400">No order data yet.</p>
          )}
        </div>

        <div className="card p-5">
          <h3 className="mb-4 font-display text-base font-bold text-navy-900 dark:text-white">
            Stock Distribution by Category
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={stockByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {stockByCategory.map((entry, i) => (
                  <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          {stockByCategory.length === 0 && (
            <p className="text-center text-sm text-slate-400">No stock data yet.</p>
          )}
        </div>

        <div className="card p-5 lg:col-span-2">
          <h3 className="mb-4 font-display text-base font-bold text-navy-900 dark:text-white">
            Top Selling Products
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topProducts} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94A3B8" allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} stroke="#94A3B8" width={120} />
              <Tooltip />
              <Bar dataKey="qty" fill="#1E3A5F" radius={[0, 4, 4, 0]} name="Units Sold" />
            </BarChart>
          </ResponsiveContainer>
          {topProducts.length === 0 && (
            <p className="text-center text-sm text-slate-400">No sales data yet.</p>
          )}
        </div>
      </div>

      <div className="card p-5">
        <h3 className="mb-1 font-display text-base font-bold text-navy-900 dark:text-white">Wastage Summary</h3>
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          Total units lost: <span className="font-semibold text-red-600">{wastageLogs.reduce((s, w) => s + w.quantity, 0)}</span>
          {' · '}
          Total loss value: <span className="font-semibold text-red-600">{formatCurrency(wastageLogs.reduce((s, w) => s + w.costAtLoss * w.quantity, 0))}</span>
        </p>
      </div>
    </div>
  );
}
