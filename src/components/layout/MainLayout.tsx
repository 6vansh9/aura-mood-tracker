import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun, LogOut, BookOpen, History } from 'lucide-react';
import { Link } from 'react-router-dom';

const MainLayout = () => {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <nav className="flex items-center space-x-6">
              <Link to="/dashboard" className="text-xl font-bold">
                Aura
              </Link>
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="text-sm font-medium hover:text-primary">
                  Dashboard
                </Link>
                <div className="flex items-center space-x-2">
                  <Link to="/journal" className="text-sm font-medium hover:text-primary flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    Journal
                  </Link>
                  <Link to="/journal/history" className="text-sm font-medium hover:text-primary flex items-center">
                    <History className="h-4 w-4 mr-1" />
                    History
                  </Link>
                </div>
                <Link to="/analytics" className="text-sm font-medium hover:text-primary">
                  Analytics
                </Link>
              </div>
            </nav>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-9 w-9"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{user?.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={signOut}
                  className="h-9 w-9"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout; 