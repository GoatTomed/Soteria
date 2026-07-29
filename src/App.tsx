import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { DashboardPage } from '@/pages/DashboardPage';
import { UnobfuscatedPage } from '@/pages/UnobfuscatedPage';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { ResetPasswordPage } from '@/pages/ResetPasswordPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { GatePage } from '@/pages/GatePage';
import { StackedPage } from '@/pages/StackedPage';

const ALLOWED_DEV_ACCESS_USERNAMES = new Set(['president', 'yousuck']);

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-[hsl(0,0%,5%)]" />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function DevAccessRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!user?.email) {
      setAllowed(false);
      return;
    }

    const email = user.email.toLowerCase();
    const username = email.split('@')[0];
    const domain = email.split('@')[1] || '';
    setAllowed(domain === 'soteria.dev' || ALLOWED_DEV_ACCESS_USERNAMES.has(username));
  }, [user]);

  if (loading) return <div className="min-h-screen bg-[hsl(0,0%,5%)]" />;
  if (!user) return <Navigate to="/login" replace />;
  if (!allowed) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-[hsl(0,0%,5%)]" />;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/utilities" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/oracle" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/oracle/:subtab" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/genesis" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/unobfuscated" element={<DevAccessRoute><UnobfuscatedPage /></DevAccessRoute>} />
      <Route path="/stacked" element={<DevAccessRoute><StackedPage /></DevAccessRoute>} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
      <Route path="/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
      <Route path="/gate/:owner" element={<GatePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
