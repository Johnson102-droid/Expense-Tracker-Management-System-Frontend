// src/features/categories/categoryApiSlice.ts
import { apiSlice } from '../auth/apiSlice';

// Define the type for a Category
export interface Category {
  id: number;
  name: string;
  user_id: number | null;
  type: string; 
  color: string; 
}

// Define the type for creating a new category
interface CreateCategoryRequest {
  name: string;
  userId: number;
  type: string; // Used for calculation
  color: string; // Used for display
}

// Inject our endpoints into the original apiSlice
export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    // getCategories Query
    getCategories: builder.query<Category[], void>({
      query: () => '/categories',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Categories' as const, id })),
              { type: 'Categories', id: 'LIST' },
            ]
          : [{ type: 'Categories', id: 'LIST' }],
    }),

    // createCategory Mutation
    createCategory: builder.mutation<Category, CreateCategoryRequest>({
      query: (newCategory) => ({
        url: '/categories',
        method: 'POST',
        body: newCategory,
      }),
      invalidatesTags: [{ type: 'Categories', id: 'LIST' }],
    }),

    // NEW: deleteCategory Mutation
    deleteCategory: builder.mutation<void, number>({
        query: (id) => ({
            url: `/categories/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: [{ type: 'Categories', id: 'LIST' }],
    }),
  }),
});

// Export the auto-generated hooks
export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApiSlice;