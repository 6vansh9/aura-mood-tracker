import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { JournalProvider } from '@/contexts/JournalContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/ui/toaster';
import MainLayout from '@/components/layout/MainLayout';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Dashboard from '@/pages/Dashboard';
import Journal from '@/pages/Journal';
import JournalHistory from '@/pages/JournalHistory';
import Analytics from '@/pages/Analytics';
import Settings from '@/pages/Settings';
import { useAuth } from '@/contexts/AuthContext';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <SettingsProvider>
            <JournalProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <MainLayout />
                    </PrivateRoute>
                  }
                >
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="journal" element={<Journal />} />
                  <Route path="journal/history" element={<JournalHistory />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Routes>
              <Toaster />
            </JournalProvider>
          </SettingsProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
