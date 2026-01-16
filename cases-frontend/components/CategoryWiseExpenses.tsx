'use client';

import axios from '@/lib/axios';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface CategoryWiseExpensesProps {
  refreshTrigger?: number;
  refreshCategoryTrigger?: number;
}
interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
}

interface CategoryWithExpenses {
  id: string;
  name: string;
  expenses: Expense[];
}

export default function CategoryWiseExpenses({ refreshTrigger, refreshCategoryTrigger }: CategoryWiseExpensesProps) {
  const [data, setData] = useState<CategoryWithExpenses[]>([]);
  const [loading, setLoading] = useState(true);
  const [localTrigger, setLocalTrigger] = useState(0);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    async function fetchCategoryExpenses() {
      setLoading(true);
      try {
        const params = new URLSearchParams();

        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0); // Start of day
          params.append('startDate', start.toISOString().split('T')[0]);
        }

        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999); // End of day
          params.append('endDate', end.toISOString().split('T')[0]);
        }

        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/expenses/categories/filter?${params}`;
        const res = await axios.get(url);
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch filtered category expenses', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryExpenses();
  }, [startDate, endDate, refreshTrigger, localTrigger, refreshCategoryTrigger]);


  const handleDeleteExpense = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    try {
      await axios.delete(`/expenses/${id}`);
      toast.success('Expense deleted');
      setLocalTrigger(prev => prev + 1);
    } catch (err) {
      toast.error('Failed to delete expense');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await axios.delete(`/expenses/categories/${id}`);
      toast.success('Category deleted');
      setLocalTrigger(prev => prev + 1);
    } catch (err) {
      toast.error('Failed to delete category');
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (data.length === 0) return <p className="p-4">No categories found.</p>;

  return (


    <div className="space-y-6 p-4">
      <div className="flex gap-4 items-center mb-4">
        <div>
          <label className="block text-sm mb-1">Start Date</label>
          <input
            type="date"
            className="border px-2 py-1 rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">End Date</label>
          <input
            type="date"
            className="border px-2 py-1 rounded"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Expenses by Category</h2>

      {data.map(category => (
        <div key={category.id} className="border rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold">{category.name}</h3>
            <button
              className="text-red-500 text-sm hover:underline cursor-pointer"
              onClick={() => handleDeleteCategory(category.id)}
            >
              Delete Category
            </button>
          </div>

          {category.expenses.length === 0 ? (
            <p className="text-gray-500">No expenses</p>
          ) : (
            <ul className="divide-y">
              {category.expenses.map(exp => (
                <li key={exp.id} className="py-2 flex justify-between text-sm items-center">
                  <span>{format(new Date(exp.date), 'dd/MM/yyyy')}</span>
                  <span>{exp.description}</span>
                  <span>₹{exp.amount.toFixed(2)}</span>
                  <button
                    className="text-xs text-red-500 hover:underline ml-4 cursor-pointer"
                    onClick={() => handleDeleteExpense(exp.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-2 text-right font-semibold">
            Total: ₹{category.expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}