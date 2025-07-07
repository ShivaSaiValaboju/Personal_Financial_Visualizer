"use client";
import React, { useState } from "react";
import { BudgetsTable } from "./BudgetsTable";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

interface Transaction {
  id: string;
  description: string;
  date: string;
  amount: number;
  type: "income" | "expense";
  category: string;
}

const categories = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Other",
  "Entertainment",
  "Healthcare",
  "Travel",
  "Salary",
  "Investment",
  "Education",
  "Gifts"
];

export default function Home() {
  // Prevent hydration mismatch by only rendering after mount
  const [isMounted, setIsMounted] = useState(false);
  React.useEffect(() => { setIsMounted(true); }, []);
  // Category color helper
  // Professional, visually distinct color palette for categories
  const categoryColors: Record<string, string> = {
    Food: '#FF6384',         // Vibrant Red
    Transport: '#36A2EB',    // Bright Blue
    Shopping: '#FFCE56',     // Yellow
    Bills: '#4BC0C0',        // Teal
    Other: '#BDBDBD',        // Gray
    Entertainment: '#7C3AED',// Indigo (distinct from Education)
    Healthcare: '#FF9F40',   // Orange
    Travel: '#00C49A',       // Green-Teal
    Salary: '#2ECC40',       // Green
    Investment: '#FF6F91',   // Pink
    Education: '#00B8D9',    // Cyan (distinct from all others)
    Gifts: '#F9C846',        // Gold
  };
  const getCategoryColor = (category: string) => categoryColors[category] || '#888888';

  // Transaction actions (edit/delete)
  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Transaction | null>(null);

  const handleEditTransaction = (id: string) => {
    const tx = transactions.find((t) => t.id === id);
    if (tx) {
      setEditTarget(tx);
      setShowEditModal(true);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editTarget) return;
    setEditTarget({ ...editTarget, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    setTransactions((prev) => prev.map((t) => t.id === editTarget.id ? { ...editTarget, amount: typeof editTarget.amount === 'string' ? parseFloat(editTarget.amount) : editTarget.amount } : t));
    setShowEditModal(false);
    setEditTarget(null);
  };

  const handleEditCancel = () => {
    setShowEditModal(false);
    setEditTarget(null);
  };

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleDeleteTransaction = (id: string) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteTransaction = () => {
    if (deleteTargetId) {
      setTransactions((prev) => prev.filter((t) => t.id !== deleteTargetId));
    }
    setShowDeleteModal(false);
    setDeleteTargetId(null);
  };

  const cancelDeleteTransaction = () => {
    setShowDeleteModal(false);
    setDeleteTargetId(null);
  };
  // LocalStorage persistence for transactions


  // Deterministic pseudo-random generator for SSR safety
  function seededRandom(seed: number) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  // Generate deterministic random transactions for July-Dec 2024 and Jan-Jul 2025
  function generateDemoTransactions() {
    // const cats = categories;
    const descs = [
      "Groceries", "Bus Ticket", "Online Shopping", "Electric Bill", "Coffee Shop", "Restaurant", "Taxi", "Clothes", "Internet", "Gift", "Pharmacy", "Snacks", "Gym", "Movie", "Book", "Subscription", "Fuel", "Lunch", "Dinner", "Bakery",
      "Concert", "Doctor Visit", "Flight", "Hotel", "Bonus", "Stock Dividend", "Course Fee", "Birthday Gift", "Streaming Service", "Museum", "Medication", "Spa", "Investment Return", "Tuition", "Vacation", "Festival", "Charity", "Pet Supplies"
    ];
    const txs: Transaction[] = [];
    let id = 1;
    for (let m = 7; m <= 12; m++) { // Jul-Dec 2024
      for (let i = 0; i < 10; i++) {
        const seed = m * 100 + i;
        const type: "income" | "expense" = seededRandom(seed) > (m === 12 || m === 1 ? 0.5 : 0.3) ? "expense" : "income";
        let amount = type === "expense"
          ? Math.round((seededRandom(seed + 1) * 290 + 30) * 100) / 100
          : Math.round((seededRandom(seed + 2) * 2500 + 2000) * 100) / 100;
        // Make some months have big income spikes
        if (type === "income" && (m === 12 || m === 1)) amount += 2000 * seededRandom(seed + 6);
        const category = categories[Math.floor(seededRandom(seed + 3) * categories.length)];
        const description = descs[Math.floor(seededRandom(seed + 4) * descs.length)];
        txs.push({
          id: `demo${id++}`,
          description,
          category,
          date: `2024-${String(m).padStart(2, "0")}-${String(1 + Math.floor(seededRandom(seed + 5) * 28)).padStart(2, "0")}`,
          amount,
          type,
        });
      }
    }
    for (let m = 1; m <= 7; m++) { // Jan-Jul 2025
      for (let i = 0; i < 10; i++) {
        const seed = m * 200 + i;
        const type: "income" | "expense" = seededRandom(seed) > (m === 12 || m === 1 ? 0.5 : 0.3) ? "expense" : "income";
        let amount = type === "expense"
          ? Math.round((seededRandom(seed + 1) * 290 + 30) * 100) / 100
          : Math.round((seededRandom(seed + 2) * 2500 + 2000) * 100) / 100;
        if (type === "income" && (m === 12 || m === 1)) amount += 2000 * seededRandom(seed + 6);
        const category = categories[Math.floor(seededRandom(seed + 3) * categories.length)];
        const description = descs[Math.floor(seededRandom(seed + 4) * descs.length)];
        txs.push({
          id: `demo${id++}`,
          description,
          category,
          date: `2025-${String(m).padStart(2, "0")}-${String(1 + Math.floor(seededRandom(seed + 5) * 28)).padStart(2, "0")}`,
          amount,
          type,
        });
      }
    }
    return txs;
  }

  const defaultTransactions: Transaction[] = generateDemoTransactions();
  const [transactions, setTransactions] = useState<Transaction[]>(defaultTransactions);

  // Only update from localStorage after mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('transactions');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTransactions(parsed);
          } else {
            setTransactions(defaultTransactions);
          }
        } catch {
          setTransactions(defaultTransactions);
        }
      } else {
        setTransactions(defaultTransactions);
      }
    }
  }, [defaultTransactions]);



  // Save to localStorage on change
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('transactions', JSON.stringify(transactions));
    }
  }, [transactions]);

  // --- Responsive derived values for dashboard and charts ---
  // (Removed duplicate block to fix build error)

  // --- Derived values for dashboard ---
  // Get current month/year
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  // Filter for current month
  const thisMonthTx = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear;
  });
  // Calculate previous month for comparison
  const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
  const prevMonthTx = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() + 1 === prevMonth && d.getFullYear() === prevYear;
  });
  const prevTotalBalance = transactions
    .filter(t => {
      const d = new Date(t.date);
      return d.getFullYear() < currentYear || (d.getFullYear() === currentYear && d.getMonth() + 1 < currentMonth);
    })
    .reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, 0);
  const prevMonthlyExpenses = prevMonthTx.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const prevMonthlyIncome = prevMonthTx.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);

  // Current values
  const totalBalance = transactions.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, 0);
  const monthlyExpenses = thisMonthTx.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const monthlyIncome = thisMonthTx.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const budget = 4000;
  const budgetRemaining = budget - monthlyExpenses;
  const prevBudgetRemaining = budget - prevMonthlyExpenses;


  // --- State for chart options ---
  const [barChartRange, setBarChartRange] = useState<'6' | '12' | 'ytd'>('6');
  const [pieChartRange, setPieChartRange] = useState<'this' | 'last' | '3'>('this');

  // Bar chart: group by month (dynamic range)

  let monthsBack = 6;
  if (barChartRange === '12') monthsBack = 12;
  if (barChartRange === 'ytd') monthsBack = currentMonth;
  const barChartMonths: { name: string, value: number }[] = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(currentYear, currentMonth - 1 - i, 1);
    const name = d.toLocaleString(undefined, { month: 'short' });
    const value = transactions.filter(t => {
      const td = new Date(t.date);
      return td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear() && t.type === 'expense';
    }).reduce((sum, t) => sum + t.amount, 0);
    barChartMonths.push({ name, value });
  }

  // Pie chart: spending by category (dynamic range)
  let pieTx: Transaction[] = [];
  if (pieChartRange === 'this') {
    pieTx = thisMonthTx.filter(t => t.type === 'expense');
  } else if (pieChartRange === 'last') {
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const lastYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    pieTx = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() + 1 === lastMonth && d.getFullYear() === lastYear && t.type === 'expense';
    });
  } else if (pieChartRange === '3') {
    pieTx = transactions.filter(t => {
      const d = new Date(t.date);
      const monthDiff = (currentYear - d.getFullYear()) * 12 + (currentMonth - (d.getMonth() + 1));
      return monthDiff >= 0 && monthDiff < 3 && t.type === 'expense';
    });
  }
  const pieData = categories.map(category => {
    const value = pieTx.filter(t => t.category === category).reduce((sum, t) => sum + t.amount, 0);
    return { name: category, value, color: getCategoryColor(category) };
  }).filter(d => d.value > 0);

  // ...existing code...
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "",
    // Use a fixed default date to avoid hydration mismatch
    date: '2025-07-01',
    type: "expense",
  });
  const [activePage, setActivePage] = useState<'dashboard' | 'transactions' | 'budgets' | 'reports' | 'settings'>('dashboard');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate all fields
    if (!form.description.trim() || !form.amount || !form.category || !form.date || !form.type) {
      alert('Please fill in all fields.');
      return;
    }
    // Add transaction
    setTransactions(prev => [
      {
        id: `${Date.now()}${Math.floor(Math.random() * 10000)}`,
        description: form.description,
        amount: parseFloat(form.amount),
        category: form.category,
        date: form.date,
        type: form.type as "income" | "expense",
      },
      ...prev,
    ]);
    setForm({ description: "", amount: "", category: "", date: '2025-07-01', type: "expense" });
    setShowModal(false);
  };

  if (!isMounted) return null;

  return (
    <>
      <div className="flex min-h-screen bg-[#f7fafd]">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-6 fixed top-0 left-0 h-screen z-30 shadow-lg">
          <div className="flex items-center gap-2 mb-8">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <path
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-extrabold text-xl">FinanceTracker</span>
          </div>
          <nav className="flex flex-col gap-2 text-base font-medium">
            <button className={`flex items-center gap-2 px-3 py-2 rounded-lg ${activePage === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`} onClick={() => setActivePage('dashboard')}><span>🏠</span>Dashboard</button>
            <button className={`flex items-center gap-2 px-3 py-2 rounded-lg ${activePage === 'transactions' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`} onClick={() => setActivePage('transactions')}><span>↔️</span>Transactions</button>
            <button className={`flex items-center gap-2 px-3 py-2 rounded-lg ${activePage === 'budgets' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`} onClick={() => setActivePage('budgets')}><span>📄</span>Budgets</button>
          </nav>
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-10 ml-64">
        {activePage === 'budgets' && (
          <div>
            {/* Budget vs Actual Comparison Chart - Enhanced Clarity */}
            <div className="w-full max-w-4xl mx-auto mb-10">
              <div className="bg-gradient-to-r from-blue-100 via-white to-pink-100 rounded-2xl shadow-xl p-8 flex flex-col items-center animate-fadeIn">
                <h2 className="text-2xl font-bold mb-4 text-center">Budget vs Actual (This Month)</h2>
                <ResponsiveContainer width="100%" height={360}>
                  <BarChart
                    data={categories.map(cat => {
                      // Use localStorage budgets if available, else fallback to 400
                      let budget = 400;
                      if (typeof window !== 'undefined') {
                        const stored = localStorage.getItem('budgets');
                        if (stored) {
                          const parsed = JSON.parse(stored);
                          if (parsed && typeof parsed === 'object' && parsed[cat] !== undefined) {
                            budget = Number(parsed[cat]);
                          }
                        }
                      }
                      const actual = transactions.filter(t => t.type === 'expense' && t.category === cat && new Date(t.date).getMonth() + 1 === currentMonth && new Date(t.date).getFullYear() === currentYear).reduce((sum, t) => sum + t.amount, 0);
                      return {
                        name: cat,
                        Budget: budget,
                        Actual: actual,
                        color: getCategoryColor(cat),
                        percentUsed: budget > 0 ? (actual / budget) * 100 : 0
                      };
                    })}
                    margin={{ top: 20, right: 40, left: 0, bottom: 20 }}
                    barCategoryGap={32}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontWeight: 600, fontSize: 16 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 16 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                    <Tooltip
                      formatter={(v: number, name: string) => [`$${v.toLocaleString(undefined, {maximumFractionDigits:2})}`, name]}
                      contentStyle={{ fontSize: 16 }}
                      labelFormatter={(label, payload) => {
                        const cat = payload && payload[0] && payload[0].payload;
                        return cat ? `${cat.name} (${cat.percentUsed.toFixed(1)}% used)` : label;
                      }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" formatter={v => <span style={{fontWeight:600}}>{v}</span>} />
                    <Bar dataKey="Budget" fill="#dbeafe" radius={[8,8,0,0]} barSize={32} name="Budget" />
                    <Bar dataKey="Actual" radius={[8,8,0,0]} barSize={32} name="Actual">
                      {categories.map((cat) => (
                        <Cell key={cat} fill={getCategoryColor(cat)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="w-full mt-6">
                  <table className="w-full text-base text-gray-700 font-semibold border-separate border-spacing-y-2">
                    <thead>
                      <tr className="text-gray-500 text-sm">
                        <th className="text-left px-2">Category</th>
                        <th className="text-center px-2">Budget</th>
                        <th className="text-center px-2">Actual</th>
                        <th className="text-center px-2">% Used</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map(cat => {
                        let budget = 400;
                        if (typeof window !== 'undefined') {
                          const stored = localStorage.getItem('budgets');
                          if (stored) {
                            const parsed = JSON.parse(stored);
                            if (parsed && typeof parsed === 'object' && parsed[cat] !== undefined) {
                              budget = Number(parsed[cat]);
                            }
                          }
                        }
                        const actual = transactions.filter(t => t.type === 'expense' && t.category === cat && new Date(t.date).getMonth() + 1 === currentMonth && new Date(t.date).getFullYear() === currentYear).reduce((sum, t) => sum + t.amount, 0);
                        const percentUsed = budget > 0 ? (actual / budget) * 100 : 0;
                        return (
                          <tr key={cat} className="bg-white rounded-xl shadow-sm">
                            <td className="px-2 py-2 flex items-center gap-2 font-bold" style={{color: getCategoryColor(cat)}}>
                              <span className="inline-block w-3 h-3 rounded-full mr-2" style={{background:getCategoryColor(cat)}}></span>
                              {cat}
                            </td>
                            <td className="px-2 py-2 text-center">${budget.toLocaleString(undefined, {maximumFractionDigits:2})}</td>
                            <td className="px-2 py-2 text-center">${actual.toLocaleString(undefined, {maximumFractionDigits:2})}</td>
                            <td className="px-2 py-2 text-center font-semibold" style={{color: percentUsed > 100 ? '#ef4444' : percentUsed > 80 ? '#f59e42' : '#059669'}}>
                              {percentUsed.toFixed(1)}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <BudgetsTable
              categories={categories}
              transactions={transactions}
              currentMonth={currentMonth}
              currentYear={currentYear}
              getCategoryColor={getCategoryColor}
            />
          </div>
        )}
        {activePage === 'dashboard' && (
          <React.Fragment>
            {/* Dashboard Section */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-extrabold mb-1">Dashboard</h1>
                <p className="text-gray-500">Track your financial health at a glance</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold text-base flex items-center gap-2" onClick={() => setShowModal(true)}>
                + Add Transaction
              </Button>
            </div>
            {/* Add Transaction Modal for Dashboard */}
            {showModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-100/80 via-white/90 to-pink-100/80 animate-fadeIn">
                <div className="bg-white rounded-3xl shadow-2xl p-0 w-full max-w-2xl min-h-[540px] min-w-[420px] flex flex-col relative border-4 border-blue-100 animate-fadeIn" style={{ boxShadow: '0 8px 40px 0 rgba(56, 189, 248, 0.15), 0 1.5px 8px 0 rgba(59, 130, 246, 0.10)' }}>
                  {/* Modal Header */}
                  <div className="flex items-center justify-between px-10 pt-10 pb-4 border-b border-blue-100 bg-gradient-to-r from-blue-50/80 to-white/80 rounded-t-3xl">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl font-bold text-blue-600 bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center shadow-md">+</span>
                      <span className="text-3xl font-semibold text-gray-900">Add Transaction</span>
                    </div>
                    <button className="text-gray-400 hover:text-blue-600 text-3xl font-bold transition-colors duration-150" onClick={() => setShowModal(false)} aria-label="Close">&times;</button>
                  </div>
                  {/* Modal Body */}
                  <form onSubmit={handleSubmit} className="flex flex-col gap-7 px-10 py-10 flex-1 justify-between">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="font-bold mb-2 block text-lg text-gray-800">Description</label>
                        <input
                          name="description"
                          value={form.description}
                          onChange={handleChange}
                          placeholder="Enter transaction description"
                          className="w-full border-2 border-blue-200 rounded-xl px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/40 placeholder-gray-400 shadow-sm"
                          required
                          autoFocus
                        />
                      </div>
                      <div>
                        <label className="font-bold mb-2 block text-lg text-gray-800">Amount</label>
                        <div className="flex items-center relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 text-xl font-bold">$</span>
                          <input
                            name="amount"
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={form.amount}
                            onChange={handleChange}
                            className="w-full border-2 border-blue-200 rounded-xl pl-10 pr-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/40 placeholder-gray-400 shadow-sm"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="font-bold mb-2 block text-lg text-gray-800">Category</label>
                        <select
                          name="category"
                          value={form.category}
                          onChange={handleChange}
                          className="w-full border-2 border-blue-200 rounded-xl px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/40 shadow-sm"
                          required
                        >
                          <option value="">Select a category</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="font-bold mb-2 block text-lg text-gray-800">Date</label>
                        <div className="relative">
                          <input
                            name="date"
                            type="date"
                            value={form.date}
                            onChange={handleChange}
                            className="w-full border-2 border-blue-200 rounded-xl px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/40 pr-10 shadow-sm"
                            required
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300 pointer-events-none">
                            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="font-bold mb-2 block text-lg text-gray-800">Type</label>
                      <div className="flex gap-10 mt-1">
                        <label className="flex items-center gap-3 text-lg font-medium">
                          <input type="radio" name="type" value="expense" checked={form.type === "expense"} onChange={handleChange} className="accent-blue-600 w-6 h-6" /> Expense
                        </label>
                        <label className="flex items-center gap-3 text-lg font-medium">
                          <input type="radio" name="type" value="income" checked={form.type === "income"} onChange={handleChange} className="accent-blue-600 w-6 h-6" /> Income
                        </label>
                      </div>
                    </div>
                    <div className="flex justify-end gap-6 mt-4">
                      <Button type="button" variant="outline" className="px-8 py-3 text-lg font-semibold rounded-xl border-2 border-blue-200 hover:bg-blue-50 transition-colors duration-150" onClick={() => setShowModal(false)}>Cancel</Button>
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-md transition-colors duration-150">Add Transaction</Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
                <span className="text-gray-500 font-medium">Total Balance</span>
                <span className="text-2xl font-extrabold">{totalBalance.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</span>
                <span className={`text-sm font-medium flex items-center gap-1 ${totalBalance - prevTotalBalance >= 0 ? 'text-green-600' : 'text-red-500'}`}>{totalBalance - prevTotalBalance >= 0 ? '↑' : '↓'} {(Math.abs(totalBalance - prevTotalBalance) / (prevTotalBalance === 0 ? 1 : Math.abs(prevTotalBalance)) * 100).toFixed(1)}% from last month</span>
              </div>
              <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
                <span className="text-gray-500 font-medium">Monthly Expenses</span>
                <span className="text-2xl font-extrabold">{monthlyExpenses.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</span>
                <span className={`text-sm font-medium flex items-center gap-1 ${monthlyExpenses - prevMonthlyExpenses <= 0 ? 'text-green-600' : 'text-red-500'}`}>{monthlyExpenses - prevMonthlyExpenses <= 0 ? '↓' : '↑'} {(Math.abs(monthlyExpenses - prevMonthlyExpenses) / (prevMonthlyExpenses === 0 ? 1 : Math.abs(prevMonthlyExpenses)) * 100).toFixed(1)}% from last month</span>
              </div>
              <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
                <span className="text-gray-500 font-medium">Monthly Income</span>
                <span className="text-2xl font-extrabold">{monthlyIncome.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</span>
                <span className={`text-sm font-medium flex items-center gap-1 ${monthlyIncome - prevMonthlyIncome >= 0 ? 'text-green-600' : 'text-red-500'}`}>{monthlyIncome - prevMonthlyIncome >= 0 ? '↑' : '↓'} {(Math.abs(monthlyIncome - prevMonthlyIncome) / (prevMonthlyIncome === 0 ? 1 : Math.abs(prevMonthlyIncome)) * 100).toFixed(1)}% from last month</span>
              </div>
              <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
                <span className="text-gray-500 font-medium">Budget Remaining</span>
                <span className="text-2xl font-extrabold">{budgetRemaining.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</span>
                <span className={`text-sm font-medium flex items-center gap-1 ${budgetRemaining - prevBudgetRemaining >= 0 ? 'text-green-600' : 'text-orange-500'}`}>{budgetRemaining - prevBudgetRemaining >= 0 ? '↑' : '↓'} {(Math.abs(budgetRemaining - prevBudgetRemaining) / (prevBudgetRemaining === 0 ? 1 : Math.abs(prevBudgetRemaining)) * 100).toFixed(1)}% from last month</span>
              </div>
            </div>
            {/* Dashboard Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Trends Bar Chart */}
              <div className="bg-white rounded-2xl shadow p-8 flex flex-col relative">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <div>
                    <span className="text-2xl font-bold">Monthly Trends</span>
                    <div className="text-gray-500 text-base mt-1">Track your spending patterns over time</div>
                  </div>
                  <div className="flex-shrink-0 mt-2 sm:mt-0">
                    <select
                      className="border rounded px-4 py-2 text-base font-medium bg-white shadow-sm"
                      value={barChartRange}
                      onChange={e => setBarChartRange(e.target.value as '6' | '12' | 'ytd')}
                    >
                      <option value="6">Last 6 months</option>
                      <option value="12">Last 12 months</option>
                      <option value="ytd">Year to date</option>
                    </select>
                  </div>
                </div>
                <div className="flex-1 flex items-center justify-center min-h-[320px]">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={barChartMonths}
                      margin={{ top: 30, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 16, fill: '#222' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 16, fill: '#222' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                      <Tooltip formatter={v => `$${v}`} contentStyle={{ fontSize: 16 }} />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="url(#colorBar)" barSize={48} />
                      <defs>
                        <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#60a5fa" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              {/* Spending Categories Pie Chart */}
              <div className="bg-white rounded-2xl shadow p-8 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-2xl font-bold">Spending Categories</span>
                  </div>
                  <select
                    className="border rounded px-4 py-2 text-base font-medium bg-white shadow-sm"
                    value={pieChartRange}
                    onChange={e => setPieChartRange(e.target.value as 'this' | 'last' | '3')}
                  >
                    <option value="this">This month</option>
                    <option value="last">Last month</option>
                    <option value="3">Last 3 months</option>
                  </select>
                </div>
                <div className="flex-1 flex items-center justify-center min-h-[320px]">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={4}
                        label={({ percent }) => `${percent ? (percent * 100).toFixed(0) : 0}%`}
                        labelLine={false}
                        isAnimationActive={true}
                      >
                        {pieData.map((d) => (
                          <Cell key={d.name} fill={d.color} />
                        ))}
                      </Pie>
                      <Legend
                        layout="vertical"
                        align="right"
                        verticalAlign="middle"
                        iconType="circle"
                        formatter={(value) => <span style={{ fontSize: 16, color: '#222' }}>{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center label removed as requested */}
                </div>
              </div>
            </div>
            {/* Recent Transactions Table */}
            <div className="bg-white rounded-xl shadow p-6 mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Recent Transactions</h2>
                <button
                  className="flex items-center gap-1 text-blue-600 font-medium text-base hover:underline focus:outline-none"
                  onClick={() => setActivePage('transactions')}
                  type="button"
                >
                  <span role="img" aria-label="View">👁️</span> View all
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="bg-[#f7fafd] text-gray-500 text-sm">
                      <th className="py-3 px-4 font-semibold">DESCRIPTION</th>
                      <th className="py-3 px-4 font-semibold">CATEGORY</th>
                      <th className="py-3 px-4 font-semibold">DATE</th>
                      <th className="py-3 px-4 font-semibold">AMOUNT</th>
                      <th className="py-3 px-4 font-semibold">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500 text-base">
                          No transactions found. Add your first transaction to get started.
                        </td>
                      </tr>
                    ) : (
                      transactions.slice(0, 5).map((t) => (
                        <tr key={t.id} className="border-b last:border-b-0">
                          <td className="py-3 px-4 flex items-center gap-3">
                            <span className="font-bold text-lg" style={{ color: getCategoryColor(t.category) }}>{t.description.charAt(0).toUpperCase()}</span>
                            <span>{t.description}</span>
                          </td>
                          <td className="py-3 px-4 font-semibold">{t.category}</td>
                          <td className="py-3 px-4">{t.date}</td>
                          <td className={`py-3 px-4 font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>{t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}</td>
                          <td className="py-3 px-4 flex gap-4 items-center">
                            <button title="Edit" className="text-blue-600 hover:text-blue-800 text-lg" onClick={() => handleEditTransaction(t.id)}>
                              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M16.862 4.487a2.25 2.25 0 113.182 3.182l-9.75 9.75-4.244 1.06 1.06-4.243 9.752-9.75z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </button>
                            <button title="Delete" className="text-red-600 hover:text-red-800 text-lg" onClick={() => handleDeleteTransaction(t.id)}>
                              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0v12a2 2 0 01-2 2H8a2 2 0 01-2-2V7h12z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </React.Fragment>
        )}
        {activePage === 'transactions' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-extrabold mb-1">Transactions</h1>
                <p className="text-gray-500">View and manage all your financial transactions</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold text-base flex items-center gap-2" onClick={() => setShowModal(true)}>
                + Add Transaction
              </Button>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">All Transactions</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="bg-[#f7fafd] text-gray-500 text-sm">
                      <th className="py-3 px-4 font-semibold">DESCRIPTION</th>
                      <th className="py-3 px-4 font-semibold">CATEGORY</th>
                      <th className="py-3 px-4 font-semibold">DATE</th>
                      <th className="py-3 px-4 font-semibold">AMOUNT</th>
                      <th className="py-3 px-4 font-semibold">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500 text-base">
                          No transactions found. Add your first transaction to get started.
                        </td>
                      </tr>
                    ) : (
                      transactions.map((t) => (
                        <tr key={t.id} className="border-b last:border-b-0">
                          <td className="py-3 px-4 flex items-center gap-3">
                            <span className="font-bold text-lg" style={{ color: getCategoryColor(t.category) }}>{t.description.charAt(0).toUpperCase()}</span>
                            <span>{t.description}</span>
                          </td>
                          <td className="py-3 px-4 font-semibold">{t.category}</td>
                          <td className="py-3 px-4">{new Date(t.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                          <td className={`py-3 px-4 font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>{t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}</td>
                          <td className="py-3 px-4 flex gap-4 items-center">
                            <button title="Edit" className="text-blue-600 hover:text-blue-800 text-lg" onClick={() => handleEditTransaction(t.id)}>
                              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M16.862 4.487a2.25 2.25 0 113.182 3.182l-9.75 9.75-4.244 1.06 1.06-4.243 9.752-9.75z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </button>
                            <button title="Delete" className="text-red-600 hover:text-red-800 text-lg" onClick={() => handleDeleteTransaction(t.id)}>
                              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0v12a2 2 0 01-2 2H8a2 2 0 01-2-2V7h12z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Add Transaction Modal for Transactions Page */}
            {showModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-xl relative animate-fadeIn">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between px-8 pt-8 pb-2 border-b">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-blue-600">+</span>
                      <span className="text-2xl font-semibold">Add Transaction</span>
                    </div>
                    <button className="text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setShowModal(false)} aria-label="Close">&times;</button>
                  </div>
                  {/* Modal Body */}
                  <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-8 py-8">
                    <div>
                      <label className="font-bold mb-2 block text-base">Description</label>
                      <input
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Enter transaction description"
                        className="w-full border-2 border-black/80 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="font-bold mb-2 block text-base">Amount</label>
                      <div className="flex items-center relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">$</span>
                        <input
                          name="amount"
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={form.amount}
                          onChange={handleChange}
                          className="w-full border-2 border-gray-200 rounded-lg pl-10 pr-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-bold mb-2 block text-base">Category</label>
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-bold mb-2 block text-base">Date</label>
                      <div className="relative">
                        <input
                          name="date"
                          type="date"
                          value={form.date}
                          onChange={handleChange}
                          className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                          required
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                          <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="font-bold mb-2 block text-base">Type</label>
                      <div className="flex gap-8 mt-1">
                        <label className="flex items-center gap-2 text-base font-medium">
                          <input type="radio" name="type" value="expense" checked={form.type === "expense"} onChange={handleChange} className="accent-blue-600 w-5 h-5" /> Expense
                        </label>
                        <label className="flex items-center gap-2 text-base font-medium">
                          <input type="radio" name="type" value="income" checked={form.type === "income"} onChange={handleChange} className="accent-blue-600 w-5 h-5" /> Income
                        </label>
                      </div>
                    </div>
                    <div className="flex justify-end gap-4 mt-2">
                      <Button type="button" variant="outline" className="px-6 py-2 text-base font-semibold" onClick={() => setShowModal(false)}>Cancel</Button>
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-base font-semibold">Add Transaction</Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-0 animate-fadeIn">
              <div className="px-10 pt-10 pb-2">
                <h2 className="text-2xl font-bold mb-2">Are you sure?</h2>
                <p className="text-gray-500 text-base mb-6">This action cannot be undone. This will permanently delete the transaction.</p>
              </div>
              <div className="flex justify-end gap-4 px-10 pb-10">
                <Button
                  variant="outline"
                  className="px-6 py-2 text-base font-semibold"
                  onClick={cancelDeleteTransaction}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 text-base font-semibold"
                  onClick={confirmDeleteTransaction}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
        {/* Edit Transaction Modal */}
        {showEditModal && editTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-100/80 via-white/90 to-pink-100/80 animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl p-0 w-full max-w-2xl min-h-[540px] min-w-[420px] flex flex-col relative border-4 border-blue-100 animate-fadeIn" style={{ boxShadow: '0 8px 40px 0 rgba(56, 189, 248, 0.15), 0 1.5px 8px 0 rgba(59, 130, 246, 0.10)' }}>
              {/* Modal Header */}
              <div className="flex items-center justify-between px-10 pt-10 pb-4 border-b border-blue-100 bg-gradient-to-r from-blue-50/80 to-white/80 rounded-t-3xl">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-blue-600 bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center shadow-md">✎</span>
                  <span className="text-3xl font-semibold text-gray-900">Edit Transaction</span>
                </div>
                <button className="text-gray-400 hover:text-blue-600 text-3xl font-bold transition-colors duration-150" onClick={handleEditCancel} aria-label="Close">&times;</button>
              </div>
              {/* Modal Body */}
              <form onSubmit={handleEditSubmit} className="flex flex-col gap-7 px-10 py-10 flex-1 justify-between">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="font-bold mb-2 block text-lg text-gray-800">Description</label>
                    <input
                      name="description"
                      value={editTarget.description}
                      onChange={handleEditChange}
                      placeholder="Enter transaction description"
                      className="w-full border-2 border-blue-200 rounded-xl px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/40 placeholder-gray-400 shadow-sm"
                      required
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="font-bold mb-2 block text-lg text-gray-800">Amount</label>
                    <div className="flex items-center relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 text-xl font-bold">$</span>
                      <input
                        name="amount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={editTarget.amount}
                        onChange={handleEditChange}
                        className="w-full border-2 border-blue-200 rounded-xl pl-10 pr-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/40 placeholder-gray-400 shadow-sm"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-bold mb-2 block text-lg text-gray-800">Category</label>
                    <select
                      name="category"
                      value={editTarget.category}
                      onChange={handleEditChange}
                      className="w-full border-2 border-blue-200 rounded-xl px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/40 shadow-sm"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-bold mb-2 block text-lg text-gray-800">Date</label>
                    <div className="relative">
                      <input
                        name="date"
                        type="date"
                        value={editTarget.date}
                        onChange={handleEditChange}
                        className="w-full border-2 border-blue-200 rounded-xl px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/40 pr-10 shadow-sm"
                        required
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300 pointer-events-none">
                        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="font-bold mb-2 block text-lg text-gray-800">Type</label>
                  <div className="flex gap-10 mt-1">
                    <label className="flex items-center gap-3 text-lg font-medium">
                      <input type="radio" name="type" value="expense" checked={editTarget.type === "expense"} onChange={handleEditChange} className="accent-blue-600 w-6 h-6" /> Expense
                    </label>
                    <label className="flex items-center gap-3 text-lg font-medium">
                      <input type="radio" name="type" value="income" checked={editTarget.type === "income"} onChange={handleEditChange} className="accent-blue-600 w-6 h-6" /> Income
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-6 mt-4">
                  <Button type="button" variant="outline" className="px-8 py-3 text-lg font-semibold rounded-xl border-2 border-blue-200 hover:bg-blue-50 transition-colors duration-150" onClick={handleEditCancel}>Cancel</Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-md transition-colors duration-150">Save Changes</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      </div>
    </>
  );
}
