import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { companyProfile, jobs, jobApplications } from '@/utils/api';
import SectionHeader from '@/hire-zone/components/shared/SectionHeader';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-800 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all';

const CompanyProfile = () => {
  const { updateUserData } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    companyName: '',
    industry: '',
    companySize: '',
    website: '',
    location: '',
    founded: '',
    companyDescription: '',
    email: '',
    phone: '',
    linkedin: '',
  });
  
  const [stats, setStats] = useState({
    jobsPosted: '0',
    hiresMade: '0',
    avgRating: '0.0★',
    responseRate: '100%',
  });

  const [loading, setLoading] = useState(true);

  const fetchProfileAndStats = async () => {
    try {
      setLoading(true);
      // Get user from localStorage
      const user = JSON.parse(localStorage.getItem('stryper_user') || '{}');

      const [profileRes, jobsRes, appsRes] = await Promise.all([
        companyProfile.getMe().catch(() => ({ data: { success: false } })),
        jobs.getMyJobs().catch(() => ({ data: { success: false, jobs: [] } })),
        jobApplications.getCompanyApplicants().catch(() => ({ data: { success: false, applications: [] } }))
      ]);

      const profileData = profileRes.data?.companyProfile || profileRes.data?.company || {};
      
      const companyNameVal = profileData.companyName || user.name || '';
      setForm({
        companyName: companyNameVal,
        industry: profileData.industry || '',
        companySize: profileData.companySize || '',
        website: profileData.website || '',
        location: profileData.location || '',
        founded: profileData.foundedYear || profileData.founded || '',
        companyDescription: profileData.companyDescription || '',
        email: profileData.email || user.email || '',
        phone: profileData.phone || '',
        linkedin: profileData.linkedin || '',
      });

      if (companyNameVal) {
        updateUserData({ name: companyNameVal, companyName: companyNameVal });
      }

      // Compute Stats
      const myJobs = jobsRes.data?.jobs || [];
      const myApps = appsRes.data?.applications || [];

      const jobsPosted = myJobs.length.toString();
      const hiresMade = myApps.filter(a => ['Accepted', 'Shortlisted'].includes(a.status)).length.toString();
      
      const ratingVal = profileData.partnerRating || 0;
      const avgRating = ratingVal > 0 ? `${ratingVal.toFixed(1)}★` : 'N/A';

      const totalApps = myApps.length;
      const processedApps = myApps.filter(a => a.status !== 'Applied').length;
      const responseRate = totalApps > 0 ? `${Math.round((processedApps / totalApps) * 100)}%` : '100%';

      setStats({
        jobsPosted,
        hiresMade,
        avgRating,
        responseRate,
      });

    } catch (error) {
      console.error('Failed to fetch company profile and stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndStats();
  }, []);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    try {
      const dataToSave = {
        ...form,
        foundedYear: parseInt(form.founded) || null,
      };

      try {
        await companyProfile.update(dataToSave);
      } catch (e) {
        await companyProfile.create(dataToSave);
      }
      
      updateUserData({ name: form.companyName, companyName: form.companyName });
      setEditing(false);
      toast.success('Company profile updated successfully!');
      fetchProfileAndStats();
    } catch (error) {
      console.error('Failed to save company profile:', error);
      toast.error('Failed to save company profile');
    }
  };

  const handleCancel = () => {
    fetchProfileAndStats();
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
        <Loader2 size={40} className="animate-spin text-purple-600" />
        <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest animate-pulse">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between mb-6">
          <SectionHeader title="Company Profile" subtitle="Manage your company's public information." />
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold shrink-0 transition-colors shadow-sm"
              style={{ color: '#8B3A8F', background: '#f3e8f4' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2 shrink-0">
              <button onClick={handleCancel} className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors">
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors shadow-sm"
                style={{ background: '#8B3A8F' }}
              >
                Save Changes
              </motion.button>
            </div>
          )}
        </div>

        {/* Header card */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-6 mb-5">
          <div className="flex items-center gap-5">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shrink-0 shadow-sm"
              style={{ background: 'linear-gradient(135deg, #8B3A8F, #6d2b71)' }}
            >
              {form.companyName ? form.companyName.charAt(0) : '?'}
            </div>
            <div className="flex-1 min-w-0">
              {editing ? (
                <input value={form.companyName} onChange={e => set('companyName', e.target.value)} className={`${inputCls} text-lg font-bold mb-2`} />
              ) : (
                <h2 className="text-xl font-bold text-neutral-900">{form.companyName || 'N/A'}</h2>
              )}
              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-neutral-500">
                <span className="flex items-center gap-1">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>
                  {form.industry || 'Industry N/A'}
                </span>
                <span className="flex items-center gap-1">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                  {form.companySize || 'Size N/A'}
                </span>
                <span className="flex items-center gap-1">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {form.location || 'Location N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-neutral-50">
            {[
              { label: 'Jobs Posted', value: stats.jobsPosted },
              { label: 'Hires Made', value: stats.hiresMade },
              { label: 'Avg. Rating', value: stats.avgRating },
              { label: 'Response Rate', value: stats.responseRate },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-xl font-bold text-neutral-900">{value}</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Basic info */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-6 space-y-4">
            <h3 className="text-sm font-bold text-neutral-800">Company Details</h3>
            {[
              { label: 'Industry',  key: 'industry' },
              { label: 'Company Size', key: 'companySize' },
              { label: 'Founded',   key: 'founded' },
              { label: 'Location',  key: 'location' },
              { label: 'Website',   key: 'website' },
            ].map(({ label, key }) => (
              <div key={key}>
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">{label}</p>
                {editing ? (
                  <input value={form[key]} onChange={e => set(key, e.target.value)} className={inputCls} />
                ) : (
                  <p className="text-sm text-neutral-700">{form[key] || 'N/A'}</p>
                )}
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-6 space-y-4">
            <h3 className="text-sm font-bold text-neutral-800">Contact Information</h3>
            {[
              { label: 'Email',    key: 'email' },
              { label: 'Phone',    key: 'phone' },
              { label: 'LinkedIn', key: 'linkedin' },
            ].map(({ label, key }) => (
              <div key={key}>
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">{label}</p>
                {editing ? (
                  <input value={form[key]} onChange={e => set(key, e.target.value)} className={inputCls} />
                ) : (
                  <p className="text-sm text-neutral-700">{form[key] || 'N/A'}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-6">
          <h3 className="text-sm font-bold text-neutral-800 mb-3">About Company</h3>
          {editing ? (
            <textarea
              rows={5}
              value={form.companyDescription}
              onChange={e => set('companyDescription', e.target.value)}
              className={`${inputCls} resize-none leading-relaxed`}
            />
          ) : (
            <p className="text-sm text-neutral-600 leading-relaxed">{form.companyDescription || 'No description provided.'}</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CompanyProfile;
