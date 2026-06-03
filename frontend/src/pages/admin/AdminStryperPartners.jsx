import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MoreVertical, Briefcase, Star, UserCheck, ShieldCheck, Trash2, Edit2, ShieldAlert } from 'lucide-react';
import { ALL_STRYPER_PARTNERS } from '@/data/adminData';
import toast from 'react-hot-toast';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const AdminConsultants = () => {
  const [partners, setPartners] = useState(ALL_STRYPER_PARTNERS);
  const [searchTerm, setSearchText] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);

  const filtered = useMemo(() => {
    return partners.filter(p => 
      (p.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (p.specialty?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
  }, [partners, searchTerm]);

  const handleDelete = (id, name) => {
    setPartners(partners.filter(p => p.id !== id));
    toast.success(`${name} has been removed from Stryper Partners.`);
    setActiveMenu(null);
  };

  const handleStatusUpdate = (id, name, currentStatus) => {
    const nextStatus = currentStatus === 'Verified' ? 'Active' : 'Verified';
    setPartners(partners.map(p => p.id === id ? { ...p, status: nextStatus } : p));
    toast.success(`${name} status updated to ${nextStatus}`);
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
          <h2 className="text-2xl font-bold text-white tracking-tight">Stryper Partner Management</h2>
          <p className="text-neutral-500 text-sm mt-1">Manage {partners.length} recruitment partners and Stryper Partners.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <Search className="absolute left-3 text-neutral-500" size={16} />
            <input 
              type="text" 
              placeholder="Search partners..." 
              value={searchTerm}
              onChange={(e) => setSearchText(e.target.value)}
              className="bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-purple-600/50 w-full sm:w-64 text-white"
            />
          </div>
          <button 
            onClick={() => toast.success('Add Partner modal opened (Mock)')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-purple-600 text-white text-sm font-semibold hover:bg-brand-purple-700 transition-all whitespace-nowrap"
          >
            Add Partner
          </button>
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
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Stryper Partner / Agency</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Specialty</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Experience</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Active Hires</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Rating</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {filtered.map((con) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={con.id} 
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-purple-600/10 flex items-center justify-center text-brand-purple-500 font-bold border border-brand-purple-600/20">
                          {con.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{con.name}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${con.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>
                              {con.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-400">{con.specialty}</td>
                    <td className="px-6 py-4 text-sm text-neutral-500">{con.experience}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-white text-xs font-bold">
                        <UserCheck size={14} className="text-brand-purple-400" />
                        {con.activeHires}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-brand-gold-500 text-xs font-bold">
                        <Star size={14} fill="currentColor" />
                        {con.rating}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === con.id ? null : con.id); }}
                        className="p-2 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>
                      
                      {activeMenu === con.id && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 py-1 overflow-hidden text-left">
                          <button 
                            onClick={() => toast.success(`Editing profile for ${con.name}`)}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-neutral-300 hover:bg-white/5 transition-colors"
                          >
                            <Edit2 size={14} />
                            Edit Details
                          </button>
                          
                          <button 
                            onClick={() => handleStatusUpdate(con.id, con.name, con.status)}
                            className={`w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium transition-colors ${con.status === 'Verified' ? 'text-orange-400 hover:bg-orange-500/10' : 'text-emerald-400 hover:bg-emerald-500/10'}`}
                          >
                            {con.status === 'Verified' ? <ShieldAlert size={14} /> : <ShieldCheck size={14} />}
                            {con.status === 'Verified' ? 'Revoke Verification' : 'Verify Partner'}
                          </button>
                          
                          <button 
                            onClick={() => handleDelete(con.id, con.name)}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors border-t border-white/5 mt-1"
                          >
                            <Trash2 size={14} />
                            Remove Partner
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

export default AdminConsultants;
