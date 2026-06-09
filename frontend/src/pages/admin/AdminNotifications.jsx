import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle2, AlertTriangle, Info, XCircle, Trash2 } from 'lucide-react';
import { ADMIN_NOTIFICATIONS } from '@/data/adminData';
import toast from 'react-hot-toast';

const fadeInUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

const AdminNotifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(ADMIN_NOTIFICATIONS);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read.');
  };

  const handleNotificationClick = (notif) => {
    setNotifications(notifications.map(n => n.id === notif.id ? { ...n, read: true } : n));
    
    if (notif.link) {
      navigate(notif.link);
      return;
    }
    
    // Redirect logic based on notification content
    const title = notif.title.toLowerCase();
    const msg = notif.message.toLowerCase();
    
    if (title.includes('company') || msg.includes('company')) {
      navigate('/admin/companies');
    } else if (title.includes('job') || msg.includes('job')) {
      navigate('/admin/jobs');
    } else if (title.includes('candidate') || title.includes('user') || msg.includes('candidate')) {
      navigate('/admin/users');
    } else {
      // Default info toast if no redirect needed
      toast.success('Notification read.');
    }
  };

  const handleMarkRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success('Notification deleted.');
  };

  const loadOlder = () => {
    toast('Loading older notifications...', { icon: '⏳' });
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      className="max-w-4xl mx-auto space-y-6 pb-10"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">System Notifications</h2>
          <p className="text-neutral-500 text-sm mt-1">Stay updated with {notifications.filter(n => !n.read).length} unread alerts.</p>
        </div>
        <button 
          onClick={handleMarkAllRead}
          className="text-xs font-bold text-brand-purple-400 hover:text-brand-purple-300 transition-colors flex items-center gap-2"
        >
          <CheckCircle2 size={14} />
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {notifications.map((notif) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-5 rounded-2xl border transition-all duration-200 flex gap-4 cursor-pointer hover:border-white/20 ${
                notif.read ? 'bg-white/[0.02] border-white/5 opacity-60' : 'bg-white/5 border-white/10 shadow-lg shadow-black/20'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                notif.type === 'warning' ? 'bg-orange-500/10 text-orange-500' :
                notif.type === 'error' ? 'bg-red-500/10 text-red-500' :
                notif.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                'bg-blue-500/10 text-blue-500'
              }`}>
                {notif.type === 'warning' && <AlertTriangle size={20} />}
                {notif.type === 'error' && <XCircle size={20} />}
                {notif.type === 'success' && <CheckCircle2 size={20} />}
                {notif.type === 'info' && <Info size={20} />}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-white">{notif.title}</h4>
                  <span className="text-[10px] text-neutral-500 font-medium">{notif.time}</span>
                </div>
                <p className="text-sm text-neutral-400 leading-relaxed">{notif.message}</p>
              </div>

              <div className="flex flex-col gap-2">
                {!notif.read && <div className="w-2 h-2 rounded-full bg-brand-purple-500 ml-auto" />}
                <button 
                  onClick={(e) => handleDelete(notif.id, e)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-neutral-500 hover:text-red-500 transition-colors mt-auto"
                  title="Delete notification"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {notifications.length === 0 && (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
            <Bell size={40} className="mx-auto text-neutral-600 mb-4" />
            <p className="text-neutral-400">You're all caught up!</p>
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <button 
          onClick={loadOlder}
          className="w-full py-4 rounded-2xl border border-dashed border-white/10 text-neutral-500 text-sm font-medium hover:bg-white/5 hover:border-white/20 transition-all"
        >
          Load Older Notifications
        </button>
      )}
    </motion.div>
  );
};

export default AdminNotifications;
