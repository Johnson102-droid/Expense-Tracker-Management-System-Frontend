// src/features/categories/categoryApiSlice.ts
import { apiSlice } from '../auth/apiSlice';

export interface Category {
  id: number;
  name: string;
  user_id: number | null;
  type: string; 
  color: string; 
}

interface CreateCategoryRequest {
  name: string;
  userId: number;
  type: string; 
  color: string; 
}

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
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

    createCategory: builder.mutation<Category, CreateCategoryRequest>({
      query: (newCategory) => ({
        url: '/categories',
        method: 'POST',
        body: newCategory,
      }),
      invalidatesTags: [{ type: 'Categories', id: 'LIST' }],
    }),

    deleteCategory: builder.mutation<void, number>({
        query: (id) => ({
            url: `/categories/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: [{ type: 'Categories', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApiSlice;