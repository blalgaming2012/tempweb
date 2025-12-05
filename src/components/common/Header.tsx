import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
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
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
            <img 
              src="https://miaoda-conversation-file.s3cdn.medo.dev/user-814954cpocu8/conv-8149atjyv37k/20251206/file-814uzq0bnn5s.png" 
              alt="TempWeb Logo" 
              className="h-10 w-auto group-hover:scale-105 transition-transform"
            />
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
