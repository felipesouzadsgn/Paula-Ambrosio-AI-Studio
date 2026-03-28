import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { Sparkles, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Studio', path: '/editor' },
    { name: 'Projects', path: '/dashboard' },
    { name: 'Pricing', path: '/pricing' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/20">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Sparkles className="w-5 h-5 text-accent group-hover:rotate-12 transition-transform duration-500" />
          <span className="font-serif text-xl tracking-wide font-medium">PAULA AMBROSIO</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-2 mt-1 hidden sm:inline-block">AI Studio</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-sm uppercase tracking-widest transition-colors duration-300",
                location.pathname === link.path 
                  ? "text-primary font-medium" 
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              {link.name}
            </Link>
          ))}
          <div className="h-4 w-px bg-border mx-2"></div>
          <Link 
            to="/editor" 
            className="text-xs uppercase tracking-widest bg-primary text-primary-foreground px-6 py-3 rounded-full hover:bg-primary/90 transition-colors"
          >
            Start Creating
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-primary p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 glass-panel border-b border-white/20 p-6 flex flex-col gap-6 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                "text-sm uppercase tracking-widest transition-colors duration-300",
                location.pathname === link.path 
                  ? "text-primary font-medium" 
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link 
            to="/editor" 
            onClick={() => setIsOpen(false)}
            className="text-xs uppercase tracking-widest bg-primary text-primary-foreground px-6 py-4 text-center rounded-full hover:bg-primary/90 transition-colors mt-4"
          >
            Start Creating
          </Link>
        </div>
      )}
    </nav>
  );
}
