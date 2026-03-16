'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Users, Film, Settings as SettingsIcon, Menu, LogOut, Video as VideoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useAuth } from '@/components/AuthProvider';

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
    <>
      {navLinks.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={handleNavClick}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
              link.isActive 
                ? 'bg-secondary text-secondary-foreground' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Icon size={20} />
            {link.label}
          </Link>
        );
      })}
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-4 left-4 right-4 h-16 bg-card/80 backdrop-blur-md border border-border rounded-2xl shadow-sm z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shadow-sm">
            <Sparkles size={18} />
          </div>
          <span className="font-semibold text-card-foreground">ASMR Flow</span>
        </div>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger render={
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Menu size={24} />
            </Button>
          } />
          <SheetContent side="left" className="w-64 p-0 flex flex-col bg-card border-border">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="p-6 border-b border-border flex items-center gap-3">
              <div className="bg-primary text-primary-foreground p-2 rounded-xl shadow-sm">
                <Sparkles size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight text-card-foreground">ASMR Flow</span>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              {renderNavLinks()}
            </nav>
            <div className="p-4 border-t border-border">
              <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" onClick={logout}>
                <LogOut size={20} />
                Sign Out
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed top-4 bottom-4 left-4 z-40 w-64 bg-card/95 backdrop-blur-md border border-border rounded-2xl flex-col shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <div className="bg-primary text-primary-foreground p-2 rounded-xl shadow-sm">
            <Sparkles size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-card-foreground">ASMR Flow</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {renderNavLinks()}
        </nav>
        
        <div className="p-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" onClick={logout}>
            <LogOut size={20} />
            Sign Out
          </Button>
        </div>
      </aside>
    </>
  );
}
