// src/features/auth/authSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// Define the shape of our user
interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

// Define the shape of our auth state
interface AuthState {
  user: User | null;
  token: string | null;
}

// --- THIS IS THE FIX ---
// Try to load the user from localStorage
const storedUser = localStorage.getItem('user');
let user: User | null = null;
if (storedUser) {
  try {
    user = JSON.parse(storedUser) as User;
  } catch (e) {
    console.error("Failed to parse user from localStorage", e);
    localStorage.removeItem('user'); // Clear corrupted user data
  }
}

// Define the initial state
const initialState: AuthState = {
  user: user, // <-- Load user from localStorage
  token: localStorage.getItem('token') || null,
};
// -----------------------

// Create the slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  // "Reducers" are functions that change the state
  reducers: {
    // This action will be called to set user/token on login
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      
      // --- THIS IS THE FIX ---
      // Save both token AND user to localStorage
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },

    // This action will be called on logout
    logOut: (state) => {
      state.user = null;
      state.token = null;
      
      // --- THIS IS THE FIX ---
      // Remove both from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

// Export the actions so we can use them in our components
export const { setCredentials, logOut } = authSlice.actions;

// Export the reducer
export default authSlice.reducer;