import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SectionHeader from '@/hire-zone/components/shared/SectionHeader';
import { notifications as notificationsAPI } from '@/utils/api';
import toast from 'react-hot-toast';

const MOCK_NOTIFICATIONS = [
  { id: 1,  type: 'application', title: 'New Application Received',       body: 'Priya Sharma applied for Frontend Developer.',       time: '2 min ago',   read: false, color: '#8B3A8F', emoji: '📩', redirectTo: '/hire-zone/applicants' },
  { id: 2,  type: 'interview',   title: 'Interview Reminder',             body: 'Interview with Rahul Verma at 2:00 PM today.',       time: '15 min ago',  read: false, color: '#2563eb', emoji: '📅', redirectTo: '/hire-zone/interviews' },
  { id: 3,  type: 'application', title: '5 New Applications',             body: 'Backend Developer role received 5 new applicants.',  time: '1 hr ago',    read: false, color: '#8B3A8F', emoji: '📩', redirectTo: '/hire-zone/applicants' },
  { id: 4,  type: 'offer',       title: 'Offer Accepted',                 body: 'Sneha Patel accepted the offer for UI/UX Designer.', time: '3 hrs ago',   read: false, color: '#16a34a', emoji: '🎉', redirectTo: '/hire-zone/dashboard' },
  { id: 5,  type: 'interview',   title: 'Interview Completed',            body: 'Anjali Singh\'s interview has been marked done.',    time: '5 hrs ago',   read: true,  color: '#2563eb', emoji: '✅', redirectTo: '/hire-zone/interviews' },
];

const TYPE_FILTERS = ['All', 'application', 'interview', 'offer', 'system'];

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await notificationsAPI.getAll();
        const data = (res.data.notifications || []).map(n => ({
          id: n._id,
          type: n.type || 'system',
          title: n.title,
          body: n.message,
          time: new Date(n.createdAt).toLocaleString(),
          read: n.isRead,
          color: '#8B3A8F',
          emoji: '🔔',
          redirectTo: '/hire-zone/dashboard',
        }));
        setNotifications(data.length > 0 ? data : MOCK_NOTIFICATIONS);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const filtered = filter === 'All' ? notifications : notifications.filter(n => n.type === filter);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(p => p.map(n => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markRead = async (id) => {
    try {
      await notificationsAPI.markOneAsRead(id);
      setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const dismiss = async (id) => {
    try {
      await notificationsAPI.delete(id);
      setNotifications(p => p.filter(n => n.id !== id));
      toast.success('Notification dismissed');
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleNotificationClick = (n) => {
    markRead(n.id);
    if (n.redirectTo) {
      navigate(n.redirectTo);
    }
  };

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
                    n.read ? 'bg-white border-neutral-100 hover:border-neutral-200' : 'bg-purple-50/40 border-purple-100 hover:border-purple-200'
                  }`}
                  onClick={() => handleNotificationClick(n)}
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
                    {n.redirectTo && (
                      <p className="text-[10px] text-brand-purple-500 font-medium mt-1.5">
                        👉 Click to view details
                      </p>
                    )}
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
