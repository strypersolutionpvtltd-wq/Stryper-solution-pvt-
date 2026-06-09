import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const ResumePreviewModal = ({ candidate, onClose }) => {
  if (!candidate) return null;

  const handleShare = async () => {
    const profileLink = `${window.location.origin}/hire-zone/applicants?id=${candidate.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${candidate.name} - Profile`,
          text: `Check out ${candidate.name}'s profile for the ${candidate.appliedRole} position.`,
          url: profileLink,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          toast.error('Could not share profile');
        }
      }
    } else {
      navigator.clipboard.writeText(profileLink).then(() => {
        toast.success('Profile link copied to clipboard!');
      }).catch(() => {
        toast.error('Failed to copy link');
      });
    }
  };

  const handleDownload = () => {
    toast.success(`Downloading ${candidate.name}'s resume...`);
    const blob = new Blob(['Resume content for ' + candidate.name], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${candidate.name.replace(/\s+/g, '_')}_Resume.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-[60] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          <div className="px-8 py-5 border-b border-neutral-100 flex items-center justify-between shrink-0 bg-neutral-50/50">
            <div>
              <h3 className="text-lg font-bold text-neutral-900">Resume Preview</h3>
              <p className="text-xs text-neutral-500 mt-0.5">{candidate.name} — {candidate.appliedRole}</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-400 hover:bg-white hover:text-neutral-700 transition-all shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            <div className="flex items-start gap-6 border-b border-neutral-100 pb-8">
              <div className="w-20 h-20 rounded-2xl bg-brand-purple-600 flex items-center justify-center text-white text-3xl font-bold shrink-0 shadow-lg shadow-purple-200">
                {candidate.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-black text-neutral-900">{candidate.name}</h1>
                <p className="text-brand-purple-600 font-bold text-lg mt-1">{candidate.appliedRole}</p>
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-neutral-500 font-medium">
                  <span className="flex items-center gap-1.5">📧 {candidate.email}</span>
                  <span className="flex items-center gap-1.5">📞 {candidate.phone}</span>
                  <span className="flex items-center gap-1.5">📍 {candidate.location}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div className="col-span-2 space-y-8">
                <section>
                  <h4 className="text-sm font-black text-neutral-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-brand-purple-600 rounded-full" />
                    Professional Summary
                  </h4>
                  <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                    Results-driven {candidate.appliedRole} with {candidate.experience} of experience. 
                    Proven track record of delivering high-quality solutions and leading successful projects.
                    Expertise in {candidate.skills.slice(0, 3).join(', ')} and modern development methodologies.
                  </p>
                </section>

                <section>
                  <h4 className="text-sm font-black text-neutral-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-brand-purple-600 rounded-full" />
                    Experience
                  </h4>
                  <div className="space-y-6">
                    {[1, 2].map(i => (
                      <div key={i} className="relative pl-6 border-l-2 border-neutral-100">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-brand-purple-600" />
                        <div className="flex justify-between items-start mb-1">
                          <h5 className="font-bold text-neutral-800 text-sm">Senior {candidate.appliedRole}</h5>
                          <span className="text-[10px] font-bold text-neutral-400">202{3-i} — Present</span>
                        </div>
                        <p className="text-xs text-brand-purple-600 font-bold mb-2">Global Tech Solutions Inc.</p>
                        <ul className="text-xs text-neutral-500 space-y-1.5 list-disc pl-4">
                          <li>Developed and maintained complex systems using {candidate.skills[0]}.</li>
                          <li>Collaborated with cross-functional teams to define project requirements.</li>
                          <li>Improved system performance by 40% through code optimization.</li>
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="space-y-8">
                <section className="bg-neutral-50 rounded-3xl p-6">
                  <h4 className="text-xs font-black text-neutral-900 uppercase tracking-widest mb-4">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map(s => (
                      <span key={s} className="px-3 py-1.5 rounded-xl text-[10px] font-bold bg-white text-neutral-700 border border-neutral-100 shadow-sm">
                        {s}
                      </span>
                    ))}
                  </div>
                </section>

                <section className="bg-brand-purple-50 rounded-3xl p-6">
                  <h4 className="text-xs font-black text-neutral-900 uppercase tracking-widest mb-4 text-brand-purple-700">Education</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-bold text-neutral-800">Master of Technology</p>
                      <p className="text-[10px] text-brand-purple-600 font-semibold mt-0.5">IIT Delhi • 2021</p>
                    </div>
                    <div className="pt-3 border-t border-brand-purple-100">
                      <p className="text-xs font-bold text-neutral-800">Bachelor of Science</p>
                      <p className="text-[10px] text-brand-purple-600 font-semibold mt-0.5">Delhi University • 2019</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>

          <div className="px-8 py-5 border-t border-neutral-100 bg-neutral-50/50 flex gap-3 shrink-0">
            <button 
              onClick={handleDownload}
              className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-white shadow-lg shadow-purple-200 hover:opacity-90 transition-opacity" 
              style={{ background: '#8B3A8F' }}
            >
              📥 Download PDF
            </button>
            <button 
              onClick={handleShare}
              className="flex-1 py-3.5 rounded-2xl text-sm font-bold border-2 border-neutral-200 text-neutral-600 hover:bg-white transition-all"
            >
              🔗 Share Profile
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResumePreviewModal;