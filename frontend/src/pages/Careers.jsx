import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageHero from '@/components/shared/PageHero';
import img4 from '@/assets/image/4.jpeg';
import { fadeInUp, staggerContainer, viewportOnce } from '@/utils/animations';
import { jobs as jobsApi, upload } from '@/utils/api';
import toast from 'react-hot-toast';

const P = '#8B3A8F';
const G = '#F5A623';

const STRATEGY = [
  { title: 'Career Advancement', desc: 'We map out your career path with our partner industries for long-term growth.', icon: '🚀' },
  { title: 'Deployment & Support', desc: 'From document verification to site onboarding, we handle the heavy lifting.', icon: '🤝' },
  { title: 'Skill Development', desc: 'Regular training sessions to keep you relevant in the changing job market.', icon: '📚' }
];

const STEPS = [
  { s: 1, t: 'Registration', d: 'Upload your details to our candidate pool.' },
  { s: 2, t: 'Skill Assessment', d: 'Our experts evaluate your profile and skills.' },
  { s: 3, t: 'Match-Making', d: 'We find the perfect client company for your role.' },
  { s: 4, t: 'Deployment', d: 'Get placed with full legal and salary support.' },
];

/* ── Apply Modal ── */
const ApplyModal = ({ job, onClose }) => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', coverLetter: '' });
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleFile = (e) => setResumeFile(e.target.files[0] || null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      toast.error('Please fill all required fields');
      return;
    }
    setSubmitting(true);
    try {
      let resumeUrl = '';
      if (resumeFile) {
        setUploading(true);
        const fd = new FormData();
        fd.append('resume', resumeFile);
        const upRes = await upload.uploadResume(fd);
        resumeUrl = upRes.data?.url || upRes.data?.resume || '';
        setUploading(false);
      }
      await jobsApi.applyStryperJob({
        jobId: job._id,
        name: form.name,
        email: form.email,
        phone: form.phone,
        coverLetter: form.coverLetter,
        resumeUrl,
      });
      setDone(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-neutral-900/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden z-10 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-neutral-900">Apply for this Role</h3>
            <p className="text-sm text-neutral-500 mt-0.5">{job.title}</p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 transition-colors p-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {done ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-14 px-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-green-600">✓</div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Application Sent!</h3>
              <p className="text-sm text-neutral-500">Our HR team will review your profile and reach out soon.</p>
              <button onClick={onClose} className="mt-6 px-6 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: P }}>Close</button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wide mb-1 block">Full Name *</label>
                  <input required value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} placeholder="Your full name" className="w-full px-4 py-3 rounded-xl bg-neutral-50 text-sm outline-none focus:ring-2 focus:ring-purple-200 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wide mb-1 block">Phone *</label>
                  <input required value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))} placeholder="+91 98765 43210" className="w-full px-4 py-3 rounded-xl bg-neutral-50 text-sm outline-none focus:ring-2 focus:ring-purple-200 transition-all" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wide mb-1 block">Email Address *</label>
                <input required type="email" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} placeholder="you@email.com" className="w-full px-4 py-3 rounded-xl bg-neutral-50 text-sm outline-none focus:ring-2 focus:ring-purple-200 transition-all" />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wide mb-1 block">Cover Letter (optional)</label>
                <textarea rows={3} value={form.coverLetter} onChange={e => setForm(p => ({...p, coverLetter: e.target.value}))} placeholder="Why are you a great fit?" className="w-full px-4 py-3 rounded-xl bg-neutral-50 text-sm outline-none focus:ring-2 focus:ring-purple-200 transition-all resize-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wide mb-1 block">Resume (optional)</label>
                <label className={`flex flex-col items-center justify-center w-full py-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${resumeFile ? 'border-green-200 bg-green-50/30' : 'border-neutral-200 hover:bg-neutral-50'}`}>
                  <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFile} />
                  {resumeFile ? (
                    <><span className="text-xl mb-1">📄</span><p className="text-xs text-green-700 font-bold">{resumeFile.name}</p><p className="text-[10px] text-green-500 mt-0.5">Click to change</p></>
                  ) : (
                    <><span className="text-xl mb-1">☁️</span><p className="text-xs text-neutral-400 font-medium">Upload Resume / CV</p><p className="text-[10px] text-neutral-300 mt-0.5 uppercase tracking-widest font-bold">PDF, DOC, DOCX</p></>
                  )}
                </label>
              </div>
              <button type="submit" disabled={submitting} className="w-full py-4 rounded-xl text-white font-bold shadow-lg shadow-purple-200 transition-all disabled:opacity-60 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2" style={{ background: P }}>
                {submitting ? (uploading ? 'Uploading Resume...' : 'Submitting...') : 'Submit Application'}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

/* ── Role Detail Modal ── */
const RoleDetailModal = ({ job, onClose, onApply }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" onClick={onClose} />
    <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden z-10 max-h-[90vh] flex flex-col">
      <div className="p-8 border-b border-neutral-100 flex justify-between items-start">
        <div>
          <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-brand-purple-50 text-brand-purple-600 uppercase mb-2 inline-block">{job.employmentType || 'Full-Time'}</span>
          <h3 className="text-xl font-bold text-neutral-900">{job.title}</h3>
          <p className="text-sm text-neutral-500 mt-1">{job.location || 'Remote'} {job.experience ? `• ${job.experience}` : ''}</p>
        </div>
        <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div className="p-8 space-y-6 overflow-y-auto flex-1">
        {job.description && (
          <section>
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">About This Role</h4>
            <p className="text-sm text-neutral-600 leading-relaxed">{job.description}</p>
          </section>
        )}
        {job.requirements?.length > 0 && (
          <section>
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">Requirements</h4>
            <ul className="text-sm text-neutral-600 space-y-2 list-disc pl-4">
              {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </section>
        )}
        {job.skills?.length > 0 && (
          <section>
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((s, i) => (
                <span key={i} className="text-xs font-bold px-3 py-1 rounded-full bg-brand-purple-50 text-brand-purple-600">{s}</span>
              ))}
            </div>
          </section>
        )}
      </div>
      <div className="p-8 pt-0">
        <button onClick={onApply} className="w-full flex items-center justify-center py-4 rounded-2xl text-white font-bold shadow-lg shadow-purple-200 transition-transform active:scale-95" style={{ background: P }}>
          Apply for this Role
        </button>
      </div>
    </motion.div>
  </div>
);

function Careers() {
  const [activeTab, setActiveTab] = useState('candidate');
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyingJob, setApplyingJob] = useState(null);
  const [stryperJobs, setStryperJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [resume, setResume] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', roleType: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    jobsApi.getStryperJobs()
      .then(res => { if (res.data?.success) setStryperJobs(res.data.jobs || []); })
      .catch(() => {})
      .finally(() => setJobsLoading(false));
  }, []);

  const scrollToApply = () => {
    document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      // Simulating upload
      setTimeout(() => {
        setResume(file);
        setUploading(false);
      }, 1500);
    }
  };

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <>
      <PageHero 
        title="Your Career Partner" 
        subtitle="Stryper Solution connects talent with India's top industries. Whether you're looking for a job or want to join our core team, we've got you covered." 
        breadcrumb="Careers" 
        image={img4}
      />

      {/* ── Selection Section (The "Dual Path") ── */}
      <section className="py-16 bg-white">
        <div className="container-base">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 text-center mb-6">Choose Your Path</h2>
            <div className="flex bg-neutral-100 p-1.5 rounded-2xl w-full max-w-md shadow-inner">
              <button 
                onClick={() => setActiveTab('candidate')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'candidate' ? 'bg-white text-brand-purple-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
              >
                I want a Job
              </button>
              <button 
                onClick={() => setActiveTab('corporate')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'corporate' ? 'bg-white text-brand-purple-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
              >
                Join Stryper Core Team
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'candidate' ? (
              <motion.div
                key="candidate"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="grid lg:grid-cols-2 gap-12 items-center"
              >
                <div>
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full mb-4 inline-block">Workforce Solutions</span>
                  <h3 className="text-4xl font-bold text-neutral-900 leading-tight mb-6">
                    Let Us Help You Find <span style={{ color: P }}>The Right Opportunity</span>
                  </h3>
                  <p className="text-neutral-600 mb-8 leading-relaxed">
                    Stryper Solution works as an intermediary between top employers and skilled candidates. We don't just find you a job; we ensure you are deployed safely, paid on time, and supported throughout your career journey.
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    {STRATEGY.map(item => (
                      <div key={item.title} className="flex gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <h4 className="font-bold text-neutral-800 text-sm">{item.title}</h4>
                          <p className="text-xs text-neutral-500 mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link to="/jobs" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-bold transition-transform hover:scale-105" style={{ background: P }}>
                    Browse Available Jobs
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </Link>
                </div>
                <div className="relative">
                  <div className="bg-neutral-100 aspect-square rounded-[3rem] overflow-hidden rotate-3 shadow-2xl">
                    <img src={img4} alt="Candidate Support" className="w-full h-full object-cover -rotate-3 scale-110" />
                  </div>
                  <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl border border-neutral-100 max-w-[200px]">
                    <p className="text-3xl font-bold text-neutral-900 mb-1">5000+</p>
                    <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Candidates Placed Annually</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="corporate"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-12"
              >
                <div className="max-w-3xl mx-auto text-center">
                  <span className="text-xs font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full mb-4 inline-block">Internal Careers</span>
                  <h3 className="text-4xl font-bold text-neutral-900 leading-tight mb-6">
                    Build Your Career <span style={{ color: P }}>At Stryper HQ</span>
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    Join the team that drives workforce innovation in India. We're looking for leaders in HR, Sales, Operations, and Technology to help us grow Stryper Solution to new heights.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {jobsLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm animate-pulse">
                        <div className="h-4 bg-neutral-100 rounded w-1/2 mb-4" />
                        <div className="h-5 bg-neutral-200 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-neutral-100 rounded w-1/2 mb-6" />
                        <div className="h-9 bg-neutral-100 rounded-xl" />
                      </div>
                    ))
                  ) : stryperJobs.length === 0 ? (
                    <div className="col-span-3 text-center py-12 text-neutral-400 text-sm">
                      No openings right now. Check back soon!
                    </div>
                  ) : stryperJobs.map(job => (
                    <div key={job._id} className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 uppercase">{job.employmentType || 'Full-Time'}</span>
                        <span className="text-[10px] font-bold text-neutral-400">{job.experience || ''}</span>
                      </div>
                      <h4 className="font-bold text-neutral-900 mb-1">{job.title}</h4>
                      <p className="text-xs text-neutral-500 mb-4">{job.location || 'Remote'}{job.department ? ` • ${job.department}` : ''}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedJob(job)}
                          className="flex-1 py-2.5 rounded-xl text-xs font-bold text-brand-purple-600 border border-brand-purple-100 hover:bg-brand-purple-50 transition-colors"
                        >
                          View Role
                        </button>
                        <button
                          onClick={() => setApplyingJob(job)}
                          className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white transition-colors"
                          style={{ background: P }}
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-neutral-900 rounded-[3rem] p-10 text-center text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <h4 className="text-2xl font-bold mb-4">Ready to lead with us?</h4>
                    <p className="text-white/60 text-sm mb-8 max-w-md mx-auto">We're always looking for exceptional talent. If you don't see a fit, send us your resume anyway.</p>
                    <button 
                      onClick={scrollToApply}
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-neutral-900 font-bold hover:bg-neutral-100 transition-colors text-sm"
                    >
                      Submit General Application
                    </button>
                  </div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 blur-[100px] rounded-full" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── How it Works (Intermediate Process) ── */}
      <section className="py-20 bg-neutral-50 border-y border-neutral-100">
        <div className="container-base">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Our Placement Process</h2>
            <p className="text-sm text-neutral-500">Transparent, fast, and supportive. Here is how we get you from application to your first day at work.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step) => (
              <div key={step.s} className="relative group">
                <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-xl transition-all h-full">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl font-bold mb-6 group-hover:scale-110 transition-transform" style={{ background: step.s % 2 === 0 ? G : P }}>
                    {step.s}
                  </div>
                  <h3 className="font-bold text-neutral-900 mb-3">{step.t}</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">{step.d}</p>
                </div>
                {step.s < 4 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-[2px] bg-neutral-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Unified Application Section ── */}
      <section id="apply" className="py-24 bg-white overflow-hidden">
        <div className="container-base">
          <div className="max-w-5xl mx-auto">
            <div className="bg-neutral-50 rounded-[3rem] p-8 lg:p-16 relative overflow-hidden border border-neutral-100">
              <div className="grid lg:grid-cols-2 gap-12 relative z-10">
                <div>
                  <h2 className="text-4xl font-bold text-neutral-900 mb-6 leading-tight">Start Your <span style={{ color: P }}>Success Story</span></h2>
                  <p className="text-neutral-500 mb-8">Whether it's for an external industry role or an internal corporate position, fill out this form and we'll route it to the right team.</p>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">✨</div>
                      <p className="text-xs text-neutral-600 font-medium">Free application and assessment for all candidates.</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">⚡</div>
                      <p className="text-xs text-neutral-600 font-medium">Fast-track recruitment through our pan-India network.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] shadow-2xl shadow-purple-900/5">
                  {submitted ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl text-green-600">✓</div>
                      <h3 className="text-2xl font-bold text-neutral-900 mb-2">Application Sent!</h3>
                      <p className="text-sm text-neutral-500">Thank you for applying. Our HR team will review your profile and contact you soon.</p>
                      <button onClick={() => setSubmitted(false)} className="mt-6 text-brand-purple-600 font-bold text-sm hover:underline">Submit another application</button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <input type="text" name="name" required placeholder="Full Name" value={form.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-neutral-50 border-none text-sm outline-none focus:ring-2 focus:ring-purple-200 transition-all" />
                        <input type="tel" name="phone" required placeholder="Phone Number" value={form.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-neutral-50 border-none text-sm outline-none focus:ring-2 focus:ring-purple-200 transition-all" />
                      </div>
                      <input type="email" name="email" required placeholder="Email Address" value={form.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-neutral-50 border-none text-sm outline-none focus:ring-2 focus:ring-purple-200 transition-all" />
                      <select name="roleType" required value={form.roleType} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-neutral-50 border-none text-sm outline-none focus:ring-2 focus:ring-purple-200 transition-all appearance-none">
                        <option value="" disabled>Preferred Role Type</option>
                        <option value="Client">Client / Industry Job</option>
                        <option value="Stryper">Stryper Corporate Role</option>
                      </select>
                      
                      <div className="relative">
                        <input 
                          type="file" 
                          id="resume-upload" 
                          className="hidden" 
                          accept=".pdf,.doc,.docx" 
                          onChange={handleFileUpload}
                          disabled={uploading}
                        />
                        <label 
                          htmlFor="resume-upload"
                          className={`flex flex-col items-center justify-center w-full py-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
                            resume ? 'border-green-200 bg-green-50/30' : 
                            uploading ? 'border-purple-200 bg-purple-50/30' :
                            'border-neutral-100 hover:bg-neutral-50'
                          }`}
                        >
                          {uploading ? (
                            <div className="flex flex-col items-center">
                              <div className="w-6 h-6 border-2 border-brand-purple-600 border-t-transparent rounded-full animate-spin mb-2" />
                              <p className="text-xs text-brand-purple-600 font-bold">Uploading Resume...</p>
                            </div>
                          ) : resume ? (
                            <div className="flex flex-col items-center">
                              <span className="text-2xl mb-1">📄</span>
                              <p className="text-xs text-green-700 font-bold">{resume.name}</p>
                              <p className="text-[10px] text-green-500 mt-0.5">Click to change</p>
                            </div>
                          ) : (
                            <>
                              <span className="text-2xl mb-2">☁️</span>
                              <p className="text-xs text-neutral-400 font-medium">Click to upload Resume / CV</p>
                              <p className="text-[10px] text-neutral-300 mt-1 uppercase tracking-widest font-bold">PDF, DOC, DOCX</p>
                            </>
                          )}
                        </label>
                      </div>

                      <button 
                        type="submit"
                        disabled={uploading}
                        className={`w-full py-4 rounded-xl text-white font-bold shadow-lg shadow-purple-200 transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-95'}`} 
                        style={{ background: P }}
                      >
                        Submit Application
                      </button>
                    </form>
                  )}
                </div>
              </div>
              
              {/* Decorative blobs */}
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-purple-100 rounded-full blur-[100px] opacity-50" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-100 rounded-full blur-[100px] opacity-50" />
            </div>
          </div>
        </div>
      </section>

      {/* Role Modal */}
      <AnimatePresence>
        {selectedJob && (
          <RoleDetailModal
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
            onApply={() => { setApplyingJob(selectedJob); setSelectedJob(null); }}
          />
        )}
      </AnimatePresence>

      {/* Apply Modal */}
      <AnimatePresence>
        {applyingJob && (
          <ApplyModal
            job={applyingJob}
            onClose={() => setApplyingJob(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default Careers;
