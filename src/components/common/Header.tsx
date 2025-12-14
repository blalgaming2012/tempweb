import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun, LogOut, LayoutDashboard, Users, ClipboardList, Settings } from 'lucide-react';

export default function Header() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const getNavigationItems = () => {
    if (!user) return [];

    const items = [];

    if (user.role === 'admin') {
      items.push(
        { path: '/', label: 'لوحة التحكم', icon: LayoutDashboard },
        { path: '/requests', label: 'طلبات الخدمة', icon: ClipboardList },
        { path: '/tasks', label: 'المهام', icon: ClipboardList },
        { path: '/admin', label: 'إدارة المستخدمين', icon: Users }
      );
    } else if (user.role === 'customer_service') {
      items.push(
        { path: '/', label: 'لوحة التحكم', icon: LayoutDashboard },
        { path: '/requests', label: 'طلبات الخدمة', icon: ClipboardList }
      );
    } else if (user.role === 'worker') {
      items.push(
        { path: '/', label: 'لوحة التحكم', icon: LayoutDashboard },
        { path: '/my-tasks', label: 'مهامي', icon: ClipboardList }
      );
    }

    return items;
  };

  const navigationItems = getNavigationItems();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-heading font-bold">نظام إدارة الخدمات</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className="gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {user && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg">
              <span className="text-sm font-medium">{user.fullName}</span>
              <span className="text-xs text-muted-foreground">
                ({user.role === 'admin' ? 'مدير' : user.role === 'customer_service' ? 'خدمة عملاء' : 'عامل'})
              </span>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={theme === 'light' ? 'الوضع الداكن' : 'الوضع الفاتح'}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </Button>

          {user && (
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              title="تسجيل الخروج"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

