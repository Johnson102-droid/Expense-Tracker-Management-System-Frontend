// src/App.tsx
import { Routes, Route } from 'react-router-dom';

// Import our pages
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';

// Import our new guard component
import ProtectedRoute from './features/auth/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* 1. Public Route: /auth */}
      {/* Anyone can see the AuthPage (Login/Register) */}
      <Route path="/auth" element={<AuthPage />} />

      {/* 2. Protected Route: / */}
      {/* This route is wrapped by our <ProtectedRoute /> */}
      <Route path="/" element={<ProtectedRoute />}>
        {/* The "child" route it protects is the DashboardPage */}
        {/* If logged in, <Outlet> becomes <DashboardPage /> */}
        {/* If not, <ProtectedRoute> redirects to /auth */}
        <Route index element={<DashboardPage />} />
      </Route>

    </Routes>
  );
}

export default App;