// src/pages/DashboardPage.tsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../features/auth/authSlice';
import type { RootState } from '../app/store';

// Import hooks and components
import { useGetCategoriesQuery, useCreateCategoryMutation, useDeleteCategoryMutation } from '../features/categories/categoryApiSlice';
import AddExpenseModal from '../features/expenses/components/AddExpenseModal';
import ExpenseList from '../features/expenses/components/ExpenseList';
import { useGetExpensesQuery } from '../features/expenses/expenseApiSlice'; 

// --- NEW: Define our color swatches ---
const colorSwatches = [
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Red', hex: '#ef4444' },
  { name: 'Orange', hex: '#f97316' },
  { name: 'Green', hex: '#22c55e' },
];

const DashboardPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('transactions'); 
  const [selectedColor, setSelectedColor] = useState(colorSwatches[0].hex); // <-- NEW: State for selected color

  // Fetch all necessary data
  const { data: categories = [], isLoading: isLoadingCategories } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreatingCategory }] = useCreateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const { data: expenses, isLoading: isLoadingExpenses } = useGetExpensesQuery(); 

  const handleLogout = () => {
    dispatch(logOut());
  };

  // --- CATEGORY SUBMISSION LOGIC ---
  const handleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return; 

    const form = e.currentTarget;
    const nameInput = form.elements.namedItem('categoryName') as HTMLInputElement;
    const typeSelect = form.elements.namedItem('categoryType') as HTMLSelectElement; 
    
    const name = nameInput.value;
    const type = typeSelect.value; 

    if (name && type) {
      try {
        await createCategory({
          name: name,
          userId: user.id,
          type: type, 
          color: selectedColor, // <-- NEW: Use the selected color from state
        }).unwrap(); 
        
        form.reset(); 
        setSelectedColor(colorSwatches[0].hex); // <-- NEW: Reset color on success
      } catch (err: any) {
        console.error('Failed to create category:', err.data?.error || err.message);
      }
    }
  };

  const handleDeleteCategory = (id: number) => {
      if (window.confirm('Are you sure you want to delete this category?')) {
          deleteCategory(id);
      }
  };
  // ---------------------------------

  // --- DASHBOARD CALCULATION LOGIC ---
  const totalIncome = expenses
    ?.filter(exp => {
      const category = categories.find(cat => cat.id === exp.category_id);
      return category && category.type === 'Income'; 
    })
    .reduce((sum, exp) => sum + exp.amount, 0) || 0;

  const totalExpenses = expenses
    ?.filter(exp => {
      const category = categories.find(cat => cat.id === exp.category_id);
      return category && category.type === 'Expense'; 
    })
    .reduce((sum, exp) => sum + exp.amount, 0) || 0;

  const totalBalance = totalIncome - totalExpenses;
  const isLoadingData = isLoadingExpenses || isLoadingCategories;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Bar */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Expense Tracker
              </h1>
              {user?.email && (
                <p className="text-sm text-gray-500">{user.email}</p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3h12.75" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-medium text-gray-500">Total Balance</h2>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {isLoadingData ? '...' : `$${totalBalance.toFixed(2)}`}
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-medium text-gray-500">Total Income</h2>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {isLoadingData ? '...' : `$${totalIncome.toFixed(2)}`}
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-medium text-gray-500">Total Expenses</h2>
            <p className="mt-2 text-3xl font-bold text-red-600">
              {isLoadingData ? '...' : `$${totalExpenses.toFixed(2)}`}
            </p>
          </div>
        </div>

        {/* --- Tabs & Content --- */}
        <div className="mt-8">
          <div className="flex items-center justify-between border-b border-gray-200">
            <nav className="-mb-px flex gap-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('transactions')}
                className={`shrink-0 border-b-2 px-1 pb-4 text-sm font-medium ${
                  activeTab === 'transactions'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Transactions
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`shrink-0 border-b-2 px-1 pb-4 text-sm font-medium ${
                  activeTab === 'categories'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Categories
              </button>
            </nav>
            {/* 'Add Transaction' Button */}
            {activeTab === 'transactions' && (
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                    + Add Transaction
                </button>
            )}
            {/* Categories Summary */}
             {activeTab === 'categories' && (
                <p className="text-sm text-gray-500">Managing {categories.length} categories.</p>
            )}

          </div>

          {/* --- Tab Content --- */}
          <div className="py-6">
            {/* Transactions Tab Content */}
            {activeTab === 'transactions' && (
              <div className="mt-4">
                <h2 className="text-xl font-semibold mb-4">Recent Transactions ({expenses?.length || 0})</h2>
                <ExpenseList categories={categories} /> 
              </div>
            )}

            {/* Categories Tab Content */}
            {activeTab === 'categories' && (
              <div className="mt-4">
                {/* Add New Category Form */}
                <form onSubmit={handleAddCategory} className="rounded-lg bg-white p-6 shadow">
                  <h2 className="text-xl font-semibold">Add New Category</h2>
                  
                  {/* Category Name and Type Inputs */}
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {/* Category Name Input */}
                    <div>
                      <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
                        Category Name
                      </label>
                      <input
                        type="text"
                        name="categoryName"
                        id="categoryName"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="e.g., Groceries"
                      />
                    </div>

                    {/* Category Type Dropdown */}
                    <div>
                      <label htmlFor="categoryType" className="block text-sm font-medium text-gray-700">
                        Type
                      </label>
                      <select
                        name="categoryType"
                        id="categoryType"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="Expense">Expense</option>
                        <option value="Income">Income</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* --- NEW: Clickable Color Picker --- */}
                  <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">Color</label>
                      <div className="flex space-x-2 mt-1">
                        {colorSwatches.map((color) => (
                          <button
                            type="button"
                            key={color.hex}
                            onClick={() => setSelectedColor(color.hex)}
                            className={`h-8 w-8 rounded-full border-2 transition-all ${
                              selectedColor === color.hex
                                ? 'border-blue-600 ring-2 ring-blue-300' // Highlight selected
                                : 'border-transparent'
                            }`}
                            style={{ backgroundColor: color.hex }}
                          >
                            &nbsp; {/* Screen reader/empty content fix */}
                          </button>
                        ))}
                      </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={isCreatingCategory}
                      className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:bg-blue-400"
                    >
                      {isCreatingCategory ? 'Adding...' : '+ Add Category'}
                    </button>
                  </div>
                </form>

                {/* Your Categories List */}
                <div className="mt-8">
                  <h2 className="text-xl font-semibold">Your Categories</h2>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {isLoadingCategories ? (
                      <p>Loading categories...</p>
                    ) : (
                      categories?.map((category) => (
                        <div 
                          key={category.id} 
                          className="flex flex-col rounded-lg bg-white p-4 shadow justify-between"
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-medium text-gray-900">{category.name}</span>
                            {/* DELETE BUTTON */}
                            <button 
                                onClick={() => handleDeleteCategory(category.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.576 0c-.342.052-.682.107-1.022.166m11.554 0a48.251 48.251 0 0 1-3.478-.397m1.523 0V3.116A1.125 1.125 0 0 0 12.31 2H11.69a1.125 1.125 0 0 0-1.12 1.116v.678m1.523 0a48.251 48.251 0 0 0-3.478-.397m0 0a48.11 48.11 0 0 0-3.478.397m12.576 0c.342.052.682.107 1.022.166" />
                                </svg>
                            </button>
                          </div>
                          {/* --- NEW: Use category.color from database --- */}
                          <div className="flex items-center text-xs mt-1 space-x-2">
                            <div 
                              className={`h-2 w-2 rounded-full`} 
                              style={{ backgroundColor: category.color || '#dc2626' }} // Use saved color
                            ></div>
                            <span 
                              className={`font-semibold ${category.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}
                            >
                              {category.type || 'Expense'}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* --- Render Modal Conditionally --- */}
      {isModalOpen && <AddExpenseModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default DashboardPage;