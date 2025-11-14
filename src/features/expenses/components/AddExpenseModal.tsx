// src/features/expenses/components/AddExpenseModal.tsx
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form'; // <-- FIX: Import as type
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
const expenseSchema = yup.object().shape({
  amount: yup
    .number()
    .typeError('Amount must be a number')
    .positive('Amount must be positive')
    .required('Amount is required'),
  category_id: yup
    .number()
    .typeError('Please select a category')
    .required('Category is required'),
  // FIX: Change date validation from .date() to .string()
  expense_date: yup.string().required('Date is required'), 
  note: yup.string().optional(),
});

// FIX: Manually define FormInputs to fix the type conflict
type FormInputs = {
    amount: number;
    category_id: number;
    expense_date: string;
    note?: string;
};

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
    resolver: yupResolver(expenseSchema),
    // Set default date to today's string
    defaultValues: {
      expense_date: new Date().toISOString().split('T')[0],
      note: '',
    },
  });

  // Handle the form submission
  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (!user || isCreatingExpense) return;

    try {
      // Send the data, it now matches the types perfectly
      await createExpense({
        ...data,
        user_id: user.id, // Add the user_id
        category_id: Number(data.category_id), // Ensure it's a number
        expense_date: data.expense_date, // Send the date string
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
        onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
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
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:bg-blue-400"
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