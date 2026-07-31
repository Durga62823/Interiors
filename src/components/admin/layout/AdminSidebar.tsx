import { Link, useLocation } from '@tanstack/react-router';
import { LayoutDashboard, Wrench, Image as ImageIcon, MessageSquare, Users, Settings, LogOut, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  isMobile: boolean;
}

export function AdminSidebar({ collapsed, onToggle, isMobile }: AdminSidebarProps) {
  const { logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, route: '/admin' },
    { name: 'Services', icon: Wrench, route: '/admin/services' },
    { name: 'Portfolio', icon: ImageIcon, route: '/admin/portfolio' },
    { name: 'Testimonials', icon: MessageSquare, route: '/admin/testimonials' },
    { name: 'Consultations', icon: Calendar, route: '/admin/consultations' },
    { name: 'Leads', icon: Users, route: '/admin/leads' },
    { name: 'Settings', icon: Settings, route: '/admin/settings' },
  ];

  const sidebarClass = cn(
    'fixed inset-y-0 left-0 z-50 flex flex-col bg-[#1f2022] text-[#f2ece4] transition-all duration-300 ease-in-out border-r border-[#2d2e30]',
    collapsed ? 'w-16' : 'w-64',
    isMobile ? (collapsed ? '-translate-x-full' : 'translate-x-0') : 'translate-x-0'
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobile && !collapsed && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity" 
          onClick={onToggle}
        />
      )}
      
      <aside className={sidebarClass}>
        <div className="flex h-16 items-center justify-center border-b border-[#2d2e30] px-4">
          <Link to="/admin" className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <span className="text-2xl font-bold font-playfair text-[#d6b05e]">
              {collapsed ? 'N' : 'NSS'}
            </span>
            {!collapsed && (
              <span className="rounded-md bg-[#d6b05e]/20 px-2 py-0.5 text-xs font-semibold text-[#d6b05e]">
                Admin
              </span>
            )}
          </Link>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.route || 
                             (item.route !== '/admin' && location.pathname.startsWith(item.route));
            
            return (
              <Link
                key={item.name}
                to={item.route}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 group',
                  isActive 
                    ? 'bg-[#d6b05e]/10 text-[#d6b05e]' 
                    : 'text-[#f2ece4]/70 hover:bg-[#f2ece4]/10 hover:text-[#f2ece4]',
                  isActive && !collapsed && 'border-l-2 border-[#d6b05e]'
                )}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className={cn('h-5 w-5 shrink-0', isActive ? 'text-[#d6b05e]' : 'text-inherit')} />
                {!collapsed && <span className="font-medium text-sm">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[#2d2e30] p-3">
          <button
            onClick={() => logout()}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[#f2ece4]/70 hover:bg-destructive/20 hover:text-destructive transition-colors group',
              collapsed && 'justify-center'
            )}
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
