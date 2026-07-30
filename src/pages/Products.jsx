import { useState } from 'react';
import { Pencil, Trash2, RefreshCw, LayoutGrid, List, ImagePlus, X } from 'lucide-react';
import { useData } from '../context/DataContext';
import DataTable from '../components/DataTable';
import ProductGrid from '../components/ProductGrid';
import ProductImage from '../components/ProductImage';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency, formatDate, generateSKU, generateBarcode, todayISO, fileToBase64 } from '../utils/helpers';

const EMPTY = {
  name: '',
  sku: '',
  barcode: '',
  category: '',
  supplier: '',
  costPrice: '',
  sellingPrice: '',
  quantity: '',
  status: 'Active',
  date: todayISO(),
  image: '',
};

export default function Products() {
  const { products, categories, suppliers, addProduct, updateProduct, deleteProduct, settings } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [confirmId, setConfirmId] = useState(null);
  const [view, setView] = useState('grid');

  async function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      alert('Please choose an image smaller than 1.5MB.');
      return;
    }
    const base64 = await fileToBase64(file);
    setForm((prev) => ({ ...prev, image: base64 }));
  }

  function openAdd() {
    setEditing(null);
    setForm({ ...EMPTY, sku: generateSKU(), barcode: generateBarcode() });
    setModalOpen(true);
  }
  function openEdit(row) {
    setEditing(row);
    setForm(row);
    setModalOpen(true);
  }
  function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      ...form,
      costPrice: Number(form.costPrice),
      sellingPrice: Number(form.sellingPrice),
      quantity: Number(form.quantity),
    };
    if (editing) updateProduct(editing.id, payload);
    else addProduct(payload);
    setModalOpen(false);
  }

  const categoryName = (id) => categories.find((c) => c.id === id)?.name || '—';
  const supplierName = (id) => suppliers.find((s) => s.id === id)?.name || '—';

  const columns = [
    {
      key: 'image',
      label: '',
      csv: () => '',
      render: (r) => <ProductImage src={r.image} alt={r.name} size="sm" />,
    },
    { key: 'name', label: 'Product' },
    { key: 'sku', label: 'SKU', render: (r) => <span className="font-mono text-xs">{r.sku}</span> },
    { key: 'category', label: 'Category', render: (r) => categoryName(r.category), csv: (r) => categoryName(r.category) },
    { key: 'supplier', label: 'Supplier', render: (r) => supplierName(r.supplier), csv: (r) => supplierName(r.supplier) },
    { key: 'costPrice', label: 'Cost', render: (r) => formatCurrency(r.costPrice), csv: (r) => r.costPrice },
    { key: 'sellingPrice', label: 'Price', render: (r) => formatCurrency(r.sellingPrice), csv: (r) => r.sellingPrice },
    {
      key: 'quantity',
      label: 'Qty',
      render: (r) => (
        <span className={Number(r.quantity) <= Number(settings.lowStockThreshold) ? 'font-semibold text-red-600' : ''}>
          {r.quantity}
        </span>
      ),
    },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} />, csv: (r) => r.status },
    { key: 'date', label: 'Date Added', render: (r) => formatDate(r.date) },
    {
      key: 'actions',
      label: 'Actions',
      csv: () => '',
      render: (row) => (
        <div className="flex gap-1.5">
          <button onClick={() => openEdit(row)} className="rounded-lg p-1.5 text-navy-500 hover:bg-slate-100 dark:hover:bg-navy-700">
            <Pencil size={15} />
          </button>
          <button onClick={() => setConfirmId(row.id)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 dark:border-navy-600 dark:bg-navy-800">
          <button
            onClick={() => setView('grid')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              view === 'grid' ? 'bg-navy-700 text-white dark:bg-amber-500 dark:text-navy-950' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <LayoutGrid size={14} /> Store View
          </button>
          <button
            onClick={() => setView('table')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              view === 'table' ? 'bg-navy-700 text-white dark:bg-amber-500 dark:text-navy-950' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <List size={14} /> Table View
          </button>
        </div>
      </div>

      {view === 'grid' ? (
        <ProductGrid
          products={products}
          categories={categories}
          suppliers={suppliers}
          settings={settings}
          onAdd={openAdd}
          onEdit={openEdit}
          onDelete={(id) => setConfirmId(id)}
        />
      ) : (
        <DataTable
          columns={columns}
          data={products}
          searchKeys={['name', 'sku', 'barcode']}
          onAdd={openAdd}
          addLabel="Add Product"
          exportName="products"
          emptyMessage="No products yet — add your first one."
        />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Product' : 'Add Product'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-field">Product Photo</label>
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200 dark:border-navy-600">
                <ProductImage src={form.image} alt="Preview" size="lg" rounded="rounded-none" />
                {form.image && (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, image: '' })}
                    className="absolute right-1 top-1 rounded-full bg-navy-950/70 p-0.5 text-white"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
              <label className="btn-secondary cursor-pointer">
                <ImagePlus size={16} /> Upload Photo
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
          </div>

          <div>
            <label className="label-field">Product Name</label>
            <input required className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">SKU</label>
              <div className="flex gap-2">
                <input required className="input-field font-mono" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
                <button type="button" onClick={() => setForm({ ...form, sku: generateSKU(form.name) })} className="btn-secondary px-3" title="Generate SKU">
                  <RefreshCw size={15} />
                </button>
              </div>
            </div>
            <div>
              <label className="label-field">Barcode</label>
              <div className="flex gap-2">
                <input required className="input-field font-mono" value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} />
                <button type="button" onClick={() => setForm({ ...form, barcode: generateBarcode() })} className="btn-secondary px-3" title="Generate Barcode">
                  <RefreshCw size={15} />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Category</label>
              <select required className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-field">Supplier</label>
              <select required className="input-field" value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })}>
                <option value="">Select supplier</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label-field">Cost Price</label>
              <input type="number" step="0.01" min="0" required className="input-field" value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: e.target.value })} />
            </div>
            <div>
              <label className="label-field">Selling Price</label>
              <input type="number" step="0.01" min="0" required className="input-field" value={form.sellingPrice} onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })} />
            </div>
            <div>
              <label className="label-field">Quantity</label>
              <input type="number" min="0" required className="input-field" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Status</label>
              <select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            <div>
              <label className="label-field">Date</label>
              <input type="date" className="input-field" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full">
            {editing ? 'Save Changes' : 'Add Product'}
          </button>
        </form>
      </Modal>

      <ConfirmDialog open={!!confirmId} onClose={() => setConfirmId(null)} onConfirm={() => deleteProduct(confirmId)} title="Delete product" />
    </div>
  );
}
