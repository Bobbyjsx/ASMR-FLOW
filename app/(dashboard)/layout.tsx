import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex font-sans">
      <Sidebar />
      <main className="flex-1 min-h-screen p-4 pt-24 md:p-6 md:pl-[288px] transition-all">
        {children}
      </main>
    </div>
  );
}
