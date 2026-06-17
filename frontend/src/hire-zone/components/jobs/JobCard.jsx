import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import StatusBadge from '@/hire-zone/components/shared/StatusBadge';

const JobCard = ({ job, onAction, onView }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleDelete = () => {
    setMenuOpen(false);
    if (window.confirm(`Are you sure you want to delete "${job.title}"? This action cannot be undone.`)) {
      onAction?.(job.id, 'delete');
      toast.success('Job deleted successfully');
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      whileHover={{ boxShadow: '0 4px 20px -4px rgba(0,0,0,0.10)' }}
      className="bg-white rounded-2xl border border-neutral-100 p-5 transition-shadow"
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: job info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-base font-semibold text-neutral-900">{job.title}</h3>
            <StatusBadge status={job.status} />
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 mt-1">
            <span className="flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>
              {job.department}
            </span>
            <span className="flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Posted {job.postedDate}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-neutral-100 font-medium">{job.type}</span>
          </div>
        </div>

        {/* Right: stats + actions */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-center hidden sm:block p-2 rounded-xl">
            <p className="text-xl font-bold text-neutral-900">{job.applicants}</p>
            <p className="text-[10px] text-neutral-400">Applicants</p>
          </div>

          {/* View button */}
          <button
            onClick={() => onView?.(job)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            style={{ color: '#8B3A8F', background: '#f3e8f4' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
            View
          </button>

          {/* Action menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(p => !p)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
              aria-label="Job actions"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="5" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="19" r="1" fill="currentColor"/>
              </svg>
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-neutral-100 py-1 z-20"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  {[
                    { label: 'View Details',  icon: '👁',  action: 'view-details' },
                    { label: 'View Applicants', icon: '👥', action: 'view' },
                    { label: job.status === 'Active' ? 'Deactivate Job' : 'Activate Job', icon: job.status === 'Active' ? '⏸' : '▶️', action: 'toggle' },
                    { label: 'Close Job', icon: '🔒', action: 'close' },
                    { label: 'Delete Job', icon: '🗑', action: 'delete', danger: true },
                  ].map(({ label, icon, action, danger }) => (
                    <button
                      key={action}
                      onClick={() => {
                        if (action === 'view-details') {
                          onView?.(job);
                          setMenuOpen(false);
                        } else if (action === 'view') {
                          navigate('/hire-zone/applicants');
                          setMenuOpen(false);
                        } else if (action === 'delete') {
                          handleDelete();
                        } else {
                          onAction?.(job.id, action);
                          setMenuOpen(false);
                          if (action !== 'view') toast.success(label);
                        }
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors flex items-center gap-2 ${
                        danger ? 'text-red-500 hover:bg-red-50' : 'text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <span>{icon}</span> {label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;
