import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Briefcase, Star, UserCheck, ShieldCheck, Trash2, Edit2, ShieldAlert, Eye, X, Save } from 'lucide-react';
import { ALL_STRYPER_PARTNERS } from '@/data/adminData';
import toast from 'react-hot-toast';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const AddPartnerModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({ 
    name: '', 
    specialty: '', 
    experience: '', 
    activeHires: 0,
    rating: 5.0,
    status: 'Verified' 
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-[#0f0f0f] border border-white/10 rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden text-white flex flex-col">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-bold text-lg">Add New Stryper Partner</h3>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full"><X size={20}/></button>
            </div>
            <div className="p-8 space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase">Partner / Agency Name</label>
                <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none" placeholder="e.g. ProHire Advisors" />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase">Specialty</label>
                <input value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none" placeholder="e.g. Healthcare, IT" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase">Experience</label>
                  <input value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none" placeholder="e.g. 5 years" />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase">Rating</label>
                  <input type="number" step="0.1" max="5" value={formData.rating} onChange={e => setFormData({...formData, rating: parseFloat(e.target.value)})} className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none" />
                </div>
              </div>
            </div>
            <div className="p-6 bg-white/5 flex gap-3 justify-end">
              <button onClick={onClose} className="px-6 py-2 rounded-xl text-sm font-bold text-neutral-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={() => { onSave(formData); onClose(); }} className="px-6 py-2 rounded-xl bg-brand-purple-600 text-white text-sm font-bold hover:bg-brand-purple-700 transition-all flex items-center gap-2">
                <Save size={16}/> Add Partner
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const AdminStryperPartners = () => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState(ALL_STRYPER_PARTNERS);
  const [searchTerm, setSearchText] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddPartner = (newPartner) => {
    const partnerWithId = {
      ...newPartner,
      id: `PART${Date.now()}`,
    };
    setPartners([partnerWithId, ...partners]);
    toast.success(`${newPartner.name} has been added as a partner!`);
  };

  const filtered = useMemo(() => {
    return partners.filter(p => 
      (p.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (p.specialty?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
  }, [partners, searchTerm]);

  const handleDelete = (id, name) => {
    setPartners(partners.filter(p => p.id !== id));
    toast.success(`${name} has been removed from Stryper Partners.`);
  };

  const handleStatusUpdate = (id, name, currentStatus) => {
    const nextStatus = currentStatus === 'Verified' ? 'Active' : 'Verified';
    setPartners(partners.map(p => p.id === id ? { ...p, status: nextStatus } : p));
    toast.success(`${name} status updated to ${nextStatus}`);
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      className="space-y-6 pb-10 text-white"
    >
      <AddPartnerModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={handleAddPartner} 
      />

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
            onClick={() => setIsAddModalOpen(true)}
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
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigate(`/admin/users/${con.id}`); }}
                          title="View Profile"
                          className="p-2 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                        
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleStatusUpdate(con.id, con.name, con.status); }}
                          title={con.status === 'Verified' ? 'Revoke Verification' : 'Verify Partner'}
                          className={`p-2 rounded-lg hover:bg-white/5 transition-colors ${con.status === 'Verified' ? 'text-orange-400 hover:text-orange-500' : 'text-emerald-400 hover:text-emerald-500'}`}
                        >
                          {con.status === 'Verified' ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
                        </button>

                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(con.id, con.name); }}
                          title="Remove Partner"
                          className="p-2 rounded-lg hover:bg-red-500/10 text-neutral-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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

export default AdminStryperPartners;
