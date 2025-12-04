// src/features/auth/authApiSlice.ts
import { apiSlice } from './apiSlice'; 
import { setCredentials } from './authSlice'; 

interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    // Login endpoint
    login: builder.mutation<LoginResponse, any>({
      query: (credentials) => ({
        url: '/auth/login', 
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data.user, token: data.token }));
        } catch (err) {
          console.error('Login failed:', err);
        }
      },
    }),

    // Register endpoint
    register: builder.mutation<any, any>({
      query: (userInfo) => ({
        url: '/auth/register', 
        method: 'POST',
        body: userInfo,
      }),
    }),

    // 👇 ADD THIS NEW VERIFY ENDPOINT 👇
    verify: builder.mutation<any, any>({
      query: (data) => ({
        url: '/auth/verify', 
        method: 'POST',
        body: data,
      }),
    }),
    // 👆 END ADDITION 👆

  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyMutation, // <--- EXPORT THIS HOOK
} = authApiSlice;