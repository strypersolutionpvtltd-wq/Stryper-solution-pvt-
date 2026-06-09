import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Mail, Phone, MapPin, Shield, 
  Clock, Activity, History, CheckCircle2, 
  AlertCircle, Edit2, Trash2, ExternalLink,
  User, Briefcase, Building2, Download, X, Save, Loader2
} from 'lucide-react';
import { ALL_USERS, ALL_COMPANIES, ALL_STRYPER_PARTNERS } from '@/data/adminData';
import toast from 'react-hot-toast';

// ── Edit Modal Component ──────────────────────────────────────
const EditUserModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({ ...user });

  useEffect(() => {
    if (user) setFormData({ ...user });
  }, [user]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-[#0f0f0f] border border-white/10 rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl"
        >
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
            <h3 className="font-bold text-lg">Edit User Profile</h3>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-neutral-400 hover:text-white"><X size={20}/></button>
          </div>
          
          <div className="p-8 space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">{user?.role === 'Company' ? 'Company Name' : 'Full Name'}</label>
              <input 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                disabled={user?.role === 'Company'}
                className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-purple-600/50 text-white ${user?.role === 'Company' ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Email Address</label>
              <input 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-purple-600/50 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Role</label>
                <select 
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-[#161616] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white"
                >
                  <option>Company</option>
                  <option>Stryper Partner</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Status</label>
                <select 
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full bg-[#161616] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white"
                >
                  <option>Active</option>
                  <option>Verified</option>
                  <option>Pending</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white/5 border-t border-white/5 flex gap-3 justify-end">
            <button onClick={onClose} className="px-6 py-2 rounded-xl text-sm font-bold text-neutral-500 hover:text-white transition-colors">Cancel</button>
            <button 
              onClick={() => onSave(formData)}
              className="flex items-center gap-2 px-8 py-2 rounded-xl bg-brand-purple-600 text-white text-sm font-bold hover:bg-brand-purple-700 transition-all shadow-lg shadow-brand-purple-600/20"
            >
              <Save size={16}/>
              Save Changes
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isExporting, setIsExportLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let foundUser = ALL_USERS.find(u => u.id === id);
    if (!foundUser) {
      const company = ALL_COMPANIES.find(c => c.id === id);
      if (company) foundUser = { ...company, email: `${company.name.toLowerCase().replace(/\s+/g, '')}@company.com`, role: 'Company', joined: 'N/A' };
    }
    if (!foundUser) {
      const partner = ALL_STRYPER_PARTNERS.find(p => p.id === id);
      if (partner) foundUser = { ...partner, email: `${partner.name.toLowerCase().replace(/\s+/g, '')}@partner.com`, role: 'Stryper Partner', joined: 'N/A' };
    }

    if (foundUser) {
      setUser(foundUser);
    } else {
      toast.error("User not found");
      navigate('/admin/users');
    }
  }, [id, navigate]);

  const handleExport = () => {
    setIsExportLoading(true);
    setTimeout(() => {
      const rows = [
        ["Field", "Value"],
        ["ID", user.id],
        ["Name", user.name],
        ["Email", user.email],
        ["Role", user.role],
        ["Status", user.status],
        ["Joined", user.joined],
        ["IP Address", "192.168.1.1"]
      ];
      const csv = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `user_${user.id}_profile.csv`;
      a.click();
      URL.revokeObjectURL(url);
      setIsExportLoading(false);
      toast.success("Profile exported successfully");
    }, 800);
  };

  const handleSaveProfile = (updatedData) => {
    setUser(updatedData);
    setIsEditModalOpen(false);
    toast.success("Profile updated successfully");
  };

  const handleDeleteUser = () => {
    if (window.confirm(`Are you sure you want to permanently delete ${user.name}? This action cannot be undone.`)) {
      setIsDeleting(true);
      setTimeout(() => {
        toast.success(`${user.name}'s account has been deleted.`);
        navigate('/admin/users');
      }, 1500);
    }
  };

  const handleViewAllLogs = () => {
    toast.success("Fetching all activity logs...");
  };

  if (!user) return null;

  const fadeInUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className="space-y-6 pb-20 text-white">
      <EditUserModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        user={user} 
        onSave={handleSaveProfile} 
      />

      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/admin/users')}
          className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group"
        >
          <div className="p-2 rounded-xl bg-white/5 border border-white/5 group-hover:bg-white/10 transition-all">
            <ArrowLeft size={18} />
          </div>
          <span className="text-sm font-bold uppercase tracking-widest">Back to User Management</span>
        </button>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-sm font-bold text-neutral-300 hover:bg-white/10 transition-all disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="animate-spin" size={16}/> : <Download size={16} />}
            {isExporting ? 'Exporting...' : 'Export Data'}
          </button>
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-purple-600 text-white text-sm font-bold hover:bg-brand-purple-700 transition-all shadow-lg shadow-brand-purple-600/20"
          >
            <Edit2 size={16} />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Header Profile Section */}
      <motion.div 
        initial="hidden" animate="visible" variants={fadeInUp}
        className="relative overflow-hidden bg-[#0f0f0f] border border-white/5 rounded-[2.5rem] p-8"
      >
        <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-brand-purple-600/10 to-transparent pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brand-gold-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-center md:items-end gap-8">
          <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-brand-purple-600 to-brand-gold-500 p-1.5 shadow-2xl">
            <div className="w-full h-full rounded-[calc(2.5rem-6px)] bg-[#0f0f0f] flex items-center justify-center font-bold text-4xl text-white">
              {user.name.charAt(0)}
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left pb-2">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                ['Active', 'Verified'].includes(user.status) ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
              }`}>
                {user.status}
              </span>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-neutral-400 text-sm">
              <div className="flex items-center gap-1.5">
                <Mail size={14} className="text-brand-purple-500" />
                {user.email}
              </div>
              <div className="flex items-center gap-1.5 border-l border-white/10 pl-4">
                <Briefcase size={14} className="text-brand-purple-500" />
                {user.role}
              </div>
              <div className="flex items-center gap-1.5 border-l border-white/10 pl-4">
                <MapPin size={14} className="text-brand-purple-500" />
                Mumbai, India
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
             <div className="text-right">
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em]">Member Since</p>
                <p className="text-lg font-bold text-white">{user.joined}</p>
             </div>
             <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <CheckCircle2 size={10} />
                Identity Verified
             </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} transition={{ delay: 0.1 }}
            className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-6 space-y-6"
          >
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Account Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-[10px] font-bold text-neutral-500 uppercase mb-1">Total Logs</p>
                <p className="text-xl font-bold">142</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-[10px] font-bold text-neutral-500 uppercase mb-1">Transactions</p>
                <p className="text-xl font-bold">12</p>
              </div>
            </div>
            
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-400">Security Level</span>
                <span className="font-bold text-emerald-500">High</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="w-[85%] h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              </div>
              <p className="text-[11px] text-neutral-500">Two-factor authentication is enabled for this account.</p>
            </div>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeInUp} transition={{ delay: 0.2 }}
            className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-6"
          >
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-6">Contact Information</h3>
            <div className="space-y-5">
              {[
                { label: 'Email', value: user.email, icon: Mail },
                { label: 'Phone', value: '+91 98765-43210', icon: Phone },
                { label: 'Address', value: '402, Elite Hub, Andheri East, Mumbai', icon: MapPin },
                { label: 'Registration IP', value: '192.168.1.1', icon: Shield },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="p-2.5 rounded-xl bg-brand-purple-600/10 text-brand-purple-500 shrink-0 h-fit">
                    <item.icon size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-tighter">{item.label}</p>
                    <p className="text-sm font-medium text-neutral-200 mt-0.5 break-all">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} transition={{ delay: 0.3 }}
            className="bg-[#0f0f0f] border border-white/5 rounded-3xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                  <Activity size={18} />
                </div>
                <h3 className="font-bold">System Activity Logs</h3>
              </div>
              <button 
                onClick={handleViewAllLogs}
                className="text-xs font-bold text-brand-purple-400 hover:underline"
              >
                View All
              </button>
            </div>
            
            <div className="p-6 space-y-6 relative">
              <div className="absolute left-9 top-10 bottom-10 w-px bg-white/5" />
              
              {[
                { action: 'Profile updated', time: 'Today, 10:45 AM', detail: 'Changed contact number and address', type: 'update' },
                { action: 'Password changed', time: 'Yesterday, 4:30 PM', detail: 'Successfully changed from device "MacBook Pro"', type: 'security' },
                { action: 'New Device Login', time: 'May 20, 2026', detail: 'Logged in from iPhone 15 Pro, Mumbai', type: 'login' }
                ].map((log, idx) => (
                <div key={idx} className="flex gap-6 relative">
                  <div className={`w-6 h-6 rounded-full border-2 border-[#0f0f0f] flex items-center justify-center shrink-0 z-10 ${
                    log.type === 'security' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' :
                    log.type === 'update' ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' :
                    log.type === 'billing' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' :
                    'bg-brand-purple-600 shadow-[0_0_10px_rgba(139,58,143,0.5)]'
                  }`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-neutral-200">{log.action}</p>
                      <span className="text-[10px] font-medium text-neutral-600 flex items-center gap-1">
                        <Clock size={10} />
                        {log.time}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">{log.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeInUp} transition={{ delay: 0.5 }}
            className="bg-red-500/5 border border-red-500/10 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div>
              <h3 className="text-red-500 font-bold flex items-center gap-2">
                <AlertCircle size={18} />
                Danger Zone
              </h3>
              <p className="text-neutral-500 text-xs mt-1">Permanently delete this user and all associated data. This action cannot be undone.</p>
            </div>
            <button 
              onClick={handleDeleteUser}
              disabled={isDeleting}
              className="px-6 py-2.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 text-sm font-bold hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isDeleting ? <Loader2 className="animate-spin" size={14}/> : <Trash2 size={14} />}
              {isDeleting ? 'Deleting...' : 'Delete User Account'}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetail;
