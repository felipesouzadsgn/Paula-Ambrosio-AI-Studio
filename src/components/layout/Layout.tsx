import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-primary bg-background selection:bg-accent/20">
      <Navbar />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <footer className="border-t border-border py-12 text-center text-sm text-muted-foreground">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-serif italic text-lg">Paula Ambrosio AI</p>
          <p className="uppercase tracking-widest text-[10px]">Â© {new Date().getFullYear()} Paula Ambrosio Design. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
