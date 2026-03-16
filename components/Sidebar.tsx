'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Users, Film, Settings as SettingsIcon, Menu, Video as VideoIcon } from 'lucide-react';
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
    <div className="space-y-1">
      {navLinks.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={handleNavClick}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
              link.isActive 
                ? 'bg-slate-100 text-slate-900' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Icon size={18} className={link.isActive ? 'text-slate-900' : 'text-slate-400'} />
            {link.label}
          </Link>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="bg-slate-900 text-white p-1.5 rounded-lg">
            <Sparkles size={16} />
          </div>
          <span className="font-bold text-slate-900">ASMR Flow</span>
        </div>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger render={
            <Button variant="ghost" size="icon" className="text-slate-500">
              <Menu size={24} />
            </Button>
          } />
          <SheetContent side="left" className="w-64 p-0 flex flex-col bg-white border-r border-slate-200">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <div className="bg-slate-900 text-white p-2 rounded-xl">
                <Sparkles size={20} />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">ASMR Flow</span>
            </div>
            <nav className="flex-1 p-4">
              {renderNavLinks()}
            </nav>
            <div className="p-4 border-t border-slate-100">
              <button type="button" onClick={logout} className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-slate-50 transition-colors text-left text-sm font-medium text-slate-500 hover:text-slate-900">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
                  {'U'}
                </div>
                Sign Out
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed top-4 bottom-4 left-4 z-40 w-64 bg-white border border-slate-200 rounded-[20px] shadow-sm flex-col overflow-hidden">
        <div className="p-6 flex items-center gap-3 pb-8">
          <div className="bg-slate-900 text-white p-2 rounded-xl shadow-sm">
            <Sparkles size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">ASMR Flow</span>
        </div>
        
        <nav className="flex-1 px-4 overflow-y-auto">
          {renderNavLinks()}
        </nav>
        
        <div className="p-4 border-t border-slate-100">
          <button type="button" onClick={logout} className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-slate-50 transition-colors text-left text-sm font-medium text-slate-600 hover:text-slate-900">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold shadow-sm">
              {'U'}
            </div>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
