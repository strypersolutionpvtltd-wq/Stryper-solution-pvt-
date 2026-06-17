import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ExternalLink, FileText, User, Mail, Phone } from 'lucide-react';

const ResumePreviewModal = ({ candidate, onClose }) => {
  const [iframeError, setIframeError] = useState(false);
  if (!candidate) return null;

  // candidate.resume is the Cloudinary URL (could be PDF, doc, etc.)
  const resumeUrl = candidate.resume || candidate.resumeUrl || '';

  // Build Google Docs viewer URL for PDFs/docs so they render in-browser
  const viewerUrl = resumeUrl
    ? `https://docs.google.com/viewer?url=${encodeURIComponent(resumeUrl)}&embedded=true`
    : '';

  const handleDownload = async () => {
    if (!resumeUrl) return;
    try {
      const response = await fetch(resumeUrl);
      const blob = await response.blob();
      const ext = resumeUrl.split('.').pop().split('?')[0] || 'pdf';
      const filename = `${candidate.name?.replace(/\s+/g, '_') || 'resume'}_resume.${ext}`;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      // Fallback: open in new tab if fetch fails
      window.open(resumeUrl, '_blank');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-white w-full max-w-4xl h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-7 py-5 border-b border-neutral-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900 leading-tight">{candidate.name}'s Resume</h3>
                <p className="text-xs text-neutral-500">{candidate.role || candidate.headline || 'Candidate'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {resumeUrl && (
                <>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-50 text-neutral-600 text-xs font-semibold hover:bg-neutral-100 transition-colors"
                  >
                    <Download size={15} />
                    Download
                  </button>
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-50 text-neutral-600 text-xs font-semibold hover:bg-neutral-100 transition-colors"
                  >
                    <ExternalLink size={15} />
                    Open
                  </a>
                </>
              )}
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-neutral-50 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-all"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Info strip */}
          <div className="grid grid-cols-3 divide-x divide-neutral-100 border-b border-neutral-100 shrink-0">
            {[
              { icon: <User size={14} />, label: 'Experience', value: candidate.experience || 'Not specified' },
              { icon: <Mail size={14} />, label: 'Email',      value: candidate.email || 'Not provided' },
              { icon: <Phone size={14} />, label: 'Phone',     value: candidate.phone || 'Not provided' },
            ].map(({ icon, label, value }) => (
              <div key={label} className="px-6 py-3 flex items-center gap-3">
                <span className="text-neutral-400 shrink-0">{icon}</span>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{label}</p>
                  <p className="text-sm font-semibold text-neutral-800 truncate">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Resume content area */}
          <div className="flex-1 overflow-hidden bg-neutral-100">
            {!resumeUrl ? (
              /* No resume uploaded */
              <div className="h-full flex flex-col items-center justify-center text-center p-12">
                <div className="w-20 h-20 rounded-2xl bg-neutral-200 flex items-center justify-center text-neutral-400 mb-5">
                  <FileText size={40} />
                </div>
                <h4 className="text-lg font-bold text-neutral-700 mb-2">No Resume Uploaded</h4>
                <p className="text-sm text-neutral-400 max-w-xs">
                  This candidate hasn't uploaded a resume yet.
                </p>
              </div>
            ) : iframeError ? (
              /* iframe failed — show direct open fallback */
              <div className="h-full flex flex-col items-center justify-center text-center p-12">
                <div className="w-20 h-20 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-400 mb-5">
                  <FileText size={40} />
                </div>
                <h4 className="text-lg font-bold text-neutral-700 mb-2">Preview Unavailable</h4>
                <p className="text-sm text-neutral-400 max-w-xs mb-6">
                  The resume can't be previewed inline. Open it directly.
                </p>
                <div className="flex gap-3">
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                    style={{ background: '#8B3A8F' }}
                  >
                    <ExternalLink size={16} />
                    Open Resume
                  </a>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>
            ) : (
              /* Render resume via Google Docs viewer (handles PDF, DOC, DOCX) */
              <iframe
                key={viewerUrl}
                src={viewerUrl}
                title={`${candidate.name} Resume`}
                className="w-full h-full border-0"
                onError={() => setIframeError(true)}
                allow="fullscreen"
              />
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ResumePreviewModal;
