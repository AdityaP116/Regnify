import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';

export function Header({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { user, signOutUser } = useAuth();
  const { notifications, alerts } = useAppData();
  const navigate = useNavigate();
  const unread = notifications.filter((n) => !n.read).length + (alerts.length ? 1 : 0);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur border-b border-[#E2E8E5]">
      <div className="flex items-center gap-3 px-4 lg:px-6 py-3">
        <button
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-surface-container-low"
          onClick={onOpenMenu}
          aria-label="Open navigation"
        >
          <Icon name="menu" />
        </button>

        <div className="hidden md:flex items-center flex-1 max-w-xl">
          <div className="relative w-full">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={20} />
            <input
              className="w-full bg-surface-container-low border border-[#E2E8E5] rounded-lg pl-10 pr-12 py-2.5 font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-accent-teal focus:ring-2 focus:ring-accent-teal/15"
              placeholder="Search regulations, circulars, tasks, authorities…"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 font-label-sm text-label-sm text-outline border border-[#E2E8E5] rounded px-1.5 py-0.5">
              ⌘K
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container-low border border-[#E2E8E5] font-label-md text-label-md text-on-surface hover:border-primary transition-colors">
            <Icon name="factory" size={18} className="text-primary" />
            Maharashtra • Factory Reg
            <Icon name="expand_more" size={18} className="text-outline" />
          </button>

          <button
            className="relative flex items-center justify-center w-10 h-10 rounded-lg hover:bg-surface-container-low"
            onClick={() => navigate('/app/notifications')}
            aria-label="Notifications"
          >
            <Icon name="notifications" />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-error text-on-error font-label-sm text-label-sm flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>

          <div className="relative">
            <button
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-surface-container-low"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold">
                {user?.initials ?? 'EV'}
              </span>
              <span className="hidden sm:flex flex-col items-start leading-tight">
                <span className="font-label-md text-label-md text-on-surface">{user?.name ?? 'Elena Vance'}</span>
                <span className="font-label-sm text-label-sm text-outline">{user?.role ?? 'Compliance Lead'}</span>
              </span>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest border border-[#E2E8E5] rounded-xl shadow-dossier py-1.5 z-40">
                <div className="px-4 py-2 border-b border-[#E2E8E5]">
                  <p className="font-label-md text-label-md text-on-surface">{user?.name}</p>
                  <p className="font-body-sm text-body-sm text-outline truncate">{user?.email}</p>
                </div>
                <Link to="/app/business-profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 font-body-sm text-body-sm hover:bg-surface-container-low">
                  <Icon name="business_center" size={18} /> Business profile
                </Link>
                <Link to="/app/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 font-body-sm text-body-sm hover:bg-surface-container-low">
                  <Icon name="settings" size={18} /> Settings
                </Link>
                <button
                  onClick={() => { setMenuOpen(false); void signOutUser(); }}
                  className="w-full flex items-center gap-2 px-4 py-2 font-body-sm text-body-sm text-error hover:bg-error-container/40"
                >
                  <Icon name="logout" size={18} /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
