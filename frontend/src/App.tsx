import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Onboarding from './pages/Onboarding';
import Overview from './pages/Overview';
import Regulations from './pages/Regulations';
import RegulationDetail from './pages/RegulationDetail';
import Alerts from './pages/Alerts';
import Compliance from './pages/Compliance';
import Calendar from './pages/Calendar';
import Assistant from './pages/Assistant';
import BusinessProfile from './pages/BusinessProfile';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import Help from './pages/Help';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span className="font-label-md text-label-md text-on-surface-variant">Restoring session…</span>
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (!user.onboarded && location.pathname !== '/onboarding') return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route
        path="/onboarding"
        element={
          <RequireAuth>
            <Onboarding />
          </RequireAuth>
        }
      />

      <Route
        path="/app"
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/app/overview" replace />} />
        <Route path="overview" element={<Overview />} />
        <Route path="regulations" element={<Regulations />} />
        <Route path="regulations/:id" element={<RegulationDetail />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="compliance" element={<Compliance />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="assistant" element={<Assistant />} />
        <Route path="business-profile" element={<BusinessProfile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="help" element={<Help />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
