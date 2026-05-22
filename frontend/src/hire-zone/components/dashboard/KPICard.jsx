import { motion } from 'framer-motion';

const ACCENT = {
  purple: { grad: 'from-purple-500 to-purple-700', light: '#f3e8f4', text: '#8B3A8F',  icon: '#8B3A8F'  },
  green:  { grad: 'from-green-500 to-emerald-600', light: '#dcfce7', text: '#16a34a',  icon: '#16a34a'  },
  blue:   { grad: 'from-blue-500 to-blue-700',     light: '#dbeafe', text: '#2563eb',  icon: '#2563eb'  },
  gold:   { grad: 'from-amber-400 to-orange-500',  light: '#fef3c7', text: '#d97706',  icon: '#d97706'  },
  orange: { grad: 'from-orange-400 to-red-500',    light: '#ffedd5', text: '#ea580c',  icon: '#ea580c'  },
  teal:   { grad: 'from-teal-400 to-cyan-600',     light: '#ccfbf1', text: '#0d9488',  icon: '#0d9488'  },
};

const KPIIcon = ({ name, color }) => {
  const s = { width: 22, height: 22 };
  const icons = {
    briefcase: <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>,
    zap:       <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    users:     <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    star:      <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    calendar:  <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
    check:     <svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  };
  return icons[name] ?? null;
};

const KPICard = ({ title, value, trend, trendDirection, icon, accentColor }) => {
  const accent = ACCENT[accentColor] ?? ACCENT.purple;
  const isUp = trendDirection === 'up';

  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 12px 32px -6px rgba(0,0,0,0.13)' }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl p-5 border border-neutral-100 relative overflow-hidden cursor-default"
    >
      {/* Subtle gradient blob in corner */}
      <div
        className={`absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 bg-gradient-to-br ${accent.grad}`}
        aria-hidden="true"
      />

      <div className="flex items-start justify-between relative">
        <div>
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">{title}</p>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-neutral-900 leading-none"
          >
            {value}
          </motion.p>
        </div>
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: accent.light }}
        >
          <KPIIcon name={icon} color={accent.icon} />
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-4 relative">
        <span
          className={`flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
            isUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
          }`}
        >
          {isUp ? (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M18 15l-6-6-6 6"/></svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M6 9l6 6 6-6"/></svg>
          )}
          {trend}
        </span>
        <span className="text-xs text-neutral-400">vs last month</span>
      </div>
    </motion.div>
  );
};

export default KPICard;
