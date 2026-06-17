import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SectionHeader from '@/hire-zone/components/shared/SectionHeader';
import { notifications as notificationsAPI } from '@/utils/api';
import toast from 'react-hot-toast';

// Maps backend type enum → display config
const TYPE_CONFIG = {
  Application: { emoji: '📩', color: '#8B3A8F', label: 'Application',  redirect: '/hire-zone/applicants'  },
  Interview:   { emoji: '📅', color: '#2563eb', label: 'Interview',    redirect: '/hire-zone/interviews'  },
  JobPosting:  { emoji: '💼', color: '#0d9488', label: 'Job',          redirect: '/hire-zone/manage-jobs' },
  Status:      { emoji: '🎉', color: '#16a34a', label: 'Status',       redirect: '/hire-zone/applicants'  },
  Message:     { emoji: '💬', color: '#d97706', label: 'Message',      redirect: '/hire-zone/dashboard'   },
  Profile:     { emoji: '👤', color: '#6366f1', label: 'Profile',      redirect: '/hire-zone/dashboard'   },
  System:      { emoji: '🔔', color: '#6b7280', label: 'System',       redirect: '/hire-zone/dashboard'   },
};

const TYPE_FILTERS = ['All', 'Application', 'Interview', 'JobPosting', 'Status', 'System'];

const relativeTime = (iso) => {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hrs   = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins} min ago`;
  if (hrs  < 24) return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

const SkeletonItem = () => (
  <div className="flex items-start gap-4 p-4 rounded-2xl border border-neutral-100 bg-white animate-pulse">
    <div className="w-10 h-10 rounded-xl bg-neutral-200 shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3.5 bg-neutral-200 rounded w-1/2" />
      <div className="h-3 bg-neutral-100 rounded w-3/4" />
    </div>
    <div className="h-3 w-14 bg-neutral-100 rounded" />
  </div>
);

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter]   = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationsAPI.getAll()
      .then(res => {
        const data = (res.data.notifications || []).map(n => {
          const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.System;
          return {
            id:         n._id,
            type:       n.type,
            title:      n.title,
            body:       n.message,
            time:       relativeTime(n.createdAt),
            read:       n.isRead,
            color:      cfg.color,
            emoji:      cfg.emoji,
            redirectTo: n.actionUrl || cfg.redirect,
          };
        });
        setNotifications(data);
      })
      .catch(err => {
        console.error('Failed to fetch notifications:', err);
        toast.error('Failed to load notifications');
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered     = filter === 'All' ? notifications : notifications.filter(n => n.type === filter);
  const unreadCount  = notifications.filter(n => !n.read).length;

  const markAllRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(p => p.map(n => ({ ...n, read: true })));
      toast.success('All marked as read');
    } catch { toast.error('Failed'); }
  };

  const markRead = async (id) => {
    try {
      await notificationsAPI.markOneAsRead(id);
      setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n));
    } catch { /* silent */ }
  };

  const dismiss = async (id) => {
    try {
      await notificationsAPI.delete(id);
      setNotifications(p => p.filter(n => n.id !== id));
      toast.success('Notification dismissed');
    } catch { toast.error('Failed to dismiss'); }
  };

  const handleClick = (n) => {
    if (!n.read) markRead(n.id);
    if (n.redirectTo) navigate(n.redirectTo);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-neutral-900">Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: '#8B3A8F' }}>
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg shrink-0 transition-colors"
              style={{ color: '#8B3A8F', background: '#f3e8f4' }}>
              Mark all read
            </button>
          )}
        </div>

        <p className="text-sm text-neutral-500 -mt-4 mb-6">Stay updated on your hiring activity.</p>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 bg-neutral-100 rounded-xl p-1 mb-5 overflow-x-auto">
          {TYPE_FILTERS.map(f => {
            const count = f === 'All' ? notifications.length : notifications.filter(n => n.type === f).length;
            return (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${filter === f ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}>
                {f === 'All' ? `All (${count})` : `${TYPE_CONFIG[f]?.label || f} (${count})`}
              </button>
            );
          })}
        </div>

        {/* List */}
        <div className="space-y-2">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonItem key={i} />)
          ) : (
            <AnimatePresence>
              {filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-neutral-100 py-16 text-center">
                  <p className="text-4xl mb-3">🔔</p>
                  <p className="text-sm font-medium text-neutral-600">
                    {notifications.length === 0 ? 'No notifications yet.' : 'No notifications in this category.'}
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    {notifications.length === 0 && 'Notifications will appear here when candidates apply or interviews are scheduled.'}
                  </p>
                </div>
              ) : (
                filtered.map((n, i) => (
                  <motion.div
                    key={n.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 40, scale: 0.97 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => handleClick(n)}
                    className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer group ${
                      n.read
                        ? 'bg-white border-neutral-100 hover:border-neutral-200'
                        : 'bg-purple-50/40 border-purple-100 hover:border-purple-200'
                    }`}
                  >
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                      style={{ background: n.color + '18' }}>
                      {n.emoji}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-semibold ${n.read ? 'text-neutral-700' : 'text-neutral-900'}`}>
                          {n.title}
                          {!n.read && (
                            <span className="ml-2 w-1.5 h-1.5 rounded-full inline-block align-middle" style={{ background: '#8B3A8F' }} />
                          )}
                        </p>
                        <span className="text-[10px] text-neutral-400 shrink-0">{n.time}</span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">{n.body}</p>
                      {n.redirectTo && (
                        <p className="text-[10px] mt-1.5 font-medium" style={{ color: n.color }}>
                          👉 Click to view details
                        </p>
                      )}
                    </div>

                    {/* Dismiss */}
                    <button
                      onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-neutral-300 hover:text-neutral-500 hover:bg-neutral-100 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M18 6L6 18M6 6l12 12"/>
                      </svg>
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Notifications;
