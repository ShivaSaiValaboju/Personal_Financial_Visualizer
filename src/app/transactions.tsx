"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Transaction {
  id: string;
  description: string;
  category: string;
  date: string;
  amount: number;
  type: "income" | "expense";
}

const categories = ["Food", "Transport", "Shopping", "Bills", "Other"];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().slice(0, 10),
    type: "expense",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description.trim() || !form.amount || !form.category) return;
    setTransactions([
      {
        id: Math.random().toString(36).slice(2),
        description: form.description,
        amount: parseFloat(form.amount),
        category: form.category,
        date: form.date,
        type: form.type as "income" | "expense",
      },
      ...transactions,
    ]);
    setForm({ description: "", amount: "", category: "", date: new Date().toISOString().slice(0, 10), type: "expense" });
    setShowModal(false);
  };

  return (
    <div className="flex min-h-screen bg-[#f7fafd]">
      {/* Sidebar ...existing code... */}
      <main className="flex-1 p-10">
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
                      <td className="py-3 px-4">{t.description}</td>
                      <td className="py-3 px-4">{t.category}</td>
                      <td className="py-3 px-4">{new Date(t.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4">${t.amount.toFixed(2)}</td>
                      <td className="py-3 px-4">-</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Add Transaction Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative">
              <button className="absolute top-4 right-4 text-2xl" onClick={() => setShowModal(false)}>&times;</button>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">+ Add Transaction</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="font-semibold mb-1 block">Description</label>
                  <input name="description" value={form.description} onChange={handleChange} placeholder="Enter transaction description" className="w-full border rounded px-3 py-2" required />
                </div>
                <div>
                  <label className="font-semibold mb-1 block">Amount</label>
                  <div className="flex items-center">
                    <span className="px-2 text-gray-400">$</span>
                    <input name="amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
                  </div>
                </div>
                <div>
                  <label className="font-semibold mb-1 block">Category</label>
                  <select name="category" value={form.category} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
                    <option value="">Select a category</option>
                    {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-semibold mb-1 block">Date</label>
                  <input name="date" type="date" value={form.date} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
                </div>
                <div>
                  <label className="font-semibold mb-1 block">Type</label>
                  <div className="flex gap-6 mt-1">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="type" value="expense" checked={form.type === "expense"} onChange={handleChange} /> Expense
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="type" value="income" checked={form.type === "income"} onChange={handleChange} /> Income
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-4">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Add Transaction</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
