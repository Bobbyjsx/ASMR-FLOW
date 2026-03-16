'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Users, Film, Settings as SettingsIcon, Menu, Video as VideoIcon, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useAuth } from '@/components/AuthProvider';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { href: '/', icon: Film, label: 'Projects', isActive: pathname === '/' || pathname === '/new-project' || pathname.startsWith('/projects/') },
    { href: '/asmrists', icon: Users, label: 'ASMRists', isActive: pathname === '/asmrists' },
    { href: '/videos', icon: VideoIcon, label: 'Video Manager', isActive: pathname === '/videos' },
    { href: '/settings', icon: SettingsIcon, label: 'Settings', isActive: pathname === '/settings' },
  ];

  const renderNavLinks = () => (
    <div className="space-y-1.5">
      {navLinks.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={handleNavClick}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300",
              link.isActive
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
            )}
          >
            <Icon size={18} className={cn("transition-colors", link.isActive ? "text-primary-foreground" : "text-muted-foreground/60 group-hover:text-primary")} />
            {link.label}
          </Link>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-border z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shadow-sm">
            <Sparkles size={16} />
          </div>
          <span className="font-serif font-bold text-foreground">ASMR Flow</span>
        </div>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 flex flex-col bg-background border-r border-border">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="p-8 flex items-center gap-3">
              <div className="bg-primary text-primary-foreground p-2 rounded-xl shadow-lg shadow-primary/20">
                <Sparkles size={20} />
              </div>
              <span className="text-xl font-serif font-bold tracking-tight text-foreground">ASMR Flow</span>
            </div>
            <nav className="flex-1 px-4">
              {renderNavLinks()}
            </nav>
            <div className="p-6 border-t border-border/50">
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-3 w-full p-3 rounded-2xl hover:bg-destructive/5 transition-all text-left text-sm font-semibold text-muted-foreground hover:text-destructive group"
              >
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold group-hover:bg-destructive/10 group-hover:text-destructive transition-colors">
                  <LogOut size={16} />
                </div>
                Sign Out
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed top-6 bottom-6 left-6 z-40 w-64 bg-background border border-border rounded-[2.5rem] shadow-xl shadow-primary/5 flex-col overflow-hidden">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-primary text-primary-foreground p-2.5 rounded-[1rem] shadow-lg shadow-primary/20">
            <Sparkles size={20} />
          </div>
          <span className="text-xl font-serif font-bold tracking-tight text-foreground">ASMR Flow</span>
        </div>

        <nav className="flex-1 px-4 overflow-y-auto">
          {renderNavLinks()}
        </nav>

        <div className="p-6 border-t border-border/50">
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-3 w-full p-3 rounded-2xl hover:bg-destructive/5 transition-all text-left text-sm font-semibold text-muted-foreground hover:text-destructive group"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold group-hover:bg-destructive/10 group-hover:text-destructive transition-colors shadow-sm">
              <LogOut size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-foreground group-hover:text-destructive transition-colors">Sign Out</span>
              <span className="text-[10px] text-muted-foreground font-normal">End session</span>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}
