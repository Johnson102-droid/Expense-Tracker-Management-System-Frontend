import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useGetCategoriesQuery } from '../features/categories/categoryApiSlice';

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<any[]>([]);
  const { data: categories = [] } = useGetCategoriesQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCatId, setSelectedCatId] = useState('');
  const [amount, setAmount] = useState('');

  const fetchBudgets = async () => {
    try {
      const res = await api.get('/budgets');
      setBudgets(res.data);
    } catch (err) { console.error("Error fetching budgets", err); }
  };

  useEffect(() => { fetchBudgets(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/budgets', { category_id: Number(selectedCatId), amount: Number(amount) });
    setIsModalOpen(false);
    setAmount('');
    fetchBudgets();
  };

  const handleDelete = async (id: number) => {
    if(confirm('Delete this budget?')) {
        await api.delete(`/budgets/${id}`);
        fetchBudgets();
    }
  };

  const getProgressColor = (percent: number) => {
    if (percent >= 100) return 'bg-red-500';
    if (percent >= 80) return 'bg-orange-500';
    return 'bg-green-500';
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
         <div>
            <h2 className="text-2xl font-bold text-gray-800">Monthly Budgets </h2>
            <p className="text-gray-500">Set limits for your spending categories.</p>
         </div>
         <button onClick={() => setIsModalOpen(true)} className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold hover:bg-black transition shadow-lg">+ Set Budget</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {budgets.length === 0 && <p className="text-gray-400">No budgets set yet.</p>}
         {budgets.map((b) => {
            const percent = Math.min((b.spent_amount / b.limit_amount) * 100, 100);
            const remaining = b.limit_amount - b.spent_amount;
            return (
               <div key={b.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative group">
                  <button onClick={() => handleDelete(b.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                  <div className="flex items-center gap-3 mb-4">
                     <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: b.category_color || '#ccc' }}>
                        {b.category_name[0]}
                     </div>
                     <h3 className="font-bold text-gray-800">{b.category_name}</h3>
                  </div>
                  <div className="flex justify-between text-sm font-medium mb-2">
                     <span className={remaining < 0 ? 'text-red-500' : 'text-gray-600'}>${b.spent_amount.toFixed(0)} spent</span>
                     <span className="text-gray-400">of ${b.limit_amount}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 mb-2 overflow-hidden">
                     <div className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(percent)}`} style={{ width: `${percent}%` }}></div>
                  </div>
                  <p className={`text-sm font-bold ${remaining < 0 ? 'text-red-500' : 'text-green-600'}`}>
                     {remaining < 0 ? `Over by $${Math.abs(remaining).toFixed(2)}` : `$${remaining.toFixed(2)} left`}
                  </p>
               </div>
            )
         })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
           <form onSubmit={handleSave} className="bg-white p-8 rounded-2xl w-96 shadow-2xl">
              <h2 className="text-xl font-bold mb-6">Set Budget Limit</h2>
              <div className="space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                    <select required className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none" onChange={e => setSelectedCatId(e.target.value)}>
                       <option value="">Select Category...</option>
                       {categories.filter(c => c.type === 'Expense').map(c => (
                         <option key={c.id} value={c.id}>{c.name}</option>
                       ))}
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Limit ($)</label>
                    <input required type="number" placeholder="300" className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none" onChange={e => setAmount(e.target.value)} />
                 </div>
              </div>
              <div className="flex gap-3 mt-8">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition">Cancel</button>
                 <button type="submit" className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 transition">Save</button>
              </div>
           </form>
        </div>
      )}
    </div>
  );
}