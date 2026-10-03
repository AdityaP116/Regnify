import { Link, NavLink } from 'react-router-dom';
import { Icon } from './Icon';
import { Logo } from './Logo';
import { cn } from '../lib/format';
import { primaryNav, secondaryNav, type NavItem } from './navigation';

function Badge({ item }: { item: NavItem }) {
  if (!item.badge && item.badgeTone !== 'dot') return null;
  if (item.badgeTone === 'dot') return <span className="ml-auto w-1.5 h-1.5 rounded-full bg-secondary" />;
  const tones = {
    new: 'bg-secondary-container text-on-secondary-container',
    critical: 'bg-error text-on-error',
    score: 'bg-primary/10 text-primary',
  } as const;
  return (
    <span className={cn('ml-auto font-label-sm text-label-sm px-1.5 py-0.5 rounded', tones[item.badgeTone ?? 'new'])}>
      {item.badge}
    </span>
  );
}

function NavLinkItem({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg font-label-md text-label-md transition-colors',
          isActive
            ? 'bg-primary text-on-primary'
            : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface',
        )
      }
    >
      <Icon name={item.icon} size={20} />
      <span>{item.label}</span>
      <Badge item={item} />
    </NavLink>
  );
}

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="px-4 pt-5 pb-4 border-b border-[#E2E8E5]">
        <Link to="/app/overview" onClick={onNavigate} className="flex items-center justify-between">
          <Logo size={30} />
          <span className="font-label-sm text-label-sm text-outline uppercase">v1.0</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {primaryNav.map((item) => (
          <NavLinkItem key={item.to} item={item} onNavigate={onNavigate} />
        ))}
        <div className="my-4 border-t border-[#E2E8E5]" />
        {secondaryNav.map((item) => (
          <NavLinkItem key={item.to} item={item} onNavigate={onNavigate} />
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-[#E2E8E5] flex items-center justify-between text-outline">
        <span className="font-label-sm text-label-sm">Regnify v1.0.0</span>
        <span className="font-label-sm text-label-sm uppercase tracking-wider">Prototype</span>
      </div>
    </div>
  );
}
