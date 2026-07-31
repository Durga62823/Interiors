import { useState, useEffect } from 'react';
import { Outlet } from '@tanstack/react-router';
import { ThemeProvider } from './ThemeProvider';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';
import { useMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export function AdminLayout() {
  const isMobile = useMobile();
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin_sidebar_collapsed');
      return saved === 'true';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('admin_sidebar_collapsed', String(collapsed));
  }, [collapsed]);

  // On mobile, default to collapsed/hidden
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background font-sans text-foreground overflow-hidden">
        <AdminSidebar 
          collapsed={collapsed} 
          onToggle={toggleSidebar} 
          isMobile={isMobile}
        />
        
        <div 
          className={cn(
            'flex flex-col min-h-screen transition-all duration-300 ease-in-out',
            isMobile ? 'ml-0' : (collapsed ? 'ml-16' : 'ml-64')
          )}
        >
          <AdminTopbar onToggleSidebar={toggleSidebar} />
          
          <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-background/50">
            <Outlet />
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
