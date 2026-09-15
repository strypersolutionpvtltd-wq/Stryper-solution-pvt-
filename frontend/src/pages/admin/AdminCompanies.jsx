import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MoreVertical, Building2, MapPin, Briefcase, ShieldCheck, Trash2, Edit2, ExternalLink, Eye, EyeOff, Loader2, Plus, X, Check } from 'lucide-react';
import { admin } from '@/utils/api';
import toast from 'react-hot-toast';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const AddCompanyModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({ companyName: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setForm({ companyName: '', email: '', password: '' });
      setShowPass(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.companyName.trim()) return toast.error('Company Name is required');
    if (!form.email.trim()) return toast.error('Work Email is required');
    if (!form.password || form.password.length < 6) return toast.error('Password must be at least 6 characters');

    setSubmitting(true);
    try {
      const res = await admin.createCompany({
        companyName: form.companyName.trim(),
        email: form.email.toLowerCase().trim(),
        password: form.password,
      });

      if (res.data?.success) {
        toast.success(`"${form.companyName.trim()}" added successfully!`);
        onSuccess();
        onClose();
      } else {
        toast.error(res.data?.message || 'Failed to add company');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create company');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl text-white"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-purple-500/10 border border-brand-purple-500/20 flex items-center justify-center text-brand-purple-400">
                <Building2 size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Add New Company</h3>
                <p className="text-xs text-neutral-400">Directly onboard company without OTP</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wide mb-1.5">
                Company Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Acme Innovations Pvt. Ltd."
                value={form.companyName}
                onChange={(e) => setForm(p => ({ ...p, companyName: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-purple-600/50 placeholder:text-neutral-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wide mb-1.5">
                Work Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                placeholder="hr@company.com"
                value={form.email}
                onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-purple-600/50 placeholder:text-neutral-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wide mb-1.5">
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Set company login password"
                  value={form.password}
                  onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-11 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-purple-600/50 placeholder:text-neutral-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">Minimum 6 characters. Company can change it later.</p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-brand-purple-600 hover:bg-brand-purple-700 text-white transition-all flex items-center gap-2 disabled:opacity-60"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                Add Company
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const AdminCompanies = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchText] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);
  const [filterPending, setFilterPending] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const [usersRes, jobsRes] = await Promise.all([
        admin.getAllUsers({ role: 'COMPANY', limit: 1000 }),
        admin.getAllJobs({ limit: 1000 })
      ]);

      if (usersRes.data?.success) {
        const mapped = (usersRes.data.users || []).map(u => {
          const profile = u.profileDetails || {};
          const activeJobsCount = (jobsRes.data?.jobs || []).filter(
            j => (j.companyId?._id === u._id || j.companyId === u._id) && j.status === 'Active'
          ).length;

          return {
            id: u._id,
            name: profile.companyName || u.name || 'N/A',
            employees: profile.companySize || 'N/A',
            industry: profile.industry || 'N/A',
            location: profile.location || 'N/A',
            jobs: activeJobsCount,
            status: profile.isVerifiedCompany ? 'Verified' : 'Pending'
          };
        });
        setCompanies(mapped);
      }
    } catch (error) {
      console.error("Failed to fetch companies:", error);
      toast.error("Failed to load company partners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const filtered = useMemo(() => {
    return companies.filter(c => 
      ((c.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (c.industry?.toLowerCase() || '').includes(searchTerm.toLowerCase())) &&
      (!filterPending || c.status === 'Pending')
    );
  }, [companies, searchTerm, filterPending]);

  const handleDelete = async (id, name) => {
    try {
      const res = await admin.deleteUser(id);
      if (res.data?.success) {
        setCompanies(companies.filter(c => c.id !== id));
        toast.success(`${name} has been removed from partners.`);
      } else {
        toast.error("Failed to remove partner");
      }
    } catch (error) {
      console.error("Delete partner error:", error);
      toast.error("Failed to remove partner");
    }
    setActiveMenu(null);
  };

  const handleVerify = async (id, name) => {
    try {
      const res = await admin.verifyCompany(id);
      if (res.data?.success) {
        setCompanies(companies.map(c => c.id === id ? { ...c, status: 'Verified' } : c));
        toast.success(`${name} is now a verified partner!`);
      } else {
        toast.error("Failed to verify company");
      }
    } catch (error) {
      console.error("Verify company error:", error);
      toast.error("Failed to verify company");
    }
    setActiveMenu(null);
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      className="space-y-6 pb-10"
      onClick={() => setActiveMenu(null)}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Company Partners</h2>
          <p className="text-neutral-500 text-sm mt-1">Manage and verify {companies.length} company profiles.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <Search className="absolute left-3 text-neutral-500" size={16} />
            <input 
              type="text" 
              placeholder="Search companies..." 
              value={searchTerm}
              onChange={(e) => setSearchText(e.target.value)}
              className="bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-purple-600/50 w-full sm:w-64 text-white"
            />
          </div>
          <button 
            onClick={() => setFilterPending(!filterPending)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all whitespace-nowrap ${filterPending ? 'bg-orange-600 hover:bg-orange-700' : 'bg-white/10 hover:bg-white/15 text-neutral-200'}`}
          >
            {filterPending ? 'Show All' : 'Pending Only'}
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all whitespace-nowrap bg-brand-purple-600 hover:bg-brand-purple-700 shadow-lg shadow-brand-purple-600/20"
          >
            <Plus size={16} /> Add Company
          </button>
        </div>
      </div>

      <motion.div 
        variants={fadeInUp}
        className="bg-[#0f0f0f] border border-white/5 rounded-2xl min-h-[300px] pb-12"
      >
        <div className="overflow-visible text-white">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Company</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Industry</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Location</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Jobs</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-neutral-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 size={32} className="animate-spin text-brand-purple-600" />
                      <p className="text-xs font-bold text-white uppercase tracking-widest">Loading Partners...</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  <AnimatePresence>
                    {filtered.map((company) => (
                      <motion.tr 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -20 }}
                        key={company.id} 
                        className="group hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white border border-white/5">
                              <Building2 size={20} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">{company.name}</p>
                              <p className="text-[11px] text-neutral-500 mt-0.5">{company.employees} employees</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-400">{company.industry}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-neutral-400 text-xs">
                            <MapPin size={12} />
                            {company.location}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-brand-purple-400 text-xs font-bold">
                            <Briefcase size={12} />
                            {company.jobs} Active
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 w-fit ${company.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>
                            {company.status === 'Verified' && <ShieldCheck size={10} />}
                            {company.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right relative">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={(e) => { e.stopPropagation(); navigate(`/admin/users/${company.id}`); }}
                              className="p-2 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white transition-colors"
                            >
                              <ExternalLink size={16} />
                            </button>
                            <div className="relative">
                              <button 
                                onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === company.id ? null : company.id); }}
                                className="p-2 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white transition-colors"
                              >
                                <MoreVertical size={16} />
                              </button>
                              
                              {activeMenu === company.id && (
                                <div 
                                  onClick={(e) => e.stopPropagation()}
                                  className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 py-1 overflow-hidden text-left"
                                >
                                  <button 
                                    onClick={() => navigate(`/admin/users/${company.id}`)}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-brand-purple-400 hover:bg-white/5 transition-colors"
                                  >
                                    <Eye size={14} />
                                    View Profile
                                  </button>
                                  <button 
                                    onClick={() => navigate(`/admin/users/${company.id}`, { state: { openEdit: true } })}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-neutral-300 hover:bg-white/5 transition-colors"
                                  >
                                    <Edit2 size={14} />
                                    Edit Profile
                                  </button>
                                  {company.status !== 'Verified' && (
                                    <button 
                                      onClick={() => handleVerify(company.id, company.name)}
                                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                                    >
                                      <ShieldCheck size={14} />
                                      Verify Company
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => handleDelete(company.id, company.name)}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                                  >
                                    <Trash2 size={14} />
                                    Remove Partner
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-20 text-center text-neutral-500 text-sm">
                        No companies found matching "{searchTerm}"
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add Company Modal */}
      <AddCompanyModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onSuccess={fetchCompanies} 
      />
    </motion.div>
  );
};

export default AdminCompanies;
