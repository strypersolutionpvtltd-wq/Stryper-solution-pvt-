import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import Logo from '@/components/shared/Logo';
import { FOOTER_ROUTES, NAV_ROUTES } from '@/routes/routeConfig';
import { COMPANY_INFO } from '@/data/companyInfo';
import chairmanImg from '@/assets/image/chariman.jpg';

const SOCIAL_ICONS = {
  LinkedIn: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="14" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M4 6.5v5M4 4.5v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M7.5 11.5V9c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M7.5 6.5v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  Twitter: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 3h3.5l2.5 3.5L11 3h3L9.5 8.5 14 13h-3.5L8 9.5 5 13H2l4.5-5L2 3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  ),
  Facebook: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M9.5 5H8.5C7.95 5 7.5 5.45 7.5 6v1.5H6v2h1.5V14h2V9.5H11l.5-2H9.5V6c0-.28.22-.5.5-.5H11V5h-1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    </svg>
  ),
};

const QUICK_LINKS = NAV_ROUTES.filter((r) => r.path !== '/');

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const year = new Date().getFullYear();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) { setSubscribed(true); setEmail(''); }
  };

  return (
    <footer className="relative bg-neutral-900 text-neutral-400 overflow-hidden" role="contentinfo">

      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-purple-900/30 blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] rounded-full bg-yellow-900/15 blur-[100px] translate-x-1/3 translate-y-1/3" />
      </div>

      {/* Top accent line */}
      <div className="h-[2px] w-full" style={{ background: 'linear-gradient(90deg, transparent 0%, #7c3aed 30%, #d97706 70%, transparent 100%)' }} aria-hidden="true" />

      {/* Main grid — 4 equal columns */}
      <div className="container-base relative z-10 pt-16 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Col 1 — Brand */}
          <div className="space-y-5">
            <Logo variant="light" />
            <p className="text-sm leading-relaxed text-neutral-400">
              {COMPANY_INFO.tagline}
            </p>
            <div className="flex gap-2">
              {COMPANY_INFO.socials.map(({ label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow us on ${label}`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.93 }}
                  className="w-9 h-9 rounded-lg bg-neutral-800 border border-neutral-700/50 flex items-center justify-center text-neutral-400 hover:bg-purple-600 hover:text-white hover:border-purple-500 transition-all duration-200"
                >
                  {SOCIAL_ICONS[label] ?? <span className="text-[10px] font-bold">{label[0]}</span>}
                </motion.a>
              ))}
            </div>

            {/* Newsletter */}
            <div>
              <p className="text-xs font-semibold text-neutral-300 uppercase tracking-widest mb-3">Stay Updated</p>
              {subscribed ? (
                <p className="text-sm text-emerald-400 flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Subscribed. Thank you!
                </p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2" noValidate>
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email" required aria-label="Email for newsletter"
                    className="flex-1 min-w-0 px-3 py-2.5 rounded-lg text-sm bg-neutral-800 border border-neutral-700/60 text-neutral-200 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                  <button type="submit" aria-label="Subscribe" className="px-3 py-2.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors shrink-0">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7h9M7.5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Col 2 — Links */}
          <div className="space-y-5">
            <FooterLinkGroup title="Quick Links" links={QUICK_LINKS.map((r) => ({ label: r.label, path: r.path }))} />
            <div className="pt-2">
              <FooterLinkGroup title="Our Services" links={FOOTER_ROUTES.services} />
            </div>
          </div>

          {/* Col 3 — Contact */}
          <div className="space-y-5">
            <h3 className="text-xs font-semibold text-neutral-200 uppercase tracking-widest">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1C4.79 1 3 2.79 3 5c0 3.25 4 8 4 8s4-4.75 4-8c0-2.21-1.79-4-4-4z" stroke="#a78bfa" strokeWidth="1.3"/><circle cx="7" cy="5" r="1.5" stroke="#a78bfa" strokeWidth="1.2"/></svg>
                </div>
                <address className="not-italic text-sm text-neutral-500 leading-relaxed">
                  {COMPANY_INFO.address.line1},<br />
                  {COMPANY_INFO.address.city}, {COMPANY_INFO.address.state} — {COMPANY_INFO.address.pin}
                </address>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2.5C2 2.22 2.22 2 2.5 2h2l1 2.5-1.5 1c.5 1.5 2 3 3.5 3.5l1-1.5L11 8.5v2c0 .28-.22.5-.5.5C5.15 11 2 7.85 2 4v-1.5z" stroke="#a78bfa" strokeWidth="1.3" strokeLinejoin="round"/></svg>
                </div>
                <a href={`tel:${COMPANY_INFO.phone}`} className="text-sm text-neutral-500 hover:text-white transition-colors">{COMPANY_INFO.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="3" width="11" height="8" rx="1.5" stroke="#a78bfa" strokeWidth="1.3"/><path d="M1.5 4l5.5 3.5L12.5 4" stroke="#a78bfa" strokeWidth="1.3" strokeLinecap="round"/></svg>
                </div>
                <a href={`mailto:${COMPANY_INFO.email}`} className="text-sm text-neutral-500 hover:text-white transition-colors break-all">{COMPANY_INFO.email}</a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="#a78bfa" strokeWidth="1.3"/><path d="M7 4v3.5l2 1.5" stroke="#a78bfa" strokeWidth="1.3" strokeLinecap="round"/></svg>
                </div>
                <span className="text-sm text-neutral-500">Mon – Sat, 9 AM – 6 PM</span>
              </li>
            </ul>
          </div>

          {/* Col 4 — Leadership */}
          <div className="space-y-5">
            <h3 className="text-xs font-semibold text-neutral-200 uppercase tracking-widest">Leadership</h3>

            {/* Chairman card */}
            <div className="bg-neutral-800/60 border border-neutral-700/50 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <img
                    src={chairmanImg}
                    alt="Kartikey Niranjan — Chairman"
                    className="w-14 h-14 rounded-full object-cover"
                    style={{ border: '2px solid #7c3aed' }}
                  />
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center">
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M5 1l1 2h2.2L6.6 4.4l.8 2.2L5 5.4 2.6 6.6l.8-2.2L1.8 3H4L5 1z" fill="white"/></svg>
                  </span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Kartikey Niranjan</p>
                  <p className="text-yellow-400 text-xs font-medium mt-0.5">Chairman</p>
                  <p className="text-neutral-500 text-xs mt-0.5">Stryper Solution Pvt. Ltd.</p>
                </div>
              </div>

              <div className="border-t border-neutral-700/50 pt-3 space-y-1.5">
                {['HR Management', 'Business Operations', 'Workforce Management', 'Strategic Planning'].map((skill) => (
                  <div key={skill} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-purple-400 shrink-0" aria-hidden="true" />
                    <span className="text-xs text-neutral-400">{skill}</span>
                  </div>
                ))}
              </div>

              <a
                href="https://linkedin.com/in/kartikey-niranjan-493115188"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-neutral-500 hover:text-white transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="14" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.4"/><path d="M4 6.5v5M4 4.5v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M7.5 11.5V9c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M7.5 6.5v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                View LinkedIn Profile
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 border-t border-neutral-800/80">
        <div className="container-base py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-neutral-600">
            © {year} <span className="text-neutral-400 font-medium">{COMPANY_INFO.name}</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {[{ label: 'Privacy Policy', path: '/privacy' }, { label: 'Terms of Service', path: '/terms' }, { label: 'Sitemap', path: '/sitemap' }].map(({ label, path }) => (
              <Link key={path} to={path} className="text-xs text-neutral-600 hover:text-neutral-300 transition-colors">{label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLinkGroup = ({ title, links }) => (
  <div className="space-y-3">
    <h3 className="text-xs font-semibold text-neutral-200 uppercase tracking-widest">{title}</h3>
    <ul className="space-y-2" role="list">
      {links.map(({ label, path }) => (
        <li key={`${path}-${label}`}>
          <Link to={path} className="group inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-white transition-colors duration-200">
            <span className="w-0 group-hover:w-2.5 h-px bg-yellow-500 transition-all duration-200 overflow-hidden" aria-hidden="true" />
            {label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default Footer;
