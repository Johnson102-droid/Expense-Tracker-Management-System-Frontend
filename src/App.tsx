// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // <--- NEW: Import Toaster

// Import Layouts
import ProtectedRoute from './features/auth/ProtectedRoute';

// Import Pages
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import VerifyEmail from './pages/VerifyEmail'; // <--- NEW: Import Verify Page

function App() {
  return (
    <>
      {/* 1. Add Toaster so your popups work everywhere */}
      <Toaster position="top-right" />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        
        {/* 👇 THIS WAS MISSING 👇 */}
        <Route path="/verify" element={<VerifyEmail />} />

        {/* Protected App Route (The Dashboard) */}
        <Route path="/dashboard" element={<ProtectedRoute />}>
          <Route index element={<DashboardPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;