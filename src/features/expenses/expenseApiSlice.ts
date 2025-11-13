// src/features/expenses/expenseApiSlice.ts
import { apiSlice } from '../auth/apiSlice';

// Define the type for an Expense
export interface Expense {
  id: number;
  user_id: number;
  category_id: number;
  amount: number;
  expense_date: string; // Should be in 'YYYY-MM-DD' format
  note?: string;
}

export interface ExpenseResponse extends Expense {
  category_name?: string; 
}

// Define the type for creating a new expense
interface CreateExpenseRequest {
  category_id: number;
  amount: number;
  expense_date: string; // 'YYYY-MM-DD'
  note?: string;
  user_id: number; 
}

// Inject our endpoints into the original apiSlice
export const expenseApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    // getExpenses Query
    getExpenses: builder.query<ExpenseResponse[], void>({
      query: () => '/expenses', 
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Expenses' as const, id })),
              { type: 'Expenses', id: 'LIST' },
            ]
          : [{ type: 'Expenses', id: 'LIST' }],
    }),

    // createExpense Mutation
    createExpense: builder.mutation<Expense, CreateExpenseRequest>({
      query: (newExpense) => ({
        url: '/expenses',
        method: 'POST',
        body: newExpense,
      }),
      invalidatesTags: [{ type: 'Expenses', id: 'LIST' }],
    }),

    // deleteExpense Mutation
    deleteExpense: builder.mutation<void, number>({
        query: (id) => ({
            url: `/expenses/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: [{ type: 'Expenses', id: 'LIST' }],
    }),
    
  }),
});

// Export the auto-generated hooks
export const {
  useGetExpensesQuery,
  useCreateExpenseMutation,
  useDeleteExpenseMutation,
} = expenseApiSlice;