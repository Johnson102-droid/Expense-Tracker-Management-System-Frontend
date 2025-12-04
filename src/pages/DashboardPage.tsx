// src/pages/DashboardPage.tsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../features/auth/authSlice';
import type { RootState } from '../app/store';

// Import hooks and components
import { useGetCategoriesQuery, useCreateCategoryMutation, useDeleteCategoryMutation } from '../features/categories/categoryApiSlice';
import AddExpenseModal from '../features/expenses/components/AddExpenseModal';
import { useGetExpensesQuery } from '../features/expenses/expenseApiSlice';

// Import New Pages
import AnalyticsPage from './AnalyticsPage';
import BudgetsPage from './BudgetsPage';

// Recharts imports
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { useNavigate } from 'react-router-dom';

// Import custom modal
import ConfirmationModal from '../components/ConfirmationModal';

// --- ICONS ---
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>;
const ChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" /></svg>;
const TagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>;
const SignOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3h12.75" /></svg>;
const CurrencyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;

// --- UI COMPONENTS ---
const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded-md ${className}`}></div>
);

// Custom Tooltip that respects currency
const CustomChartTooltip = ({ active, payload, label, currencyFormatter }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl border border-slate-700">
        <p className="font-bold mb-1 opacity-70">{label}</p>
        {payload.map((p: any, index: number) => (
          <p key={index} style={{ color: p.fill || p.color }}>
            {p.name}: {currencyFormatter(Number(p.value))}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const colorSwatches = [
  { name: 'Green', hex: '#22c55e' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Red', hex: '#ef4444' },
  { name: 'Orange', hex: '#f97316' },
  { name: 'Purple', hex: '#8b5cf6' },
  { name: 'Pink', hex: '#ec4899' },
];

const DashboardPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  // --- 1. CURRENCY STATE (New) ---
  // Load from localStorage or default to 'KES'
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'KES');

  // --- 2. CURRENCY FORMATTER (New) ---
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Handler to switch currency
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrency = e.target.value;
    setCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency);
  };

  // State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [selectedColor, setSelectedColor] = useState(colorSwatches[0].hex);

  // Filters
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'all'>('all');
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate] = useState<string | undefined>(undefined);

  // Modal State
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  // API Data
  const { data: categories = [], isLoading: isLoadingCategories } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreatingCategory }] = useCreateCategoryMutation();
  const [deleteCategory, { isLoading: isDeletingCategory }] = useDeleteCategoryMutation();
  const { data: allExpenses = [], isLoading: isLoadingExpenses } = useGetExpensesQuery();

  const isLoadingData = isLoadingExpenses || isLoadingCategories;

  // --- LOGIC ---
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleLogout = () => {
    dispatch(logOut());
    navigate('/');
    window.location.reload(); 
  };

  // Filter Logic
  const expenses = (allExpenses || []).filter((exp) => {
    if (selectedCategoryId !== 'all' && exp.category_id !== selectedCategoryId) return false;
    const dateVal = (exp as any).date || (exp as any).expense_date;
    if (!dateVal) return true;
    const expDateStr = new Date(dateVal).toISOString().slice(0, 10);
    if (startDate && expDateStr < startDate) return false;
    if (endDate && expDateStr > endDate) return false;
    return true;
  });

  // Grouping Logic
  const groupExpensesByDate = (expenseList: any[]) => {
    const groups: { [key: string]: any[] } = {};
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const sorted = [...expenseList].sort((a, b) => {
        const dateA = new Date((a as any).date || (a as any).expense_date).getTime();
        const dateB = new Date((b as any).date || (b as any).expense_date).getTime();
        return dateB - dateA;
    });

    sorted.forEach(expense => {
      const dateVal = (expense as any).date || (expense as any).expense_date;
      const dateObj = new Date(dateVal);
      const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      
      let label = dateStr;
      if (dateStr === today) label = 'Today';
      else if (dateStr === yesterday) label = 'Yesterday';

      if (!groups[label]) groups[label] = [];
      groups[label].push(expense);
    });
    return groups;
  };

  const groupedExpenses = groupExpensesByDate(expenses);

  // Calculations
  const totalIncome = expenses
    ?.filter(exp => categories.find(cat => cat.id === exp.category_id)?.type === 'Income')
    .reduce((sum, exp) => sum + Number(exp.amount), 0) || 0;

  const totalExpenses = expenses
    ?.filter(exp => categories.find(cat => cat.id === exp.category_id)?.type === 'Expense')
    .reduce((sum, exp) => sum + Number(exp.amount), 0) || 0;

  const totalBalance = totalIncome - totalExpenses;

  // Chart Data
  const expenseCategories = categories.filter(cat => cat.type === 'Expense');
  const pieChartData = expenseCategories.map(cat => ({
    name: cat.name,
    value: expenses?.filter(exp => exp.category_id === cat.id).reduce((sum, exp) => sum + Number(exp.amount), 0) || 0,
    color: cat.color || '#ef4444'
  })).filter(entry => entry.value > 0);

  const barChartData = [
    { name: 'Summary', Income: totalIncome, Expenses: totalExpenses },
  ];

  // Category Handlers
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

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 text-white flex flex-col hidden md:flex flex-shrink-0 transition-all duration-300">
        <div className="h-20 flex items-center px-8 border-b border-slate-800/50">
           <div className="flex items-center gap-2 text-xl font-bold tracking-wider">
             <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-green-500/20">
               <span className="font-bold text-lg">E</span>
             </div>
             EXPENSE TRACKER
           </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-8 overflow-y-auto">
           <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Main Menu</p>
           
           <button 
             onClick={() => setActiveTab('dashboard')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'dashboard' ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
           >
             <HomeIcon /> <span className="font-medium">Dashboard</span>
           </button>

           <button 
             onClick={() => setActiveTab('categories')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'categories' ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
           >
             <TagIcon /> <span className="font-medium">Categories</span>
           </button>

           <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-8 mb-2">Finance Tools</p>
           
           <button 
             onClick={() => setActiveTab('analytics')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'analytics' ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
           >
             <ChartIcon /> <span className="font-medium">Analytics</span>
           </button>

           <button 
             onClick={() => setActiveTab('budgets')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'budgets' ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
           >
             <LockIcon /> <span className="font-medium">Budgets</span>
           </button>
        </nav>

        <div className="p-4 border-t border-slate-800/50 bg-slate-900/50">
           <div className="flex items-center gap-3 mb-4 px-2">
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-slate-800">
                 {user?.username?.charAt(0).toUpperCase() || 'U'}
             </div>
             <div className="overflow-hidden">
                 <p className="text-sm font-medium text-white truncate">{user?.username || 'User'}</p>
                 <p className="text-xs text-slate-400 truncate w-32">{user?.email}</p>
             </div>
           </div>
           <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 transition-all">
             <SignOutIcon /> Sign Out
           </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm z-20">
           <span className="font-bold text-gray-800 flex items-center gap-2">
              <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center text-white text-xs">E</div>
              Expensify
           </span>
           <button onClick={handleLogout} className="text-sm text-red-500 font-medium">Log Out</button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 relative z-0">
            
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
               <div>
                  <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">{getGreeting()}, {user?.username || 'User'}! 👋</h2>
                  <p className="text-gray-500 mt-1">Here is your financial overview.</p>
               </div>
               
               {/* Right Side Actions: Currency & Add Transaction */}
               <div className="flex items-center gap-4">
                  {/* Currency Switcher */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                      <CurrencyIcon />
                    </div>
                    <select 
                      value={currency} 
                      onChange={handleCurrencyChange} 
                      className="pl-10 pr-8 py-3 rounded-xl border-gray-200 bg-white text-sm font-bold text-gray-700 shadow-sm focus:border-green-500 focus:ring-green-500 cursor-pointer appearance-none"
                    >
                      <option value="KES">KES (Ksh)</option>
                      <option value="USD">USD ($)</option>
                    </select>
                  </div>

                  {activeTab === 'dashboard' && (
                      <button
                          onClick={() => setIsModalOpen(true)}
                          className="group self-start md:self-auto rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-green-500/30 hover:bg-green-700 hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center gap-2"
                      >
                          <span className="text-xl leading-none font-light group-hover:rotate-90 transition-transform duration-300">+</span> Add Transaction
                      </button>
                  )}
               </div>
            </div>

            {/* ======================= TAB: DASHBOARD ======================= */}
            {activeTab === 'dashboard' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                  
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Balance */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 to-emerald-700 p-6 text-white shadow-xl hover:-translate-y-1 transition-transform duration-300">
                       <div className="relative z-10">
                          <p className="text-sm font-medium text-green-100 opacity-80">Total Balance</p>
                          <h3 className="mt-1 text-4xl font-bold tracking-tight">
                             {/* 🟢 CHANGED: Using formatCurrency() */}
                             {isLoadingData ? <Skeleton className="h-10 w-32 bg-white/20" /> : formatCurrency(totalBalance)}
                          </h3>
                       </div>
                       <svg className="absolute -right-6 -bottom-6 h-32 w-32 text-white opacity-10 rotate-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.15-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.47.33 2.65 1.1 2.88 3.03h-1.91c-.25-1.23-1.11-1.65-2.22-1.65-1.22 0-2.15.5-2.15 1.6 0 .8.54 1.41 2.5 1.85 2.65.6 4.35 1.63 4.35 3.75 0 1.94-1.56 3.1-3.25 3.51z"/></svg>
                    </div>

                    {/* Income */}
                    <div className="group rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md hover:border-green-100 transition-all duration-300">
                       <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-100 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                       </div>
                       <div>
                          <p className="text-sm font-medium text-gray-500">Total Income</p>
                          <div className="text-2xl font-bold text-gray-800">
                             {/* 🟢 CHANGED: Using formatCurrency() */}
                             {isLoadingData ? <Skeleton className="h-8 w-24" /> : formatCurrency(totalIncome)}
                          </div>
                       </div>
                    </div>

                    {/* Expense */}
                    <div className="group rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md hover:border-rose-100 transition-all duration-300">
                       <div className="p-3 bg-rose-50 text-rose-600 rounded-xl group-hover:bg-rose-100 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                       </div>
                       <div>
                          <p className="text-sm font-medium text-gray-500">Total Expenses</p>
                          <div className="text-2xl font-bold text-gray-800">
                             {/* 🟢 CHANGED: Using formatCurrency() */}
                             {isLoadingData ? <Skeleton className="h-8 w-24" /> : formatCurrency(totalExpenses)}
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* Charts */}
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                     <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-800 mb-6">Spending Breakdown</h2>
                        <div className="h-[250px] w-full">
                           {pieChartData.length > 0 ? (
                             <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                                        {pieChartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} stroke="none" />))}
                                    </Pie>
                                    {/* 🟢 CHANGED: Passed formatter to Tooltip */}
                                    <Tooltip content={<CustomChartTooltip currencyFormatter={formatCurrency} />} cursor={{fill: 'transparent'}} />
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                             </ResponsiveContainer>
                           ) : (
                             <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <div className="w-16 h-16 bg-gray-100 rounded-full mb-2 flex items-center justify-center">?</div>
                                <p className="text-sm">No expenses recorded yet</p>
                             </div>
                           )}
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
                                 {/* 🟢 CHANGED: Passed formatter to Tooltip */}
                                 <Tooltip content={<CustomChartTooltip currencyFormatter={formatCurrency} />} cursor={{fill: '#f9fafb'}} />
                                 <Bar dataKey="Income" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={50} />
                                 <Bar dataKey="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={50} />
                              </BarChart>
                           </ResponsiveContainer>
                        </div>
                     </div>
                  </div>

                  {/* Grouped Transaction List */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                      <div className="flex flex-wrap items-center gap-4 mb-6">
                          <h2 className="text-lg font-bold text-gray-800 mr-auto">Recent Transactions</h2>
                          <select value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value === 'all' ? 'all' : Number(e.target.value))} className="rounded-lg border-gray-300 text-sm focus:border-green-500 focus:ring-green-500 bg-gray-50 border-0 py-2 px-3 hover:bg-gray-100 transition-colors cursor-pointer">
                             <option value="all">All Categories</option>
                             {categories.filter(cat => cat.type === 'Expense').map((cat) => (
                               <option key={cat.id} value={cat.id}>{cat.name}</option>
                             ))}
                          </select>
                          <input type="date" value={startDate || ''} onChange={(e) => setStartDate(e.target.value || undefined)} className="rounded-lg border-0 bg-gray-50 text-sm focus:ring-2 focus:ring-green-500 py-2 px-3 hover:bg-gray-100 transition-colors" />
                      </div>

                      <div className="space-y-6">
                        {isLoadingExpenses ? (
                            [1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)
                        ) : Object.keys(groupedExpenses).length === 0 ? (
                           <div className="text-center py-10">
                              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                                <TagIcon />
                              </div>
                              <p className="text-gray-500 font-medium">No transactions found.</p>
                              <p className="text-sm text-gray-400">Try adjusting filters or add a new one.</p>
                           </div>
                        ) : (
                           Object.entries(groupedExpenses).map(([dateLabel, items]) => (
                             <div key={dateLabel}>
                               <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">{dateLabel}</h4>
                               <div className="space-y-2">
                                  {items.map((expense: any) => {
                                      const cat = categories.find(c => c.id === expense.category_id);
                                      const isIncome = cat?.type === 'Income';
                                      return (
                                          <div key={expense.id} className="flex justify-between items-center p-4 bg-gray-50/50 rounded-xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100 group">
                                              <div className="flex items-center gap-4">
                                                  <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm" style={{ backgroundColor: cat?.color || '#cbd5e1' }}>
                                                      {cat?.name?.[0] || '?'}
                                                  </div>
                                                  <div>
                                                      <p className="font-bold text-gray-800 group-hover:text-green-700 transition-colors">{expense.note || 'No description'}</p>
                                                      <p className="text-xs text-gray-400">{cat?.name || 'Uncategorized'}</p>
                                                  </div>
                                              </div>
                                              <span className={`font-bold tabular-nums ${isIncome ? 'text-green-600' : 'text-slate-700'}`}>
                                                  {/* 🟢 CHANGED: Using formatCurrency() */}
                                                  {isIncome ? '+' : '-'}{formatCurrency(Number(expense.amount))}
                                              </span>
                                          </div>
                                      );
                                  })}
                               </div>
                             </div>
                           ))
                        )}
                      </div>
                  </div>
              </div>
            )}

            {/* ======================= TAB: CATEGORIES ======================= */}
            {activeTab === 'categories' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Create New Category</h2>
                  <form onSubmit={handleAddCategory} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category Name</label>
                           <input type="text" name="categoryName" required placeholder="e.g. Groceries" className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all" />
                         </div>
                         <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Type</label>
                           <select name="categoryType" required className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all">
                              <option value="Expense">Expense</option>
                              <option value="Income">Income</option>
                           </select>
                         </div>
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Color Tag</label>
                         <div className="flex gap-4">
                            {colorSwatches.map((color) => (
                              <button type="button" key={color.hex} onClick={() => setSelectedColor(color.hex)} className={`h-10 w-10 rounded-full transition-all ${selectedColor === color.hex ? 'ring-4 ring-offset-2 ring-green-500 scale-110' : 'hover:scale-105'}`} style={{ backgroundColor: color.hex }} />
                            ))}
                         </div>
                      </div>
                      <button type="submit" disabled={isCreatingCategory} className="rounded-xl bg-slate-900 px-8 py-3 text-sm font-bold text-white shadow-lg hover:bg-black transition-all disabled:opacity-50">
                         {isCreatingCategory ? 'Adding...' : 'Create Category'}
                      </button>
                  </form>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                   {isLoadingCategories ? [1,2,3].map(i => <Skeleton key={i} className="h-24 w-full" />) : categories?.map((category) => (
                      <div key={category.id} className="group relative flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-green-100 transition-all">
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

            {/* ======================= TAB: ANALYTICS (NEW) ======================= */}
            {activeTab === 'analytics' && <AnalyticsPage />}

            {/* ======================= TAB: BUDGETS (NEW) ======================= */}
            {activeTab === 'budgets' && <BudgetsPage />}

        </main>
      </div>

      {/* Render Modals */}
      {isModalOpen && <AddExpenseModal onClose={() => setIsModalOpen(false)} />}
      <ConfirmationModal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} onConfirm={handleConfirmDelete} title="Delete Category?" isLoading={isDeletingCategory}>
        <p className="text-sm text-gray-500">Are you sure? Expenses linked to this category might be affected.</p>
      </ConfirmationModal>
    </div>
  );
};

export default DashboardPage;