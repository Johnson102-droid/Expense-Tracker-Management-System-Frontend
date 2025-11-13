// src/features/auth/ProtectedRoute.tsx
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

// We need to import the RootState type from our store
import type  { RootState } from '../../app/store';

const ProtectedRoute = () => {
  // Get the token from our auth state
  const { token } = useSelector((state: RootState) => state.auth);

  // Check if the token exists
  if (token) {
    // If yes, show the "child" route (e.g., the Dashboard)
    return <Outlet />;
  }

  // If no, redirect them to the /auth page
  return <Navigate to="/auth" replace />;
};

export default ProtectedRoute;