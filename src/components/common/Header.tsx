import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Code2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, profile, signOut } = useAuth();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
      <nav className="container mx-auto px-4 xl:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity group">
            <div className="relative">
              <Code2 className="h-7 w-7 text-primary group-hover:scale-110 transition-transform" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              TempWeb
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <button
              onClick={() => scrollToSection('store')}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Store Zone
            </button>
            <button
              onClick={() => scrollToSection('templates')}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Template Zone
            </button>
            <button
              onClick={() => scrollToSection('request')}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Request Zone
            </button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                {profile?.role === 'admin' && (
                  <Link to="/admin">
                    <Button variant="ghost" size="sm">
                      Admin
                    </Button>
                  </Link>
                )}
                <Button variant="outline" size="sm" onClick={signOut}>
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button size="sm">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
