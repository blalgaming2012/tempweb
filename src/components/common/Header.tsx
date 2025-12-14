import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun, LogOut, LayoutDashboard, Users, ClipboardList, Zap, LogIn } from 'lucide-react';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getNavigationItems = () => {
    if (!user) return [];

    const items = [];

    if (user.role === 'admin') {
      items.push(
        { path: '/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
        { path: '/requests', label: 'طلبات الخدمة', icon: ClipboardList },
        { path: '/tasks', label: 'المهام', icon: ClipboardList },
        { path: '/admin', label: 'إدارة المستخدمين', icon: Users }
      );
    } else if (user.role === 'customer_service') {
      items.push(
        { path: '/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
        { path: '/requests', label: 'طلبات الخدمة', icon: ClipboardList }
      );
    } else if (user.role === 'worker') {
      items.push(
        { path: '/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
        { path: '/my-tasks', label: 'مهامي', icon: ClipboardList }
      );
    }

    return items;
  };

  const navigationItems = getNavigationItems();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 animate-fade-in-down">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 hover-scale">
            <img 
              src="/tempweb-logo.png" 
              alt="Tempweb Logo" 
              className="h-10 w-auto border-0"
            />
          </Link>

          {user && (
            <nav className="hidden md:flex items-center gap-1">
              {navigationItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      className={`gap-2 animate-fade-in-up stagger-${index + 1} hover-lift`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg animate-slide-in-left hover-glow">
                <span className="text-sm font-medium">{user.fullName}</span>
                <span className="text-xs text-muted-foreground">
                  ({user.role === 'admin' ? 'مدير' : user.role === 'customer_service' ? 'خدمة عملاء' : 'عامل'})
                </span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title="تسجيل الخروج"
                className="hover-scale"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button className="gap-2 hover-lift">
                <LogIn className="w-4 h-4" />
                تسجيل الدخول
              </Button>
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={theme === 'light' ? 'الوضع الداكن' : 'الوضع الفاتح'}
            className="hover-scale"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 animate-bounce-subtle" />
            ) : (
              <Sun className="w-5 h-5 animate-bounce-subtle" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}

