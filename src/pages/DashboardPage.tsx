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

// Recharts imports
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { useNavigate } from 'react-router-dom';

// Import custom modal
import ConfirmationModal from '../components/ConfirmationModal';

// --- ICONS (Inline SVGs for no dependencies) ---
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>;
const ChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" /></svg>;
const TagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>;
const SignOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3h12.75" /></svg>;

// Define our color swatches
const colorSwatches = [
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Red', hex: '#ef4444' },
  { name: 'Orange', hex: '#f97316' },
  { name: 'Green', hex: '#22c55e' },
  { name: 'Purple', hex: '#8b5cf6' },
  { name: 'Pink', hex: '#ec4899' },
];

const DashboardPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // "activeTab" now controls the Sidebar Navigation
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'categories'
  const [selectedColor, setSelectedColor] = useState(colorSwatches[0].hex);

// State for Filters
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'all'>('all');
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate] = useState<string | undefined>(undefined);

  // Confirmation modal state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  // Fetch data
  const { data: categories = [], isLoading: isLoadingCategories } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreatingCategory }] = useCreateCategoryMutation();
  const [deleteCategory, { isLoading: isDeletingCategory }] = useDeleteCategoryMutation();
  const { data: allExpenses = [], isLoading: isLoadingExpenses } = useGetExpensesQuery();

  // --- LOGIC: Dynamic Greeting ---
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // --- LOGIC: Filter Expenses ---
  const expenses = (allExpenses || []).filter((exp) => {
    if (selectedCategoryId !== 'all' && exp.category_id !== selectedCategoryId) return false;
    if (!('date' in exp) || !(exp as any).date) return true;
    const expDateStr = new Date((exp as any).date).toISOString().slice(0, 10);
    if (startDate && expDateStr < startDate) return false;
    if (endDate && expDateStr > endDate) return false;
    return true;
  });

  // --- SAFE LOGOUT FIX ---
  const handleLogout = () => {
    dispatch(logOut());
    navigate('/');
    window.location.reload(); // Forces a clear of the Redux cache/state
  };

  // --- LOGIC: Category Handlers ---
  const handleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const form = e.currentTarget;
    const nameInput = form.elements.namedItem('categoryName') as HTMLInputElement;
    const typeSelect = form.elements.namedItem('categoryType') as HTMLSelectElement;

    if (nameInput.value && typeSelect.value) {
      try {
        await createCategory({
          name: nameInput.value,
          userId: user.id,
          type: typeSelect.value,
          color: selectedColor,
        }).unwrap();
        form.reset();
        setSelectedColor(colorSwatches[0].hex);
      } catch (err: any) {
        console.error('Failed to create category:', err);
      }
    }
  };

  const handleDeleteCategory = (id: number) => {
    setCategoryToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) deleteCategory(categoryToDelete);
    setIsConfirmModalOpen(false);
    setCategoryToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsConfirmModalOpen(false);
    setCategoryToDelete(null);
  };

  // --- LOGIC: Calculations ---
  const totalIncome = expenses
    ?.filter(exp => categories.find(cat => cat.id === exp.category_id)?.type === 'Income')
    .reduce((sum, exp) => sum + exp.amount, 0) || 0;

  const totalExpenses = expenses
    ?.filter(exp => categories.find(cat => cat.id === exp.category_id)?.type === 'Expense')
    .reduce((sum, exp) => sum + exp.amount, 0) || 0;

  const totalBalance = totalIncome - totalExpenses;
  const isLoadingData = isLoadingExpenses || isLoadingCategories;

  // --- LOGIC: Chart Data ---
  const expenseCategories = categories.filter(cat => cat.type === 'Expense');
  const pieChartData = expenseCategories.map(cat => ({
    name: cat.name,
    value: expenses?.filter(exp => exp.category_id === cat.id).reduce((sum, exp) => sum + exp.amount, 0) || 0,
    color: cat.color || '#ef4444'
  })).filter(entry => entry.value > 0);

  const barChartData = [
    { name: 'Summary', Income: totalIncome, Expenses: totalExpenses },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
      
      {/* --- LEFT SIDEBAR (NEW) --- */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex flex-shrink-0 transition-all duration-300">
        
        {/* Brand Logo */}
        <div className="h-20 flex items-center px-8 border-b border-slate-800">
           <div className="flex items-center gap-2 text-xl font-bold tracking-wider">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <span className="font-bold text-lg">E</span>
              </div>
              EXPENSIFY
           </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 space-y-2 mt-8 overflow-y-auto">
           
           <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Main Menu</p>
           
           <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
           >
              <HomeIcon />
              <span className="font-medium">Dashboard</span>
           </button>

           <button 
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'categories' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
           >
              <TagIcon />
              <span className="font-medium">Categories</span>
           </button>

           {/* Placeholder "Pro" Features */}
           <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-8 mb-2">Finance Tools</p>
           
           <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-all cursor-not-allowed opacity-70">
              <ChartIcon />
              <span className="font-medium">Analytics</span>
              <span className="ml-auto text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">PRO</span>
           </button>
           <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-all cursor-not-allowed opacity-70">
              <LockIcon />
              <span className="font-medium">Budgets</span>
              <span className="ml-auto text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">PRO</span>
           </button>

        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-900">
           <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                 {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="overflow-hidden">
                 <p className="text-sm font-medium text-white truncate">{user?.username || 'User'}</p>
                 <p className="text-xs text-slate-400 truncate w-32">{user?.email}</p>
              </div>
           </div>
           <button 
             onClick={handleLogout}
             className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 transition-all"
           >
              <SignOutIcon />
              Sign Out
           </button>
        </div>

      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Mobile Header (Visible only on small screens) */}
        <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
           <span className="font-bold text-gray-800">Expensify</span>
           <button onClick={handleLogout} className="text-sm text-red-500 font-medium">Log Out</button>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
            
            {/* Header / Greeting */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
               <div>
                  <h2 className="text-3xl font-extrabold text-gray-800">{getGreeting()}, {user?.username || 'User'}! 👋</h2>
                  <p className="text-gray-500 mt-1">Here is your financial overview.</p>
               </div>
               
               {/* Quick Action Button */}
               {activeTab === 'dashboard' && (
                   <button
                       onClick={() => setIsModalOpen(true)}
                       className="self-start md:self-auto rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2"
                   >
                       <span className="text-lg leading-none">+</span> Add Transaction
                   </button>
               )}
            </div>

            {/* --- DASHBOARD TAB CONTENT --- */}
            {activeTab === 'dashboard' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                  
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Balance Card */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-xl">
                       <div className="relative z-10">
                          <p className="text-sm font-medium text-blue-100 opacity-80">Total Balance</p>
                          <h3 className="mt-1 text-4xl font-bold tracking-tight">
                              {isLoadingData ? '...' : `$${totalBalance.toFixed(2)}`}
                          </h3>
                       </div>
                       <svg className="absolute -right-6 -bottom-6 h-32 w-32 text-white opacity-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.15-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.47.33 2.65 1.1 2.88 3.03h-1.91c-.25-1.23-1.11-1.65-2.22-1.65-1.22 0-2.15.5-2.15 1.6 0 .8.54 1.41 2.5 1.85 2.65.6 4.35 1.63 4.35 3.75 0 1.94-1.56 3.1-3.25 3.51z"/></svg>
                    </div>

                    {/* Income Card */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                       <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                       </div>
                       <div>
                          <p className="text-sm font-medium text-gray-500">Total Income</p>
                          <p className="text-2xl font-bold text-gray-800">{isLoadingData ? '...' : `$${totalIncome.toFixed(2)}`}</p>
                       </div>
                    </div>

                    {/* Expense Card */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                       <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                       </div>
                       <div>
                          <p className="text-sm font-medium text-gray-500">Total Expenses</p>
                          <p className="text-2xl font-bold text-gray-800">{isLoadingData ? '...' : `$${totalExpenses.toFixed(2)}`}</p>
                       </div>
                    </div>
                  </div>

                  {/* Charts Section */}
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                     <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-800 mb-6">Spending Breakdown</h2>
                        <div className="h-[250px] w-full">
                           <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                 <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                                    {pieChartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} stroke="none" />))}
                                 </Pie>
                                 <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value: number) => `$${value.toFixed(2)}`} />
                                 <Legend verticalAlign="bottom" height={36}/>
                              </PieChart>
                           </ResponsiveContainer>
                        </div>
                     </div>
                     <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-800 mb-6">Income vs Expenses</h2>
                        <div className="h-[250px] w-full">
                           <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                 <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                 <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                 <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value: number) => `$${value.toFixed(2)}`} />
                                 <Bar dataKey="Income" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={50} />
                                 <Bar dataKey="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={50} />
                              </BarChart>
                           </ResponsiveContainer>
                        </div>
                     </div>
                  </div>

                  {/* Transaction List */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                      <div className="flex flex-wrap items-center gap-4 mb-6">
                          <h2 className="text-lg font-bold text-gray-800 mr-auto">Recent Transactions</h2>
                          <select value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value === 'all' ? 'all' : Number(e.target.value))} className="rounded-lg border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 border-0 py-2 px-3">
                             <option value="all">All Categories</option>
                             {categories.filter(cat => cat.type === 'Expense').map((cat) => (
                               <option key={cat.id} value={cat.id}>{cat.name}</option>
                             ))}
                          </select>
                          <input type="date" value={startDate || ''} onChange={(e) => setStartDate(e.target.value || undefined)} className="rounded-lg border-0 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 py-2 px-3" />
                      </div>
                      <ExpenseList categories={categories} />
                  </div>
              </div>
            )}

            {/* --- CATEGORIES TAB CONTENT --- */}
            {activeTab === 'categories' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Create New Category</h2>
                  <form onSubmit={handleAddCategory} className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category Name</label>
                          <input type="text" name="categoryName" required placeholder="e.g. Groceries" className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Type</label>
                          <select name="categoryType" required className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all">
                             <option value="Expense">Expense</option>
                             <option value="Income">Income</option>
                          </select>
                        </div>
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Color Tag</label>
                        <div className="flex gap-4">
                           {colorSwatches.map((color) => (
                             <button type="button" key={color.hex} onClick={() => setSelectedColor(color.hex)} className={`h-10 w-10 rounded-full transition-all ${selectedColor === color.hex ? 'ring-4 ring-offset-2 ring-blue-500 scale-110' : 'hover:scale-105'}`} style={{ backgroundColor: color.hex }} />
                           ))}
                        </div>
                     </div>
                     <button type="submit" disabled={isCreatingCategory} className="rounded-xl bg-gray-900 px-8 py-3 text-sm font-bold text-white shadow-lg hover:bg-black transition-all disabled:opacity-50">
                        {isCreatingCategory ? 'Adding...' : 'Create Category'}
                     </button>
                  </form>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                   {isLoadingCategories ? <p>Loading...</p> : categories?.map((category) => (
                      <div key={category.id} className="group relative flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all">
                         <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: category.color || '#ccc' }}>
                               {category.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                               <h3 className="font-bold text-gray-800">{category.name}</h3>
                               <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${category.type === 'Income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{category.type}</span>
                            </div>
                         </div>
                         <button onClick={() => handleDeleteCategory(category.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.576 0c-.342.052-.682.107-1.022.166m11.554 0a48.251 48.251 0 0 1-3.478-.397m1.523 0V3.116A1.125 1.125 0 0 0 12.31 2H11.69a1.125 1.125 0 0 0-1.12 1.116v.678m1.523 0a48.251 48.251 0 0 0-3.478-.397m0 0a48.11 48.11 0 0 0-3.478.397m12.576 0c.342.052.682.107 1.022.166" /></svg>
                         </button>
                      </div>
                   ))}
                </div>
              </div>
            )}
        </main>
      </div>

      {/* Render Modals */}
      {isModalOpen && <AddExpenseModal onClose={() => setIsModalOpen(false)} />}
      <ConfirmationModal isOpen={isConfirmModalOpen} onClose={handleCancelDelete} onConfirm={handleConfirmDelete} title="Delete Category?" isLoading={isDeletingCategory}>
        <p className="text-sm text-gray-500">Are you sure you want to delete this category?</p>
      </ConfirmationModal>
    </div>
  );
};

export default DashboardPage;