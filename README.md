# CrateFlow — Amazon-Style Warehouse Management System

A modern, fully responsive warehouse/inventory management web app built with **React**, **Tailwind CSS**, and **LocalStorage** persistence — built for the U Devs Professional Internship frontend assignment.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?logo=javascript)
![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?logo=vite)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=react-router)
![Context API](https://img.shields.io/badge/Context_API-State_Management-purple)
![GitHub](https://img.shields.io/badge/GitHub-Repository-black?logo=github)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

**Core**
- Email/password Login & Signup (session stored in LocalStorage)
- Protected routing with React Router
- Dashboard with 8 live KPIs: Total Products, Total Stock, Orders, Revenue, Profit, Loss, Wastage, Pending Orders
- Full CRUD: Products, Categories, Suppliers
- Stock In / Stock Out modules with automatic quantity adjustment
- Orders module with multi-item order builder and automatic stock deduction
- Wastage module (loss tracking by reason)
- Auto-calculated Profit = (Selling − Cost) × Qty, Loss = wastage cost
- Low stock alerts (configurable threshold in Settings)
- Fully responsive (mobile, tablet, desktop) with a collapsible sidebar

**Bonus**
- 🌙 Dark mode (persisted)
- 📊 Charts (Recharts): revenue vs profit, stock-by-category pie, top-selling products, 7-day stock movement
- 📤 CSV export on every data table + full inventory report
- 🔍 Search on every table
- 📄 Pagination on every table
- 🔔 Toast notifications for every action (react-hot-toast)

## 🛠️ Tech Stack

React 18 · React Router 6 · Tailwind CSS 3 · Recharts · react-hot-toast · lucide-react · Vite · LocalStorage

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## 📁 Folder Structure

```
src/
├── components/   # Reusable UI: Sidebar, Navbar, DataTable, Modal, StatCard, etc.
├── pages/        # Route-level pages (Dashboard, Products, Orders, ...)
├── context/      # AuthContext, DataContext, ThemeContext (Context API + LocalStorage)
├── hooks/        # useLocalStorage
├── utils/        # helpers.js, csvExport.js
└── assets/
```

## 🧠 Business Logic

- **Stock In** increases product quantity and logs the movement.
- **Stock Out** decreases product quantity (blocked if insufficient stock) and logs the movement.
- **Orders** deduct stock per line item and compute totals from live selling price.
- **Wastage** deducts stock and records the loss value at the product's cost price.
- **Profit** = Σ (Selling Price − Cost Price) × Quantity across non-cancelled orders.
- **Loss** = Σ Cost Price × Quantity across all wastage entries.
- **Low stock alert** triggers when a product's quantity falls at or below the threshold set in Settings (default: 10).

## 🔐 Demo Data

The app seeds a few sample categories, suppliers, and products on first run so the dashboard and charts aren't empty. Create your own account from the Signup page — all data (including your account) is stored locally in your browser via LocalStorage, so it's private to your device and persists across refreshes.


## 👤 Author

Fatima Tanveer
