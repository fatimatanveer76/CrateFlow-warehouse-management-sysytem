import { createContext, useContext } from 'react';
import toast from 'react-hot-toast';
import useLocalStorage from '../hooks/useLocalStorage';
import { makeId, todayISO } from '../utils/helpers';

const DataContext = createContext(null);

const SEED_CATEGORIES = [
  { id: 'cat_electronics', name: 'Electronics', description: 'Gadgets, cables and accessories' },
  { id: 'cat_grocery', name: 'Grocery', description: 'Packaged food and household staples' },
  { id: 'cat_apparel', name: 'Apparel', description: 'Clothing and footwear' },
];

const SEED_SUPPLIERS = [
  { id: 'sup_alpha', name: 'Alpha Traders', contact: 'Bilal Ahmed', email: 'bilal@alphatraders.com', phone: '+92 300 1112233' },
  { id: 'sup_omega', name: 'Omega Distributors', contact: 'Sana Khan', email: 'sana@omegadist.com', phone: '+92 321 4445566' },
];

const SEED_PRODUCTS = [
  { id: 'prod_1', name: 'Wireless Mouse', sku: 'WIR-4821', barcode: '891234567001', category: 'cat_electronics', supplier: 'sup_alpha', costPrice: 6.5, sellingPrice: 12.99, quantity: 42, status: 'Active', date: todayISO(), image: 'https://picsum.photos/seed/wirelessmouse/400/400' },
  { id: 'prod_2', name: 'Basmati Rice 5kg', sku: 'BAS-1092', barcode: '891234567002', category: 'cat_grocery', supplier: 'sup_omega', costPrice: 8.2, sellingPrice: 11.5, quantity: 6, status: 'Active', date: todayISO(), image: 'https://picsum.photos/seed/basmatirice/400/400' },
  { id: 'prod_3', name: 'Cotton T-Shirt', sku: 'COT-3345', barcode: '891234567003', category: 'cat_apparel', supplier: 'sup_alpha', costPrice: 3.1, sellingPrice: 9.99, quantity: 120, status: 'Active', date: todayISO(), image: 'https://picsum.photos/seed/cottontshirt/400/400' },
];

export function DataProvider({ children }) {
  const [categories, setCategories] = useLocalStorage('wms_categories', SEED_CATEGORIES);
  const [suppliers, setSuppliers] = useLocalStorage('wms_suppliers', SEED_SUPPLIERS);
  const [products, setProducts] = useLocalStorage('wms_products', SEED_PRODUCTS);
  const [stockInLogs, setStockInLogs] = useLocalStorage('wms_stock_in', []);
  const [stockOutLogs, setStockOutLogs] = useLocalStorage('wms_stock_out', []);
  const [orders, setOrders] = useLocalStorage('wms_orders', []);
  const [wastageLogs, setWastageLogs] = useLocalStorage('wms_wastage', []);
  const [settings, setSettings] = useLocalStorage('wms_settings', { lowStockThreshold: 10, currency: 'USD' });

  // ---------- Categories ----------
  function addCategory(data) {
    setCategories((prev) => [...prev, { id: makeId('cat'), ...data }]);
    toast.success('Category added');
  }
  function updateCategory(id, updates) {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    toast.success('Category updated');
  }
  function deleteCategory(id) {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast.success('Category deleted');
  }

  // ---------- Suppliers ----------
  function addSupplier(data) {
    setSuppliers((prev) => [...prev, { id: makeId('sup'), ...data }]);
    toast.success('Supplier added');
  }
  function updateSupplier(id, updates) {
    setSuppliers((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    toast.success('Supplier updated');
  }
  function deleteSupplier(id) {
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
    toast.success('Supplier deleted');
  }

  // ---------- Products ----------
  function addProduct(data) {
    setProducts((prev) => [
      ...prev,
      { id: makeId('prod'), status: 'Active', date: todayISO(), ...data },
    ]);
    toast.success('Product added');
  }
  function updateProduct(id, updates) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    toast.success('Product updated');
  }
  function deleteProduct(id) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success('Product deleted');
  }

  // ---------- Stock In ----------
  function stockIn({ productId, quantity, note }) {
    const qty = Number(quantity);
    if (!productId || !qty || qty <= 0) {
      toast.error('Select a product and a valid quantity');
      return;
    }
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, quantity: p.quantity + qty } : p))
    );
    setStockInLogs((prev) => [
      { id: makeId('sin'), productId, quantity: qty, note: note || '', date: todayISO() },
      ...prev,
    ]);
    toast.success('Stock added to inventory');
  }

  // ---------- Stock Out ----------
  function stockOut({ productId, quantity, note }) {
    const qty = Number(quantity);
    const product = products.find((p) => p.id === productId);
    if (!product || !qty || qty <= 0) {
      toast.error('Select a product and a valid quantity');
      return false;
    }
    if (qty > product.quantity) {
      toast.error(`Only ${product.quantity} units available`);
      return false;
    }
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, quantity: p.quantity - qty } : p))
    );
    setStockOutLogs((prev) => [
      { id: makeId('sout'), productId, quantity: qty, note: note || '', date: todayISO() },
      ...prev,
    ]);
    toast.success('Stock removed from inventory');
    return true;
  }

  // ---------- Wastage ----------
  function addWastage({ productId, quantity, reason }) {
    const qty = Number(quantity);
    const product = products.find((p) => p.id === productId);
    if (!product || !qty || qty <= 0) {
      toast.error('Select a product and a valid quantity');
      return;
    }
    if (qty > product.quantity) {
      toast.error(`Only ${product.quantity} units available`);
      return;
    }
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, quantity: p.quantity - qty } : p))
    );
    setWastageLogs((prev) => [
      {
        id: makeId('waste'),
        productId,
        quantity: qty,
        reason: reason || 'Unspecified',
        costAtLoss: product.costPrice,
        date: todayISO(),
      },
      ...prev,
    ]);
    toast.success('Wastage recorded');
  }
  function deleteWastage(id) {
    setWastageLogs((prev) => prev.filter((w) => w.id !== id));
  }

  // ---------- Orders ----------
  function createOrder({ customer, items, status }) {
    if (!items || items.length === 0) {
      toast.error('Add at least one product to the order');
      return false;
    }
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product || item.qty > product.quantity) {
        toast.error(`Not enough stock for ${product ? product.name : 'selected product'}`);
        return false;
      }
    }
    const enrichedItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return {
        productId: item.productId,
        name: product.name,
        qty: item.qty,
        sellingPrice: product.sellingPrice,
        costPrice: product.costPrice,
      };
    });
    const total = enrichedItems.reduce((sum, i) => sum + i.qty * i.sellingPrice, 0);

    setProducts((prev) =>
      prev.map((p) => {
        const match = enrichedItems.find((i) => i.productId === p.id);
        return match ? { ...p, quantity: p.quantity - match.qty } : p;
      })
    );

    const newOrder = {
      id: makeId('ord'),
      customer: customer || 'Walk-in Customer',
      items: enrichedItems,
      total,
      status: status || 'Pending',
      date: todayISO(),
    };
    setOrders((prev) => [newOrder, ...prev]);
    toast.success('Order created');
    return true;
  }

  function updateOrderStatus(id, status) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    toast.success(`Order marked as ${status}`);
  }

  function deleteOrder(id) {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  }

  function updateSettings(updates) {
    setSettings((prev) => ({ ...prev, ...updates }));
    toast.success('Settings saved');
  }

  const value = {
    categories,
    suppliers,
    products,
    stockInLogs,
    stockOutLogs,
    orders,
    wastageLogs,
    settings,
    addCategory,
    updateCategory,
    deleteCategory,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    addProduct,
    updateProduct,
    deleteProduct,
    stockIn,
    stockOut,
    addWastage,
    deleteWastage,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    updateSettings,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
