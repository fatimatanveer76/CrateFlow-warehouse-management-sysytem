import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

const EMPTY = { name: '', contact: '', email: '', phone: '' };

export default function Suppliers() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useData();
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
    if (editing) updateSupplier(editing.id, form);
    else addSupplier(form);
    setModalOpen(false);
  }

  const columns = [
    { key: 'name', label: 'Supplier' },
    { key: 'contact', label: 'Contact Person' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
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
      <DataTable
        columns={columns}
        data={suppliers}
        searchKeys={['name', 'contact', 'email', 'phone']}
        onAdd={openAdd}
        addLabel="Add Supplier"
        exportName="suppliers"
        emptyMessage="No suppliers yet — add your first one."
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Supplier' : 'Add Supplier'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-field">Supplier Name</label>
            <input required className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label-field">Contact Person</label>
            <input required className="input-field" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Email</label>
              <input type="email" required className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="label-field">Phone</label>
              <input required className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full">
            {editing ? 'Save Changes' : 'Add Supplier'}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={() => deleteSupplier(confirmId)}
        title="Delete supplier"
      />
    </div>
  );
}
