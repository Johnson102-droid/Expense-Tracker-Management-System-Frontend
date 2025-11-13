// src/features/auth/authApiSlice.ts
import { apiSlice } from './apiSlice'; // Our "base" api slice
import { setCredentials } from './authSlice'; // Our state-setting action

// Define the shape of our login response (based on your backend)
interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}

// Inject our endpoints into the original apiSlice
export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // Login endpoint
    login: builder.mutation<LoginResponse, any>({
      query: (credentials) => ({
        url: '/auth/login', // Your backend login route
        method: 'POST',
        body: credentials,
      }),
      // We'll use onQueryStarted to "intercept" the successful login
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          // Wait for the query to complete
          const { data } = await queryFulfilled;

          // Dispatch setCredentials to save token/user in our authSlice
          dispatch(setCredentials({ user: data.user, token: data.token }));
        } catch (err) {
          // Handle login errors
          console.error('Login failed:', err);
        }
      },
    }),

    // Register endpoint
    register: builder.mutation<any, any>({
      query: (userInfo) => ({
        url: '/auth/register', // Your backend register route
        method: 'POST',
        body: userInfo,
      }),
    }),

  }),
});

// Export the auto-generated hooks
// RTK Query automatically creates hooks based on our endpoints
export const {
  useLoginMutation,
  useRegisterMutation,
} = authApiSlice;