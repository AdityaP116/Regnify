import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import { Logo } from './Logo';
import { publicNav } from './navigation';
import { useAuth } from '../context/AuthContext';

export function PublicNav() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-surface/90 backdrop-blur border-b border-[#E2E8E5]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <Logo size={30} />
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {publicNav.map((item) => (
            <a key={item.label} href={item.href} className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link to={user ? '/app/overview' : '/login'} className="font-label-md text-label-md text-on-surface-variant hover:text-primary px-3 py-2">
            {user ? 'Open dashboard' : 'Sign in'}
          </Link>
          <Link
            to={user ? '/app/overview' : '/register'}
            className="bg-primary text-on-primary font-label-md text-label-md px-5 py-2.5 rounded-lg hover:bg-primary-container transition-colors"
          >
            {user ? 'Go to app' : 'Get Started'}
          </Link>
        </div>

        <button className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-surface-container-low" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          <Icon name={open ? 'close' : 'menu'} />
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-[#E2E8E5] bg-surface-container-lowest px-6 py-4 space-y-2">
          {publicNav.map((item) => (
            <a key={item.label} href={item.href} onClick={() => setOpen(false)} className="block font-label-md text-label-md text-on-surface-variant py-2">
              {item.label}
            </a>
          ))}
          <div className="flex gap-3 pt-2">
            <button onClick={() => navigate(user ? '/app/overview' : '/login')} className="flex-1 border border-[#E2E8E5] rounded-lg py-2.5 font-label-md text-label-md">
              {user ? 'Dashboard' : 'Sign in'}
            </button>
            <button onClick={() => navigate(user ? '/app/overview' : '/register')} className="flex-1 bg-primary text-on-primary rounded-lg py-2.5 font-label-md text-label-md">
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export function PublicFooter() {
  const columns = [
    {
      title: 'Product',
      links: [
        { label: 'Dashboard', to: '/app/overview' },
        { label: 'Regulations', to: '/app/regulations' },
        { label: 'Alerts', to: '/app/alerts' },
        { label: 'Compliance', to: '/app/compliance' },
        { label: 'AI Assistant', to: '/app/assistant' },
      ],
    },
    {
      title: 'Platform',
      links: [
        { label: 'How it works', to: '/#how-it-works' },
        { label: 'Intelligence pipeline', to: '/#intelligence' },
        { label: 'Sources', to: '/#sources' },
        { label: 'Security', to: '/#security' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', to: '/#about' },
        { label: 'Contact', to: '/#contact' },
        { label: 'Help & Support', to: '/app/help' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy', to: '/#privacy' },
        { label: 'Terms', to: '/#terms' },
        { label: 'DPA', to: '/#dpa' },
      ],
    },
  ];

  return (
    <footer className="w-full bg-surface-container-low border-t border-[#E2E8E5] pt-16 pb-12 mt-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12">
          <div className="space-y-4">
            <Logo size={28} />
            <p className="font-headline-sm text-headline-sm text-on-surface font-medium leading-snug">Know the Change. Take Action.</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Autonomous regulatory intelligence platform monitoring legislative shifts, circulars, and notifications into decisive operational mandates.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-label-sm text-label-sm uppercase tracking-wider text-primary mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-[#E2E8E5] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body-sm text-body-sm text-outline">© 2025 Regnify Intelligence Systems. All rights reserved.</p>
          <p className="font-body-sm text-body-sm text-outline">SOC-2 ready • Official sources cited • AI interpretations clearly labelled</p>
        </div>
      </div>
    </footer>
  );
}
