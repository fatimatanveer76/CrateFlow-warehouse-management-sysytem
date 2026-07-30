import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import DataTable from '../components/DataTable';
import { formatCurrency, formatDate } from '../utils/helpers';

const REASONS = ['Damaged', 'Expired', 'Lost', 'Quality Issue', 'Other'];

export default function Wastage() {
  const { products, wastageLogs, addWastage, deleteWastage } = useData();
  const [form, setForm] = useState({ productId: '', quantity: '', reason: 'Damaged' });

  function handleSubmit(e) {
    e.preventDefault();
    addWastage(form);
    setForm({ productId: '', quantity: '', reason: 'Damaged' });
  }

  const productName = (id) => products.find((p) => p.id === id)?.name || 'Deleted product';
  const rows = wastageLogs.map((l) => ({ ...l, productName: productName(l.productId), lossValue: l.costAtLoss * l.quantity }));

  const columns = [
    { key: 'productName', label: 'Product' },
    { key: 'quantity', label: 'Qty Lost' },
    { key: 'reason', label: 'Reason' },
    { key: 'lossValue', label: 'Loss Value', render: (r) => <span className="font-semibold text-red-600">{formatCurrency(r.lossValue)}</span> },
    { key: 'date', label: 'Date', render: (r) => formatDate(r.date) },
    {
      key: 'actions',
      label: 'Actions',
      csv: () => '',
      render: (row) => (
        <button onClick={() => deleteWastage(row.id)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
          <Trash2 size={15} />
        </button>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="card h-fit p-5 lg:col-span-1">
        <h3 className="mb-4 flex items-center gap-2 font-display text-base font-bold text-navy-900 dark:text-white">
          <Trash2 size={18} className="text-red-600" /> Record Wastage
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-field">Product</label>
            <select required className="input-field" value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })}>
              <option value="">Select product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.quantity} in stock)</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-field">Quantity</label>
            <input type="number" min="1" required className="input-field" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
          </div>
          <div>
            <label className="label-field">Reason</label>
            <select className="input-field" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}>
              {REASONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-danger w-full">
            <Trash2 size={16} /> Record Wastage
          </button>
        </form>
      </div>

      <div className="lg:col-span-2">
        <DataTable
          columns={columns}
          data={rows}
          searchKeys={['productName', 'reason']}
          exportName="wastage-log"
          emptyMessage="No wastage recorded yet."
        />
      </div>
    </div>
  );
}
