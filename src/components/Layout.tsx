
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { PenLine, BarChart3, CalendarDays, BookText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const Layout = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-sidebar border-r border-sidebar-border">
        <div className="p-6">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary/20 p-2 rounded-md">
              <BookText className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-sidebar-foreground">Aura Journal</span>
          </Link>
        </div>
        
        <Separator className="bg-sidebar-border" />
        
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/">
            <Button 
              variant={isActive('/') ? "secondary" : "ghost"} 
              className={cn("w-full justify-start", 
                isActive('/') ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/50")}
            >
              <PenLine className="mr-2 h-4 w-4" />
              Journal
            </Button>
          </Link>
          
          <Link to="/calendar">
            <Button 
              variant={isActive('/calendar') ? "secondary" : "ghost"} 
              className={cn("w-full justify-start", 
                isActive('/calendar') ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/50")}
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              Calendar
            </Button>
          </Link>
          
          <Link to="/analytics">
            <Button 
              variant={isActive('/analytics') ? "secondary" : "ghost"} 
              className={cn("w-full justify-start", 
                isActive('/analytics') ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/50")}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </Button>
          </Link>
        </nav>
        
        <div className="p-4 mt-auto">
          <div className="bg-sidebar-accent/30 p-4 rounded-lg">
            <p className="text-sm text-sidebar-foreground/80">Track your mood and thoughts daily for better insights.</p>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-background border-t z-50">
        <div className="flex justify-around p-2">
          <Link to="/" className="flex flex-col items-center p-2">
            <PenLine className={cn("h-5 w-5", isActive('/') ? "text-primary" : "text-muted-foreground")} />
            <span className={cn("text-xs", isActive('/') ? "text-primary font-medium" : "text-muted-foreground")}>Journal</span>
          </Link>
          
          <Link to="/calendar" className="flex flex-col items-center p-2">
            <CalendarDays className={cn("h-5 w-5", isActive('/calendar') ? "text-primary" : "text-muted-foreground")} />
            <span className={cn("text-xs", isActive('/calendar') ? "text-primary font-medium" : "text-muted-foreground")}>Calendar</span>
          </Link>
          
          <Link to="/analytics" className="flex flex-col items-center p-2">
            <BarChart3 className={cn("h-5 w-5", isActive('/analytics') ? "text-primary" : "text-muted-foreground")} />
            <span className={cn("text-xs", isActive('/analytics') ? "text-primary font-medium" : "text-muted-foreground")}>Analytics</span>
          </Link>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
