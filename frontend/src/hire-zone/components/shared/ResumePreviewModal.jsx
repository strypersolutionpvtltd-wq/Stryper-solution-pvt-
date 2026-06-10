import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ExternalLink, FileText, User, Mail, Phone } from 'lucide-react';

const ResumePreviewModal = ({ candidate, onClose }) => {
  if (!candidate) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white w-full max-w-4xl h-[90vh] rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-neutral-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-purple-50 flex items-center justify-center text-brand-purple-600">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900 leading-tight">
                  {candidate.name}'s Resume
                </h3>
                <p className="text-sm text-neutral-500 font-medium">
                  {candidate.role || candidate.position || 'Candidate'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-50 text-neutral-600 text-sm font-semibold hover:bg-neutral-100 transition-colors">
                <Download size={18} />
                Download
              </button>
              <button 
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-neutral-50 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-all"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8 bg-neutral-50/50">
            <div className="max-w-3xl mx-auto">
              {/* Info Bar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm">
                  <div className="flex items-center gap-3 text-neutral-400 mb-2">
                    <User size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Experience</span>
                  </div>
                  <p className="font-bold text-neutral-900">{candidate.experience || 'Not specified'}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm">
                  <div className="flex items-center gap-3 text-neutral-400 mb-2">
                    <Mail size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Email</span>
                  </div>
                  <p className="font-bold text-neutral-900 truncate">{candidate.email || 'Not provided'}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm">
                  <div className="flex items-center gap-3 text-neutral-400 mb-2">
                    <Phone size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Phone</span>
                  </div>
                  <p className="font-bold text-neutral-900">{candidate.phone || 'Not provided'}</p>
                </div>
              </div>

              {/* Resume Preview Placeholder */}
              <div className="bg-white rounded-[2rem] border border-neutral-100 shadow-sm overflow-hidden min-h-[600px] flex flex-col items-center justify-center text-center p-12">
                <div className="w-24 h-24 rounded-3xl bg-neutral-50 flex items-center justify-center text-neutral-300 mb-6">
                  <FileText size={48} />
                </div>
                <h4 className="text-2xl font-bold text-neutral-900 mb-3">Resume Preview</h4>
                <p className="text-neutral-500 max-w-sm mb-8">
                  The visual resume preview for {candidate.name} is currently being processed. You can download the original file in the meantime.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                   {candidate.resumeUrl && (
                      <a 
                        href={candidate.resumeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-purple-600 text-white font-bold shadow-lg shadow-brand-purple-200 hover:bg-brand-purple-700 transition-all active:scale-95"
                      >
                        <ExternalLink size={20} />
                        Open Original File
                      </a>
                   )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ResumePreviewModal;
