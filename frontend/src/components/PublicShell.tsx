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
    <header className="sticky top-0 z-40 w-full pt-4 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto bg-primary rounded-2xl shadow-[0_4px_30px_rgba(0,69,65,0.35)]">
        <div className="px-5 lg:px-8 h-16 flex items-center justify-between relative">
          {/* Logo — left */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <Logo size={28} variant="dark" />
          </Link>

          {/* Nav links — center */}
          <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {publicNav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="font-label-md text-[13px] text-white/60 hover:text-white transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTA — right */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to={user ? '/app/overview' : '/login'}
              className="font-label-md text-[13px] text-white/50 hover:text-white transition-colors px-3 py-2"
            >
              {user ? 'Dashboard' : 'Sign in'}
            </Link>
            <Link
              to={user ? '/app/overview' : '/register'}
              className="bg-white text-[#111111] font-semibold text-[13px] px-6 py-2.5 rounded-full hover:bg-white/90 transition-all duration-200 shadow-sm"
            >
              {user ? 'Go to app' : 'Get Started'}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>

        {/* Mobile drawer */}
        {open && (
          <div className="lg:hidden border-t border-white/10 px-5 py-4 space-y-1">
            {publicNav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block font-label-md text-[13px] text-white/60 hover:text-white py-2.5 px-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                {item.label}
              </a>
            ))}
            <div className="flex gap-3 pt-3">
              <button
                onClick={() => navigate(user ? '/app/overview' : '/login')}
                className="flex-1 border border-white/20 text-white/70 rounded-full py-2.5 font-label-md text-[13px] hover:bg-white/5 transition-colors"
              >
                {user ? 'Dashboard' : 'Sign in'}
              </button>
              <button
                onClick={() => navigate(user ? '/app/overview' : '/register')}
                className="flex-1 bg-white text-[#111111] rounded-full py-2.5 font-semibold text-[13px]"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
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
