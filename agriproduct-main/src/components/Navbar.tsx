import { Link, useLocation } from "react-router-dom";
import { useFarmer } from "@/contexts/FarmerContext";
import { Sprout, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { isLoggedIn } = useFarmer();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <Link to="/" className="flex items-center gap-2">
          <Sprout className="h-7 w-7 text-primary" />
          <span className="font-heading text-xl font-bold text-foreground">Agri Product</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`text-sm font-medium transition-colors ${isActive(l.to) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
              {l.label}
            </Link>
          ))}
          {isLoggedIn ? (
            <Link to="/dashboard">
              <Button size="sm">Dashboard</Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button size="sm">Farmer Login</Button>
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t bg-card px-4 pb-4 animate-fade-in">
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className={`block py-2 text-sm font-medium ${isActive(l.to) ? 'text-primary' : 'text-muted-foreground'}`}>
              {l.label}
            </Link>
          ))}
          <Link to={isLoggedIn ? "/dashboard" : "/login"} onClick={() => setOpen(false)}>
            <Button size="sm" className="mt-2 w-full">{isLoggedIn ? "Dashboard" : "Farmer Login"}</Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
