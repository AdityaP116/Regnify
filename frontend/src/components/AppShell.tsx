import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { SidebarContent } from './Sidebar';

export function AppShell() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  // Close the mobile drawer on route change.
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Fixed desktop sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 border-r border-[#E2E8E5] bg-surface-container-lowest sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-[rgba(23,32,30,0.4)]" onClick={() => setDrawerOpen(false)} />
          <div className="relative w-64 bg-surface-container-lowest h-full shadow-modal">
            <SidebarContent onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <Header onOpenMenu={() => setDrawerOpen(true)} />
        <main className="flex-1 px-4 lg:px-8 py-6 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
