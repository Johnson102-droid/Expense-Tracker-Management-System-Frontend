// src/features/auth/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/store';

// Define our base query function
const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8081',

  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Create the "empty" API slice
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQuery,
  
  // Define all the global tags used for caching/invalidation
  tagTypes: ['Categories', 'Expenses'], 

  endpoints: (builder) => ({
    // Endpoints are injected from other files
  }),
});