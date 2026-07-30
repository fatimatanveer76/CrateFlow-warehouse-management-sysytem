import { useState } from 'react';
import { ArrowDownToLine } from 'lucide-react';
import { useData } from '../context/DataContext';
import DataTable from '../components/DataTable';
import { formatDate } from '../utils/helpers';

export default function StockIn() {
  const { products, stockInLogs, stockIn } = useData();
  const [form, setForm] = useState({ productId: '', quantity: '', note: '' });

  function handleSubmit(e) {
    e.preventDefault();
    stockIn({ productId: form.productId, quantity: form.quantity, note: form.note });
    setForm({ productId: '', quantity: '', note: '' });
  }

  const productName = (id) => products.find((p) => p.id === id)?.name || 'Deleted product';

  const rows = stockInLogs.map((l) => ({ ...l, productName: productName(l.productId) }));

  const columns = [
    { key: 'productName', label: 'Product' },
    { key: 'quantity', label: 'Quantity Added', render: (r) => <span className="font-mono font-semibold text-emerald-600">+{r.quantity}</span> },
    { key: 'note', label: 'Note', render: (r) => r.note || '—' },
    { key: 'date', label: 'Date', render: (r) => formatDate(r.date) },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="card h-fit p-5 lg:col-span-1">
        <h3 className="mb-4 flex items-center gap-2 font-display text-base font-bold text-navy-900 dark:text-white">
          <ArrowDownToLine size={18} className="text-emerald-600" /> Log Stock In
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-field">Product</label>
            <select required className="input-field" value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })}>
              <option value="">Select product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-field">Quantity</label>
            <input type="number" min="1" required className="input-field" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
          </div>
          <div>
            <label className="label-field">Note (optional)</label>
            <input className="input-field" placeholder="e.g. New shipment from supplier" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
          </div>
          <button type="submit" className="btn-primary w-full">
            <ArrowDownToLine size={16} /> Add Stock
          </button>
        </form>
      </div>

      <div className="lg:col-span-2">
        <DataTable
          columns={columns}
          data={rows}
          searchKeys={['productName', 'note']}
          exportName="stock-in-log"
          emptyMessage="No stock-in records yet."
        />
      </div>
    </div>
  );
}
