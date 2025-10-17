import { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}

export default function MainLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white font-bold">
              AI
            </span>
            <span className="font-semibold text-lg">Devgent AI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/practice"
              className={({ isActive }) =>
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }
            >
              Practice
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/results"
              className={({ isActive }) =>
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }
            >
              Results
            </NavLink>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
                    Get Started
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/interview">
                  <Button variant="secondary">Start Interview</Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t">
        <div className="container py-10 grid gap-6 md:grid-cols-3 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white font-bold">
                IA
              </span>
              <span className="font-semibold">Devgent AI</span>
            </div>
            <p className="text-muted-foreground">
              AI-powered interview practice with real-time body language,
              speech, and emotion analysis.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Product</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-foreground">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/practice" className="hover:text-foreground">
                  Practice
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-foreground">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/results" className="hover:text-foreground">
                  Results
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Company</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>
                <a href="#" aria-disabled>
                  Careers
                </a>
              </li>
              <li>
                <a href="#" aria-disabled>
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" aria-disabled>
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Devgent AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
