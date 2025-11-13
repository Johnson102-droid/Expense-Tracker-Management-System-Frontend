// src/features/expenses/components/ExpenseList.tsx
import React from 'react';
import { useGetExpensesQuery, useDeleteExpenseMutation } from '../expenseApiSlice'; 
import type { ExpenseResponse } from '../expenseApiSlice'; 
import type { Category } from '../../categories/categoryApiSlice'; 

// Define Props for the ExpenseList component
interface ExpenseListProps {
    categories: Category[]; // Receive the categories array
}

const ExpenseList = ({ categories }: ExpenseListProps) => { // Receive the prop
  const { data: expenses, isLoading, isSuccess, isError, error } = useGetExpensesQuery();
  const [deleteExpense] = useDeleteExpenseMutation(); // <-- DELETE MUTATION HOOK

  if (isLoading) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-500">Loading transactions...</p>
      </div>
    );
  }

  if (isError) {
    console.error("Expense fetching failed:", error);
    return (
      <div className="text-center p-4">
        <p className="text-red-500">Error loading transactions. Check console.</p>
      </div>
    );
  }

  if (isSuccess && expenses.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700">No Expenses Recorded</h3>
        <p className="mt-1 text-sm text-gray-500">
          Click "+ Add Transaction" to start tracking your spending.
        </p>
      </div>
    );
  }

  const handleDelete = (id: number) => {
      if (window.confirm('Are you sure you want to delete this transaction?')) {
          deleteExpense(id);
      }
  };

  // Display the List
  return (
    <div className="space-y-4">
      {expenses.map((expense: ExpenseResponse) => {
          // --- LOGIC FIX: Determine type, color, and sign ---
          const category = categories.find(cat => cat.id === expense.category_id);
          const isIncome = category?.type === 'Income';
          const amountColor = isIncome ? 'text-green-600' : 'text-red-600';
          const amountSign = isIncome ? '+' : '-';

          return (
            <div key={expense.id} className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
              
              {/* Left Side: Category and Note */}
              <div className="flex items-center space-x-4">
                <div className={`h-3 w-3 rounded-full ${isIncome ? 'bg-green-500' : 'bg-red-500'}`}></div> 
                
                <div>
                  <p className="font-medium text-gray-800">{category?.name || `ID: ${expense.category_id}`}</p> 
                  <p className="text-sm text-gray-500 truncate max-w-xs">{expense.note || 'No description'}</p>
                </div>
              </div>

              {/* Right Side: Amount, Date, and Delete Button */}
              <div className="flex items-center space-x-3">
                  <div className="text-right">
                      <p className={`text-lg font-semibold ${amountColor}`}>
                          {amountSign}{expense.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                          {new Date(expense.expense_date).toLocaleDateString()}
                      </p>
                  </div>
                  {/* DELETE BUTTON */}
                  <button 
                      onClick={() => handleDelete(expense.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0-.97-6.045m6.496-4.254a4.125 4.125 0 0 0-4.123 4.123h-2.123a4.125 4.125 0 0 0 4.123 4.123m0 0h2.25m-2.25 0V15.75m0 0a.75.75 0 0 1-.75-.75V12m0 0a.75.75 0 0 1-.75-.75V9m0 0a.75.75 0 0 1 .75-.75h1.5" />
                      </svg>
                  </button>
              </div>
            </div>
          );
      })}
    </div>
  );
};

export default ExpenseList;