// src/features/expenses/components/ExpenseList.tsx
// FIX: Removed unused 'React' import
import { useGetExpensesQuery, useDeleteExpenseMutation } from '../expenseApiSlice'; 
import type { ExpenseResponse } from '../expenseApiSlice'; 
import type { Category } from '../../categories/categoryApiSlice'; 

// Define Props for the ExpenseList component
interface ExpenseListProps {
    categories: Category[]; 
}

const ExpenseList = ({ categories }: ExpenseListProps) => { 
  const { data: expenses, isLoading, isSuccess, isError, error } = useGetExpensesQuery();
  const [deleteExpense] = useDeleteExpenseMutation(); 

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
      {/* FIX: Add 'expenses?.map' to safely handle undefined */}
      {expenses?.map((expense: ExpenseResponse) => {
          const category = categories.find(cat => cat.id === expense.category_id);
          const isIncome = category?.type === 'Income';
          const amountColor = isIncome ? 'text-green-600' : 'text-red-600';
          const amountSign = isIncome ? '+' : '-';
          const categoryName = category?.name || `Category ID: ${expense.category_id}`;

          return (
            <div key={expense.id} className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
              
              {/* Left Side: Category and Note */}
              <div className="flex items-center space-x-4">
                <div className={`h-3 w-3 rounded-full ${isIncome ? 'bg-green-500' : 'bg-red-500'}`}></div> 
                
                <div>
                  <p className="font-medium text-gray-800">{categoryName}</p> 
                  <p className="text-sm text-gray-500 truncate max-w-xs">{expense.note || 'No description'}</p>
                </div>
              </div>

              {/* Right Side: Amount, Date, and Delete Button */}
              <div className="flex items-center space-x-3">
                  <div className="text-right">
                      <p className={`text-lg font-semibold ${amountColor}`}>
                          {amountSign}${expense.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                          {new Date(expense.expense_date).toLocaleDateString()}
                      </p>
                  </div>
                  <button 
                      onClick={() => handleDelete(expense.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.576 0c-.342.052-.682.107-1.022.166m11.554 0a48.251 48.251 0 0 1-3.478-.397m1.523 0V3.116A1.125 1.125 0 0 0 12.31 2H11.69a1.125 1.125 0 0 0-1.12 1.116v.678m1.523 0a48.251 48.251 0 0 0-3.478-.397m0 0a48.11 48.11 0 0 0-3.478.397m12.576 0c.342.052.682.107 1.022.166" />
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