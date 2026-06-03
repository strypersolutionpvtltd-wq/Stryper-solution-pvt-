import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MoreVertical, FileText, Calendar, Building2, User, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { ALL_APPLICATIONS } from '@/data/adminData';
import toast from 'react-hot-toast';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const AdminApplications = () => {
  const [apps, setApps] = useState(ALL_APPLICATIONS);
  const [searchTerm, setSearchText] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);

  const filtered = useMemo(() => {
    return apps.filter(a => 
      (a.candidate?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (a.job?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (a.company?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
  }, [apps, searchTerm]);

  const handleDelete = (id, candidate) => {
    setApps(apps.filter(a => a.id !== id));
    toast.success(`Application for ${candidate} removed.`);
    setActiveMenu(null);
  };

  const handleStatusUpdate = (id, newStatus) => {
    setApps(apps.map(a => a.id === id ? { ...a, status: newStatus } : a));
    toast.success(`Application marked as ${newStatus}`);
    setActiveMenu(null);
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      className="space-y-6 pb-10 text-white"
      onClick={() => setActiveMenu(null)}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Application Tracking</h2>
          <p className="text-neutral-500 text-sm mt-1">Monitor {apps.length} candidates through the hiring pipeline.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <Search className="absolute left-3 text-neutral-500" size={16} />
            <input 
              type="text" 
              placeholder="Search applications..." 
              value={searchTerm}
              onChange={(e) => setSearchText(e.target.value)}
              className="bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-purple-600/50 w-full sm:w-64 text-white"
            />
          </div>
        </div>
      </div>

      <motion.div 
        variants={fadeInUp}
        className="bg-[#0f0f0f] border border-white/5 rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Candidate</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Job Position</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Company</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Applied Date</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {filtered.map((app) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={app.id} 
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-white text-sm font-bold">
                        <User size={14} className="text-neutral-500" />
                        {app.candidate}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-neutral-400 text-sm">
                        <FileText size={14} className="text-brand-purple-400" />
                        {app.job}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-neutral-400 text-sm">
                        <Building2 size={14} className="text-brand-gold-500" />
                        {app.company}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-neutral-500 text-xs font-medium">
                        <Calendar size={12} />
                        {app.date}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                        app.status === 'Shortlisted' ? 'bg-emerald-500/10 text-emerald-500' : 
                        app.status === 'Rejected' ? 'bg-red-500/10 text-red-500' : 
                        'bg-blue-500/10 text-blue-500'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === app.id ? null : app.id); }}
                        className="p-2 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>
                      
                      {activeMenu === app.id && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 py-1 overflow-hidden text-left">
                          {app.status !== 'Shortlisted' && (
                            <button 
                              onClick={() => handleStatusUpdate(app.id, 'Shortlisted')}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                            >
                              <CheckCircle2 size={14} />
                              Mark Shortlisted
                            </button>
                          )}
                          {app.status !== 'Rejected' && (
                            <button 
                              onClick={() => handleStatusUpdate(app.id, 'Rejected')}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                              <XCircle size={14} />
                              Mark Rejected
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(app.id, app.candidate)}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-neutral-400 hover:bg-white/5 transition-colors border-t border-white/5 mt-1"
                          >
                            <Trash2 size={14} />
                            Delete Record
                          </button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminApplications;
