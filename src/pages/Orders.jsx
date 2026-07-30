import { useState } from 'react';
import { Plus, Trash2, ShoppingCart, X } from 'lucide-react';
import { useData } from '../context/DataContext';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency, formatDate } from '../utils/helpers';

const STATUSES = ['Pending', 'Completed', 'Cancelled'];

export default function Orders() {
  const { orders, products, createOrder, updateOrderStatus, deleteOrder } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [customer, setCustomer] = useState('');
  const [items, setItems] = useState([{ productId: '', qty: 1 }]);

  function openAdd() {
    setCustomer('');
    setItems([{ productId: '', qty: 1 }]);
    setModalOpen(true);
  }

  function updateItem(index, updates) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...updates } : it)));
  }
  function addItemRow() {
    setItems((prev) => [...prev, { productId: '', qty: 1 }]);
  }
  function removeItemRow(index) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  const total = items.reduce((sum, it) => {
    const product = products.find((p) => p.id === it.productId);
    return sum + (product ? product.sellingPrice * Number(it.qty || 0) : 0);
  }, 0);

  function handleSubmit(e) {
    e.preventDefault();
    const validItems = items
      .filter((it) => it.productId && Number(it.qty) > 0)
      .map((it) => ({ productId: it.productId, qty: Number(it.qty) }));
    const ok = createOrder({ customer, items: validItems, status: 'Pending' });
    if (ok) setModalOpen(false);
  }

  const columns = [
    { key: 'customer', label: 'Customer' },
    {
      key: 'items',
      label: 'Items',
      render: (r) => `${r.items.length} item${r.items.length !== 1 ? 's' : ''}`,
      csv: (r) => r.items.map((i) => `${i.name} x${i.qty}`).join('; '),
    },
    { key: 'total', label: 'Total', render: (r) => formatCurrency(r.total) },
    {
      key: 'status',
      label: 'Status',
      csv: (r) => r.status,
      render: (r) => (
        <select
          value={r.status}
          onChange={(e) => updateOrderStatus(r.id, e.target.value)}
          className="rounded-md border border-slate-200 bg-transparent px-2 py-1 text-xs font-semibold dark:border-navy-600"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      ),
    },
    { key: 'date', label: 'Date', render: (r) => formatDate(r.date) },
    {
      key: 'actions',
      label: 'Actions',
      csv: () => '',
      render: (row) => (
        <button onClick={() => deleteOrder(row.id)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
          <Trash2 size={15} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={orders}
        searchKeys={['customer', 'status']}
        onAdd={openAdd}
        addLabel="Create Order"
        exportName="orders"
        emptyMessage="No orders yet — create your first one."
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Order" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-field">Customer Name</label>
            <input className="input-field" placeholder="Walk-in Customer" value={customer} onChange={(e) => setCustomer(e.target.value)} />
          </div>

          <div>
            <label className="label-field">Order Items</label>
            <div className="space-y-2">
              {items.map((it, i) => {
                const product = products.find((p) => p.id === it.productId);
                return (
                  <div key={i} className="flex items-center gap-2">
                    <select
                      required
                      className="input-field flex-1"
                      value={it.productId}
                      onChange={(e) => updateItem(i, { productId: e.target.value })}
                    >
                      <option value="">Select product</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id} disabled={p.quantity === 0}>
                          {p.name} ({p.quantity} in stock)
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      max={product?.quantity || 999}
                      required
                      className="input-field w-24"
                      value={it.qty}
                      onChange={(e) => updateItem(i, { qty: e.target.value })}
                    />
                    <button type="button" onClick={() => removeItemRow(i)} className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-700">
                      <X size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
            <button type="button" onClick={addItemRow} className="btn-secondary mt-2 w-full">
              <Plus size={15} /> Add Another Item
            </button>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 dark:bg-navy-900">
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Order Total</span>
            <span className="font-display text-lg font-bold text-navy-900 dark:text-white">{formatCurrency(total)}</span>
          </div>

          <button type="submit" className="btn-primary w-full">
            <ShoppingCart size={16} /> Create Order
          </button>
        </form>
      </Modal>
    </div>
  );
}
