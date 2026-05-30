import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  X, User, Mail, Shield, Clock, 
  Activity, History, MapPin, Phone, 
  ExternalLink, CheckCircle2, AlertCircle 
} from 'lucide-react';
import toast from 'react-hot-toast';

const UserProfileModal = ({ isOpen, onClose, user }) => {
  const navigate = useNavigate();
  if (!user) return null;

  const handleFullDetail = () => {
    navigate(`/admin/users/${user.id}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="bg-[#0f0f0f] border border-white/10 rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden pointer-events-auto flex flex-col"
            >
              {/* Header */}
              <div className="relative h-32 bg-gradient-to-r from-brand-purple-600/20 to-brand-gold-500/20 shrink-0">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-all z-10"
                >
                  <X size={20} />
                </button>
                <div className="absolute -bottom-10 left-8 flex items-end gap-6">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-purple-600 to-brand-gold-500 p-1">
                    <div className="w-full h-full rounded-[calc(1.5rem-4px)] bg-[#0f0f0f] flex items-center justify-center font-bold text-3xl text-white">
                      {user.name.charAt(0)}
                    </div>
                  </div>
                  <div className="pb-2">
                    <h3 className="text-2xl font-bold text-white tracking-tight">{user.name}</h3>
                    <p className="text-brand-purple-400 text-sm font-semibold uppercase tracking-wider">{user.role}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto no-scrollbar pt-16 px-8 pb-8 space-y-8">
                {/* Personal Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em]">Contact Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-neutral-300">
                        <Mail size={16} className="text-brand-purple-500" />
                        <span className="text-sm">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-neutral-300">
                        <Phone size={16} className="text-brand-purple-500" />
                        <span className="text-sm">+91 98765-43210</span>
                      </div>
                      <div className="flex items-center gap-3 text-neutral-300">
                        <MapPin size={16} className="text-brand-purple-500" />
                        <span className="text-sm">Mumbai, Maharashtra</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em]">Account Status</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        {['Active', 'Verified'].includes(user.status) ? (
                          <CheckCircle2 size={16} className="text-emerald-500" />
                        ) : (
                          <AlertCircle size={16} className="text-amber-500" />
                        )}
                        <span className={`text-sm font-bold ${['Active', 'Verified'].includes(user.status) ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {user.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-neutral-300">
                        <Shield size={16} className="text-brand-purple-500" />
                        <span className="text-sm">Standard Permissions</span>
                      </div>
                      <div className="flex items-center gap-3 text-neutral-300">
                        <Clock size={16} className="text-brand-purple-500" />
                        <span className="text-sm">Member since {user.joined}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity Logs Section */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity size={16} className="text-brand-purple-500" />
                      <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Recent Activity Logs</h4>
                    </div>
                    <button className="text-[10px] font-bold text-brand-purple-400 hover:underline">View All Logs</button>
                  </div>
                  <div className="space-y-3">
                    {[
                      { action: 'Updated profile picture', time: '2 hours ago', icon: User },
                      { action: 'Changed account password', time: 'Yesterday', icon: Shield },
                      { action: 'Logged in from New Device', time: 'May 20, 2026', icon: Activity },
                    ].map((log, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-lg bg-brand-purple-600/10 text-brand-purple-500">
                            <log.icon size={12} />
                          </div>
                          <span className="text-xs text-neutral-300 font-medium">{log.action}</span>
                        </div>
                        <span className="text-[10px] text-neutral-500">{log.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* History Section */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <History size={16} className="text-brand-purple-500" />
                    <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Transaction / Interaction History</h4>
                  </div>
                  <div className="rounded-2xl bg-white/5 border border-white/5 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-white/5 text-neutral-500 font-bold uppercase">
                        <tr>
                          <th className="px-4 py-3">Event</th>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3 text-right">Reference</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-neutral-300">
                        <tr>
                          <td className="px-4 py-3">Premium Subscription</td>
                          <td className="px-4 py-3 font-medium">Jun 12, 2026</td>
                          <td className="px-4 py-3 text-right text-brand-purple-400 font-mono">#TXN-8942</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3">Course Purchase</td>
                          <td className="px-4 py-3 font-medium">May 28, 2026</td>
                          <td className="px-4 py-3 text-right text-brand-purple-400 font-mono">#TXN-7731</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-6 bg-white/5 border-t border-white/5 flex gap-3 justify-end shrink-0">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-neutral-400 hover:bg-white/5 hover:text-white transition-all"
                >
                  Close Profile
                </button>
                <button
                  onClick={handleFullDetail}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-brand-purple-600 text-white hover:bg-brand-purple-700 transition-all shadow-lg shadow-brand-purple-600/20 flex items-center gap-2"
                >
                  Full Detail Page
                  <ExternalLink size={14} />
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UserProfileModal;
