import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ACTIONS = [
  {
    label: 'Post a Job',
    desc: 'Create new listing',
    path: '/hire-zone/post-job',
    bg: 'linear-gradient(135deg, #8B3A8F, #b06ab3)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
        <path d="M12 5v14M5 12h14"/>
      </svg>
    ),
  },
  {
    label: 'View Applicants',
    desc: 'Review candidates',
    path: '/hire-zone/applicants',
    bg: 'linear-gradient(135deg, #2563eb, #60a5fa)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    label: 'Search Resumes',
    desc: 'Find talent',
    path: '/hire-zone/resume-search',
    bg: 'linear-gradient(135deg, #0d9488, #2dd4bf)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
      </svg>
    ),
  },
  {
    label: 'Manage Jobs',
    desc: 'Edit postings',
    path: '/hire-zone/manage-jobs',
    bg: 'linear-gradient(135deg, #d97706, #fbbf24)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    ),
  },
];

const QuickActions = () => (
  <div className="bg-white rounded-2xl border border-neutral-100 p-5">
    <h3 className="text-sm font-semibold text-neutral-800 mb-4">Quick Actions</h3>
    <div className="grid grid-cols-2 gap-2.5">
      {ACTIONS.map(({ label, desc, path, bg, icon }, i) => (
        <motion.div
          key={path}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.06 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Link
            to={path}
            className="flex flex-col items-center gap-2 p-4 rounded-xl text-center transition-all"
            style={{ background: '#fafafa', border: '1px solid #f0f0f0' }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
              style={{ background: bg }}
            >
              {icon}
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-800">{label}</p>
              <p className="text-[10px] text-neutral-400">{desc}</p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  </div>
);

export default QuickActions;
