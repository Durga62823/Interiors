import { Menu, Search, Sun, Moon, Bell } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { AdminBreadcrumb } from './AdminBreadcrumb';
import { Button } from '@/components/ui/button';
import Input from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';

interface AdminTopbarProps {
  onToggleSidebar: () => void;
}

export function AdminTopbar({ onToggleSidebar }: AdminTopbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const userInitials = user?.name ? user.name.substring(0, 2).toUpperCase() : 'AD';
  
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-card px-4 shadow-sm sm:px-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggleSidebar}
          className="text-muted-foreground hover:text-foreground"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        
        <div className="hidden sm:block">
          <AdminBreadcrumb />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search..." 
            className="w-full rounded-full bg-background pl-9 focus-visible:ring-[#d6b05e]"
          />
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme}
          className="text-muted-foreground hover:text-foreground rounded-full"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="sr-only">Toggle theme</span>
        </Button>

        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground rounded-full">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-[#d6b05e]"></span>
          <span className="sr-only">Notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full border border-border">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt="Admin" />
                <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name || 'Administrator'}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || 'admin@nsshomedesigns.in'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
