import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_NOTIFICATIONS } from '@/career-hub/data/mockCandidate';

const TYPE_ICONS = {
  application: { bg: 'bg-blue-50', color: '#3B82F6', path: <><rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" fill="none"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></> },
  interview:   { bg: 'bg-purple-50', color: '#8B3A8F', path: <><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" fill="none"/><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></> },
  profile:     { bg: 'bg-amber-50', color: '#D97706', path: <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" fill="none"/></> },
};

const NotificationDetailModal = ({ item, onClose }) => {
  const navigate = useNavigate();
  if (!item) return null;

  const handleAction = () => {
    if (item.type === 'application') navigate('/career-hub/applied-jobs');
    else if (item.type === 'interview') navigate('/career-hub/interviews');
    else if (item.type === 'profile') navigate('/career-hub/profile');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${TYPE_ICONS[item.type].bg}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" style={{ color: TYPE_ICONS[item.type].color }}>
                {TYPE_ICONS[item.type].path}
              </svg>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full text-neutral-400 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <h3 className="text-xl font-bold text-neutral-900 mb-2">
            {item.type === 'interview' ? 'Interview Scheduled' : item.type === 'application' ? 'Application Update' : 'Profile Viewed'}
          </h3>
          <p className="text-neutral-600 leading-relaxed mb-6">
            {item.message}
          </p>

          <div className="bg-neutral-50 rounded-2xl p-5 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-neutral-100 flex items-center justify-center text-sm font-bold text-neutral-500">
                {item.companyName?.[0] || 'C'}
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-800">{item.companyName || 'Recruiter'}</p>
                <p className="text-xs text-neutral-400">{item.jobTitle || 'Corporate Hub'}</p>
              </div>
            </div>
            <p className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider">Received {item.time}</p>
          </div>

          <button
            onClick={handleAction}
            className="w-full py-3.5 rounded-2xl text-sm font-bold text-white shadow-lg shadow-purple-100 transition-all hover:scale-[1.02] active:scale-95"
            style={{ background: '#8B3A8F' }}
          >
            {item.type === 'interview' ? 'View Interview Details' : item.type === 'application' ? 'View My Applications' : 'Go to Profile'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const Notifications = () => {
  const [items, setItems] = useState(MOCK_NOTIFICATIONS);
  const [selected, setSelected] = useState(null);
  const unread = items.filter(n => !n.read).length;

  const markAllRead = () => setItems(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id) => setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const handleClick = (n) => {
    markRead(n.id);
    setSelected(n);
  };

  return (
    <div>
      <AnimatePresence>
        {selected && <NotificationDetailModal item={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>

      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-neutral-800 mb-1">Notifications</h1>
          <p className="text-sm text-neutral-500">{unread} unread</p>
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs font-semibold hover:underline"
            style={{ color: '#8B3A8F' }}
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-2">
        {items.map(n => {
          const icon = TYPE_ICONS[n.type] ?? TYPE_ICONS.profile;
          return (
            <div
              key={n.id}
              onClick={() => handleClick(n)}
              className={`bg-white rounded-2xl border shadow-sm p-4 flex items-start gap-4 transition-colors cursor-pointer hover:bg-neutral-50 ${n.read ? 'border-neutral-100' : 'border-purple-100 bg-purple-50/10'}`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${icon.bg}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" style={{ color: icon.color }}>
                  {icon.path}
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-relaxed ${n.read ? 'text-neutral-600' : 'text-neutral-800 font-medium'}`}>
                  {n.message}
                </p>
                <p className="text-xs text-neutral-400 mt-1">{n.time}</p>
              </div>
              {!n.read && (
                <span className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background: '#8B3A8F' }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Notifications;
