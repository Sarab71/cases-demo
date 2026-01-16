'use client';

import axios from '@/lib/axios';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

interface ExpenseFormProps {
  onExpenseAdded?: () => void;
  refreshCategoryTrigger?:number;
}
interface CategorySuggestion {
  id: string;
  category: string;
}

export default function ExpenseForm({onExpenseAdded, refreshCategoryTrigger}: ExpenseFormProps) {
  const [category, setCategory] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [suggestions, setSuggestions] = useState<CategorySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/expenses/categories`);
        const data = res.data.map((cat: any) => ({
          id: cat.id,
          category: cat.name,
        }));
        setSuggestions(data);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [refreshCategoryTrigger]);

  const filteredSuggestions = suggestions.filter(s =>
    s.category.toLowerCase().includes(category.toLowerCase())
  );

  useEffect(() => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        setHighlightedIndex(prev => (prev < filteredSuggestions.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : filteredSuggestions.length - 1));
      } else if (e.key === 'Enter' && highlightedIndex >= 0) {
        const selected = filteredSuggestions[highlightedIndex];
        handleCategorySelect(selected);
        e.preventDefault();
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSuggestions, filteredSuggestions, highlightedIndex]);

  const handleCategorySelect = (cat: CategorySuggestion) => {
    setCategory(cat.category);
    setCategoryId(cat.id);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

      if (!categoryId) {
    toast.error("Please select a category from the list");
    setLoading(false);
    return;
  }

    const payload = {
      categoryId,
      description,
      amount: Number(amount),
      ...(date && { date }),
    };

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/expenses`, payload);
      setCategory('');
      setCategoryId('');
      setDescription('');
      setAmount('');
      setDate('');
      toast.success('Expense added!');
      onExpenseAdded?.();
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error('Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-4 rounded shadow space-y-4 relative"
      autoComplete="off"
    >
      <div className="relative">
        <label className="block font-medium mb-1">Category</label>
        <input
          ref={inputRef}
          type="text"
          value={category}
          onChange={e => {
            setCategory(e.target.value);
            setCategoryId('');
            setShowSuggestions(e.target.value.trim().length > 0);
            setHighlightedIndex(-1);
          }}
          className="border p-2 rounded w-full"
          placeholder="Enter or select category"
          autoComplete="off"
        />
        {showSuggestions && filteredSuggestions.length > 0 && (
          <ul
            className="absolute left-0 right-0 border bg-white rounded mt-1 max-h-40 overflow-y-auto shadow z-20"
            style={{ top: '100%' }}
          >
            {filteredSuggestions.map((s, idx) => (
              <li
                key={s.id}
                className={`p-2 cursor-pointer ${highlightedIndex === idx ? 'bg-blue-100' : 'hover:bg-blue-50'}`}
                onMouseDown={() => handleCategorySelect(s)}
                onMouseEnter={() => setHighlightedIndex(idx)}
              >
                {s.category}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label className="block font-medium mb-1">Description</label>
        <input
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Expense description"
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Amount"
          required
          min={0}
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Date</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:cursor-pointer"
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Expense'}
      </button>
    </form>
  );
}
