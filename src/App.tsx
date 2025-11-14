// src/App.tsx
import { Routes, Route } from 'react-router-dom';

// Import Layouts
import ProtectedRoute from './features/auth/ProtectedRoute';

// Import Pages
import HomePage from './pages/HomePage'; // <-- NEW
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
// We will create PublicLayout in the next step

function App() {
  return (
    <Routes>
      
      {/* 1. Public Route (Your new Homepage) */}
      <Route path="/" element={<HomePage />} />

      {/* 2. Auth Route (Login/Register) */}
      <Route path="/auth" element={<AuthPage />} />

      {/* 3. Protected App Route (The Dashboard) */}
      {/* All your app logic is now at /dashboard */}
      <Route path="/dashboard" element={<ProtectedRoute />}>
        <Route index element={<DashboardPage />} />
      </Route>

    </Routes>
  );
}

export default App;