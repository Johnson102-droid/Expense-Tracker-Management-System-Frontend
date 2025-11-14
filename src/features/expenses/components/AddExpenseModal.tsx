// src/features/expenses/components/AddExpenseModal.tsx
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form'; 
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Import our hooks
import { useCreateExpenseMutation } from '../expenseApiSlice';
import { useGetCategoriesQuery } from '../../categories/categoryApiSlice';
import type { RootState } from '../../../app/store';
import { useSelector } from 'react-redux';

// Props for the component
interface AddExpenseModalProps {
  onClose: () => void; // Function to close the modal
}

// --- Form Validation Schema ---
const expenseSchema = yup.object({ // <-- Use yup.object()
  amount: yup
    .number()
    .typeError('Amount must be a number')
    .positive('Amount must be positive')
    .required('Amount is required'),
  category_id: yup
    .number()
    .typeError('Please select a category')
    .required('Category is required'),
  expense_date: yup.string().required('Date is required'), 
  // FIX 1: Make 'note' a required string, but give it a default empty value
  note: yup.string().default(''), 
});

// FIX 2: Infer the type directly from the schema. 
// 'note' will now be 'string' (not optional), which fixes the error.
type FormInputs = yup.InferType<typeof expenseSchema>;

const AddExpenseModal = ({ onClose }: AddExpenseModalProps) => {
  // Get hooks for API calls
  const { data: categories = [], isLoading: isLoadingCategories } = useGetCategoriesQuery();
  const [createExpense, { isLoading: isCreatingExpense }] = useCreateExpenseMutation();
  const user = useSelector((state: RootState) => state.auth.user);

  // Set up React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: yupResolver(expenseSchema), // This will now work
    
    defaultValues: {
      expense_date: new Date().toISOString().split('T')[0],
      // 'note' default is now handled by yup
    },
  });

  // Handle the form submission
  const onSubmit: SubmitHandler<FormInputs> = async (data) => { // This will also work
    if (!user || isCreatingExpense) return;

    try {
      // Send the data, 'note' is now guaranteed to be a string
      await createExpense({
        ...data,
        user_id: user.id, 
        category_id: Number(data.category_id), 
        expense_date: data.expense_date, 
        note: data.note, // 'note' is now a string (even if empty)
      }).unwrap();
      
      onClose(); // Close the modal on success
    } catch (err) {
      console.error('Failed to create expense:', err);
    }
  };

  return (
    // Modal Overlay
    <div
      className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      {/* Modal Content */}
      <div
        className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()} 
      >
        <h2 className="text-2xl font-bold">Add New Transaction</h2>
        <p className="mt-2 text-gray-600">
          Enter the details for your new expense.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              {...register('amount')}
              step="0.01"
              placeholder="0.00"
              className={`mt-1 block w-full rounded-md ${errors.amount ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500`}
            />
            {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount.message}</p>}
          </div>

          {/* Category Dropdown */}
          <div>
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category_id"
              {...register('category_id')}
              className={`mt-1 block w-full rounded-md ${errors.category_id ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500`}
              disabled={isLoadingCategories}
            >
              <option value="">
                {isLoadingCategories ? 'Loading...' : 'Select a category'}
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.type})
                </option>
              ))}
            </select>
            {errors.category_id && <p className="mt-1 text-xs text-red-500">{errors.category_id.message}</p>}
          </div>

          {/* Date Picker */}
          <div>
            <label htmlFor="expense_date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              id="expense_date"
              {...register('expense_date')}
              className={`mt-1 block w-full rounded-md ${errors.expense_date ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500`}
            />
            {errors.expense_date && <p className="mt-1 text-xs text-red-500">{errors.expense_date.message}</p>}
          </div>
          
          {/* Note */}
          <div>
            <label htmlFor="note" className="block text-sm font-medium text-gray-700">
              Note (Optional)
            </label>
            <input
              type="text"
              id="note"
              {...register('note')}
              placeholder="e.g., Lunch with client"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {/* We don't need to show an error for 'note' since it's optional */}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreatingExpense}
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 disabled:bg-green-400"
            >
              {isCreatingExpense ? 'Adding...' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;