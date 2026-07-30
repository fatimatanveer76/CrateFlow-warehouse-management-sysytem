import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

const EMPTY = { name: '', description: '' };

export default function Categories() {
  const { categories, addCategory, updateCategory, deleteCategory, products } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [confirmId, setConfirmId] = useState(null);

  function openAdd() {
    setEditing(null);
    setForm(EMPTY);
    setModalOpen(true);
  }
  function openEdit(row) {
    setEditing(row);
    setForm(row);
    setModalOpen(true);
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (editing) updateCategory(editing.id, form);
    else addCategory(form);
    setModalOpen(false);
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    {
      key: 'count',
      label: 'Products',
      render: (row) => products.filter((p) => p.category === row.id).length,
      csv: (row) => products.filter((p) => p.category === row.id).length,
    },
    {
      key: 'actions',
      label: 'Actions',
      csv: () => '',
      render: (row) => (
        <div className="flex gap-1.5">
          <button onClick={() => openEdit(row)} className="rounded-lg p-1.5 text-navy-500 hover:bg-slate-100 dark:hover:bg-navy-700" aria-label="Edit">
            <Pencil size={15} />
          </button>
          <button onClick={() => setConfirmId(row.id)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10" aria-label="Delete">
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={categories}
        searchKeys={['name', 'description']}
        onAdd={openAdd}
        addLabel="Add Category"
        exportName="categories"
        emptyMessage="No categories yet — add your first one."
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Category' : 'Add Category'} size="sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-field">Name</label>
            <input required className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label-field">Description</label>
            <textarea className="input-field" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <button type="submit" className="btn-primary w-full">
            {editing ? 'Save Changes' : 'Add Category'}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={() => deleteCategory(confirmId)}
        title="Delete category"
        message="Products in this category will keep their reference but the category will no longer be listed."
      />
    </div>
  );
}
