'use client';

import CategoryWiseExpenses from '@/components/CategoryWiseExpenses';
import CreateExpenseCategoryForm from '@/components/CreateExpenseCategoryForm';
import ExpenseForm from '@/components/ExpenseForm';
import { useState } from 'react';

const Page = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [refreshCategoryTrigger, setRefreshCategoryTrigger] = useState(0);

  const handleExpenseAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCategoryAdded = () => {
    setRefreshCategoryTrigger(prev => prev + 1);
  };
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Expenses</h1>

      <div className="grid gap-6">
        <div className="border rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Create Expense Category</h2>
          <CreateExpenseCategoryForm onCategoryAdded={handleCategoryAdded} />
        </div>

        <div className="border rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Add New Expense</h2>
          <ExpenseForm onExpenseAdded={handleExpenseAdded} refreshCategoryTrigger={refreshCategoryTrigger} />
        </div>

        <div>
          <CategoryWiseExpenses
            refreshTrigger={refreshTrigger}
            refreshCategoryTrigger={refreshCategoryTrigger}
          />

        </div>
      </div>
    </div>
  );
};

export default Page;
