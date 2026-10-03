// Shared navigation model for the application shell. Mirrors the sidebar shown
// in design-reference/regnify_overview_dashboard/code.html: primary intelligence
// destinations, then the secondary account/support cluster.

export interface NavItem {
  to: string;
  label: string;
  icon: string;
  badge?: string;
  badgeTone?: 'new' | 'critical' | 'score' | 'dot';
}

export const primaryNav: NavItem[] = [
  { to: '/app/overview', label: 'Overview', icon: 'dashboard' },
  { to: '/app/regulations', label: 'Regulations', icon: 'gavel', badge: '12 New', badgeTone: 'new' },
  { to: '/app/alerts', label: 'Alerts', icon: 'notifications', badge: '4', badgeTone: 'critical' },
  { to: '/app/compliance', label: 'Compliance', icon: 'task_alt', badge: '78%', badgeTone: 'score' },
  { to: '/app/calendar', label: 'Calendar', icon: 'calendar_today' },
  { to: '/app/assistant', label: 'AI Assistant', icon: 'neurology', badgeTone: 'dot' },
];

export const secondaryNav: NavItem[] = [
  { to: '/app/business-profile', label: 'Business Profile', icon: 'business_center' },
  { to: '/app/settings', label: 'Settings', icon: 'settings' },
  { to: '/app/help', label: 'Help & Support', icon: 'help' },
];

export const publicNav = [
  { label: 'Product', href: '#product' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Intelligence', href: '#intelligence' },
  { label: 'Compliance', href: '#compliance' },
];