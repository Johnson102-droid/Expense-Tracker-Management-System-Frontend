// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
// We import the BASE apiSlice, not the specific ones
import { apiSlice } from '../features/auth/apiSlice'; 
import authReducer from '../features/auth/authSlice'; 

export const store = configureStore({
  reducer: {
    // This ONE apiSlice reducer handles auth, categories, and expenses
    [apiSlice.reducerPath]: apiSlice.reducer,
    // This is our separate state for holding the token
    auth: authReducer,
  },
  // The middleware already handles all API calls
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;