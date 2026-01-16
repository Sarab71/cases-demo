'use client';

import axios from '@/lib/axios';
import { useState } from 'react';
import { toast } from 'react-toastify';

interface Props {
  onCategoryAdded?: () => void;
}


export default function CreateExpenseCategoryForm({onCategoryAdded}: Props) {
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post('/expenses/categories', { name });
      toast.success('Category created successfully!');
      setName('');
      if(onCategoryAdded) onCategoryAdded();
    } catch (error: any) {
      const message =
        error?.response?.data?.message || 'Error creating category.';
      toast.error(message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-4 rounded-xl shadow-md space-y-4"
    >
      <h2 className="text-xl font-bold">Create Expense Category</h2>
      <input
        type="text"
        placeholder="Category Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
      >
        Create
      </button>
    </form>
  );
}
