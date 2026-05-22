import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeader from '@/hire-zone/components/shared/SectionHeader';

const MOCK_NOTIFICATIONS = [
  { id: 1,  type: 'application', title: 'New Application Received',       body: 'Priya Sharma applied for Frontend Developer.',       time: '2 min ago',   read: false, color: '#8B3A8F', emoji: '📩' },
  { id: 2,  type: 'interview',   title: 'Interview Reminder',             body: 'Interview with Rahul Verma at 2:00 PM today.',       time: '15 min ago',  read: false, color: '#2563eb', emoji: '📅' },
  { id: 3,  type: 'application', title: '5 New Applications',             body: 'Backend Developer role received 5 new applicants.',  time: '1 hr ago',    read: false, color: '#8B3A8F', emoji: '📩' },
  { id: 4,  type: 'offer',       title: 'Offer Accepted',                 body: 'Sneha Patel accepted the offer for UI/UX Designer.', time: '3 hrs ago',   read: false, color: '#16a34a', emoji: '🎉' },
  { id: 5,  type: 'interview',   title: 'Interview Completed',            body: 'Anjali Singh\'s interview has been marked done.',    time: '5 hrs ago',   read: true,  color: '#2563eb', emoji: '✅' },
  { id: 6,  type: 'system',      title: 'Job Posting Expiring Soon',      body: 'DevOps Engineer posting expires in 3 days.',         time: '1 day ago',   read: true,  color: '#d97706', emoji: '⚠️' },
  { id: 7,  type: 'application', title: 'New Application Received',       body: 'Amit Joshi applied for Data Analyst.',               time: '1 day ago',   read: true,  color: '#8B3A8F', emoji: '📩' },
  { id: 8,  type: 'system',      title: 'Profile Incomplete',             body: 'Complete your company profile to attract more candidates.', time: '2 days ago', read: true, color: '#ea580c', emoji: '🔔' },
  { id: 9,  type: 'offer',       title: 'Offer Declined',                 body: 'Karan Mehta declined the offer for Backend Developer.', time: '2 days ago', read: true, color: '#ea580c', emoji: '❌' },
  { id: 10, type: 'system',      title: 'Monthly Report Ready',           body: 'Your January hiring report is now available.',       time: '3 days ago',  read: true,  color: '#0d9488', emoji: '📊' },
];

const TYPE_FILTERS = ['All', 'application', 'interview', 'offer', 'system'];

const Notifications = () => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? notifications : notifications.filter(n => n.type === filter);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(p => p.map(n => ({ ...n, read: true })));
  const markRead = (id) => setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n));
  const dismiss = (id) => setNotifications(p => p.filter(n => n.id !== id));

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-neutral-900">Notifications</h1>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: '#8B3A8F' }}>
                  {unreadCount}
                </span>
              )}
            </div>
            <p className="text-sm text-neutral-500 mt-1">Stay updated on your hiring activity.</p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shrink-0"
              style={{ color: '#8B3A8F', background: '#f3e8f4' }}
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 bg-neutral-100 rounded-xl p-1 mb-5 overflow-x-auto">
          {TYPE_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap capitalize transition-all ${
                filter === f ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {f === 'All' ? `All (${notifications.length})` : f}
            </button>
          ))}
        </div>

        {/* Notification list */}
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-neutral-100 py-16 text-center">
                <p className="text-4xl mb-3">🔔</p>
                <p className="text-sm text-neutral-500">No notifications here.</p>
              </div>
            ) : (
              filtered.map((n, i) => (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 40, scale: 0.97 }}
                  transition={{ delay: i * 0.04 }}
                  className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer group ${
                    n.read ? 'bg-white border-neutral-100' : 'bg-purple-50/40 border-purple-100'
                  }`}
                  onClick={() => markRead(n.id)}
                >
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                    style={{ background: n.color + '18' }}
                  >
                    {n.emoji}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-semibold ${n.read ? 'text-neutral-700' : 'text-neutral-900'}`}>
                        {n.title}
                        {!n.read && <span className="ml-2 w-1.5 h-1.5 rounded-full inline-block align-middle" style={{ background: '#8B3A8F' }} />}
                      </p>
                      <span className="text-[10px] text-neutral-400 shrink-0">{n.time}</span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">{n.body}</p>
                  </div>

                  {/* Dismiss */}
                  <button
                    onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-neutral-300 hover:text-neutral-500 hover:bg-neutral-100 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Notifications;
