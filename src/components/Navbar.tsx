import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Github, Menu, X, User, LogOut, KeyRound, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useProfiles } from "@/hooks/useProfiles";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { profile } = useProfiles();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Docs", href: "/docs" },
    { name: "Playground", href: "/playground" },
    { name: "Explore", href: "/explore" },
    { name: "About", href: "/about" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/20 border border-primary/50 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-primary rounded-full"></div>
              </div>
              <span className="text-xl font-bold text-foreground">OpenNetwork</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    isActive(item.href)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Auth & GitHub Buttons */}
          <div className="hidden md:flex items-center space-x-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-foreground hover:text-primary">
                  <User className="h-4 w-4 mr-2" />
                  {profile?.display_name || user.email}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background border border-border/50 shadow-lg z-50">
                <DropdownMenuItem disabled className="text-muted-foreground">
                  {profile?.display_name || user.email}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center w-full">
                     <User className="h-4 w-4 mr-2"/>
                        Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="flex items-center w-full">
                     <LayoutDashboard className="h-4 w-4 mr-2"/>
                        Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <button className="flex items-center w-full">
                    <KeyRound className="h-4 w-4 mr-2" />
                    API Token
                  </button>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="text-foreground hover:text-foreground hover:bg-muted">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}

            <a href="https://github.com/AnomitraSarkar/brain-flow-builder" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="border-border hover:bg-muted hover:text-foreground">
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </Button>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-card/50 backdrop-blur-lg rounded-lg mt-2 border border-border/50">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                    isActive(item.href)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 pt-2 space-y-2">
                {user ? (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground px-3 py-2">
                      {profile?.display_name || user.email}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
                      onClick={signOut}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full border-border/50">
                      <User className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                )}
                <a href="https://github.com/AnomitraSarkar/brain-flow-builder" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="w-full border-border/50">
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </Button>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
