// src/pages/AnalyticsPage.tsx
import { useGetExpensesQuery } from '../features/expenses/expenseApiSlice';
import { useGetCategoriesQuery } from '../features/categories/categoryApiSlice'; // Import categories
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
  const { data: expenses = [] } = useGetExpensesQuery();
  const { data: categories = [] } = useGetCategoriesQuery(); // Fetch categories

  // --- 1. Get Currency Setting ---
  const currency = localStorage.getItem('currency') || 'KES';
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  // --- 2. Chart Logic ---
  const getTrendData = () => {
     const data = [];
     const today = new Date();
     for(let i=6; i>=0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().slice(0, 10);
        
        // Calculate daily spending (Only expenses, ignore income for the trend line)
        const dailyTotal = expenses
            .filter((e: any) => {
                const eDate = (e.date || e.expense_date).substring(0, 10);
                const cat = categories.find((c: any) => c.id === e.category_id);
                // Only count EXPENSES for the spending trend
                return eDate === dateStr && cat?.type === 'Expense';
            })
            .reduce((sum, e) => sum + Number(e.amount), 0);
            
        data.push({ date: d.toLocaleDateString('en-US', {weekday: 'short'}), amount: dailyTotal });
     }
     return data;
  };

  const trendData = getTrendData();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
       <h2 className="text-2xl font-bold text-gray-800 mb-2">Analytics Insights 📊</h2>
       <p className="text-gray-500 mb-8">Visualize your financial habits.</p>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* CHART SECTION */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h3 className="font-bold text-gray-700 mb-6">Spending Trend (Last 7 Days)</h3>
             <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                      <Tooltip 
                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} 
                        formatter={(value: number) => formatCurrency(value)}
                      />
                      <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981'}} activeDot={{r: 6}} />
                   </LineChart>
                </ResponsiveContainer>
             </div>
          </div>
          
          {/* HIGHEST TRANSACTIONS SECTION */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h3 className="font-bold text-gray-700 mb-4">Highest Transactions</h3>
             <div className="space-y-3">
                {[...expenses]
                    .sort((a: any, b: any) => Number(b.amount) - Number(a.amount)) // Sort by size
                    .slice(0, 5) // Top 5
                    .map((exp: any) => {
                        // Find Category to check if Income or Expense
                        const cat = categories.find((c: any) => c.id === exp.category_id);
                        const isIncome = cat?.type === 'Income';

                        return (
                            <div key={exp.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm ${isIncome ? 'bg-green-500' : 'bg-red-500'}`}>
                                        {isIncome ? '↓' : '↑'}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-700">{exp.note || 'No Description'}</p>
                                        <p className="text-xs text-gray-400">{cat?.name || 'Uncategorized'}</p>
                                    </div>
                                </div>
                                <span className={`font-bold ${isIncome ? 'text-green-600' : 'text-red-500'}`}>
                                    {isIncome ? '+' : '-'}{formatCurrency(Number(exp.amount))}
                                </span>
                            </div>
                        );
                    })
                }
             </div>
          </div>
       </div>
    </div>
  );
}