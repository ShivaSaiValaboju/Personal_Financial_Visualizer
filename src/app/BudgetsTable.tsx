import React from "react";

interface Transaction {
  id: string;
  description: string;
  category: string;
  date: string;
  amount: number;
  type: "income" | "expense";
}

interface BudgetsTableProps {
  categories: string[];
  transactions: Transaction[];
  currentMonth: number;
  currentYear: number;
  getCategoryColor: (cat: string) => string;
}



export function BudgetsTable({ categories, transactions, currentMonth, currentYear, getCategoryColor }: BudgetsTableProps) {
  // --- Budgets State ---
  const defaultBudgets: Record<string, number> = Object.fromEntries(categories.map(cat => [cat, 400]));
  const [budgets, setBudgets] = React.useState<Record<string, number>>(defaultBudgets);
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('budgets');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object') setBudgets({ ...defaultBudgets, ...parsed });
        } catch {}
      }
    }
  }, []);
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('budgets', JSON.stringify(budgets));
    }
  }, [budgets]);

  // Calculate actuals for current month
  const actuals: Record<string, number> = {};
  categories.forEach(category => {
    actuals[category] = transactions.filter(t => t.type === 'expense' && t.category === category && new Date(t.date).getMonth() + 1 === currentMonth && new Date(t.date).getFullYear() === currentYear).reduce((sum, t) => sum + t.amount, 0);
  });
  // Editable state for input focus
  const [editing, setEditing] = React.useState<string | null>(null);
  const [inputValue, setInputValue] = React.useState<string>('');
  // Handle edit
  const handleEdit = (cat: string) => {
    setEditing(cat);
    setInputValue(budgets[cat]?.toString() || '');
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value.replace(/[^\d.]/g, ''));
  };
  const handleInputBlur = (cat: string) => {
    const val = parseFloat(inputValue);
    setBudgets(prev => ({ ...prev, [cat]: isNaN(val) ? 0 : val }));
    setEditing(null);
  };
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, cat: string) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    } else if (e.key === 'Escape') {
      setEditing(null);
    }
  };
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold mb-1">Monthly Category Budgets</h1>
          <p className="text-gray-500">Set and manage your monthly spending limits for each category. Click a budget to edit.</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-10 animate-fadeIn">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-gray-500 text-base">
                <th className="py-3 px-4 font-semibold">CATEGORY</th>
                <th className="py-3 px-4 font-semibold">BUDGET</th>
                <th className="py-3 px-4 font-semibold">ACTUAL</th>
                <th className="py-3 px-4 font-semibold">REMAINING</th>
                <th className="py-3 px-4 font-semibold">PROGRESS</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => {
                const budget = budgets[cat] || 0;
                const actual = actuals[cat] || 0;
                const remaining = budget - actual;
                const percent = budget > 0 ? Math.min(100, Math.round((actual / budget) * 100)) : 0;
                return (
                  <tr key={cat} className="bg-[#f7fafd] rounded-xl shadow-sm">
                    <td className="py-3 px-4 font-semibold flex items-center gap-3">
                      <span className="w-4 h-4 rounded-full" style={{ background: getCategoryColor(cat) }}></span>
                      <span>{cat}</span>
                    </td>
                    <td className="py-3 px-4">
                      {editing === cat ? (
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={inputValue}
                          onChange={handleInputChange}
                          onBlur={() => handleInputBlur(cat)}
                          onKeyDown={e => handleInputKeyDown(e, cat)}
                          className="border-2 border-blue-300 rounded-lg px-3 py-2 w-28 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50"
                          autoFocus
                        />
                      ) : (
                        <button className="text-blue-600 font-semibold hover:underline text-base" onClick={() => handleEdit(cat)}>
                          {budget > 0 ? budget.toLocaleString(undefined, { style: 'currency', currency: 'USD' }) : <span className="text-gray-400">Set budget</span>}
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-4 font-semibold text-base">{actual > 0 ? actual.toLocaleString(undefined, { style: 'currency', currency: 'USD' }) : <span className="text-gray-400">-</span>}</td>
                    <td className={`py-3 px-4 font-semibold text-base ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>{budget > 0 ? remaining.toLocaleString(undefined, { style: 'currency', currency: 'USD' }) : <span className="text-gray-400">-</span>}</td>
                    <td className="py-3 px-4">
                      <div className="w-40 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-3 rounded-full transition-all duration-300 ${percent < 80 ? 'bg-blue-500' : percent < 100 ? 'bg-orange-400' : 'bg-red-500'}`} style={{ width: `${percent}%` }}></div>
                      </div>
                      <span className="text-xs ml-2 font-semibold text-gray-600">{percent}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
