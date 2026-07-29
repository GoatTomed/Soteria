import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/lib/auth';
import { DashboardPage } from '@/pages/DashboardPage';
import { UnobfuscatedPage } from '@/pages/UnobfuscatedPage';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { ResetPasswordPage } from '@/pages/ResetPasswordPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { GatePage } from '@/pages/GatePage';
import { StackedPage } from '@/pages/StackedPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-[hsl(0,0%,5%)]" />;
  if (!user) return <Navigate to="/login" replace />;
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
      <Route path="/unobfuscated" element={<ProtectedRoute><UnobfuscatedPage /></ProtectedRoute>} />
      <Route path="/stacked" element={<ProtectedRoute><StackedPage /></ProtectedRoute>} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
      <Route path="/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
      <Route path="/gate/:owner/:scriptId" element={<GatePage />} />
      <Route path="/gate/:scriptId" element={<GatePage />} />
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
