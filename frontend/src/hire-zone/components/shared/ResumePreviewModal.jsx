import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ResumePreviewModal = ({ candidate, onClose }) => {
  if (!candidate) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" 
          onClick={onClose} 
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-white sticky top-0 z-10">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">{candidate.name}'s Resume</h2>
              <p className="text-sm text-neutral-500">{candidate.appliedRole || candidate.title || 'Applicant'}</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-8 bg-neutral-50">
            <div className="max-w-2xl mx-auto space-y-8">
              {/* Resume Placeholder / Content */}
              <div className="bg-white p-12 shadow-sm rounded-sm border border-neutral-200 min-h-[800px] flex flex-col">
                <div className="border-b-2 border-neutral-900 pb-6 mb-8">
                  <h1 className="text-3xl font-bold text-neutral-900 mb-2 uppercase tracking-tight">{candidate.name}</h1>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-600">
                    <span>{candidate.email}</span>
                    <span>•</span>
                    <span>{candidate.phone}</span>
                    <span>•</span>
                    <span>{candidate.location}</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <section>
                    <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest border-b border-neutral-200 pb-1 mb-3">Professional Summary</h3>
                    <p className="text-sm text-neutral-700 leading-relaxed">
                      Results-driven {candidate.appliedRole || candidate.title || 'Professional'} with {candidate.experience || 'extensive'} experience in the industry. 
                      Proven track record of delivering high-quality solutions and contributing to team success. 
                      Expertise in modern technologies and best practices.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest border-b border-neutral-200 pb-1 mb-3">Experience</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className="font-bold text-neutral-800">Senior {candidate.appliedRole || candidate.title || 'Role'}</h4>
                          <span className="text-xs text-neutral-500 font-medium">2021 — Present</span>
                        </div>
                        <p className="text-xs text-neutral-600 italic mb-2">Previous Company Alpha • New York, NY</p>
                        <ul className="list-disc list-outside ml-4 text-sm text-neutral-700 space-y-1">
                          <li>Led development of key features resulting in 20% increase in user engagement.</li>
                          <li>Collaborated with cross-functional teams to define project requirements and timelines.</li>
                          <li>Mentored junior developers and implemented code review processes to ensure code quality.</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest border-b border-neutral-200 pb-1 mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'PostgreSQL', 'AWS', 'Docker', 'Git'].map(skill => (
                        <span key={skill} className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="mt-auto pt-12 text-center border-t border-neutral-100 italic text-neutral-400 text-[10px]">
                  * This is a generated preview of the candidate's profile.
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-neutral-100 bg-white flex justify-end gap-3 sticky bottom-0 z-10">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors border border-neutral-200"
            >
              Close Preview
            </button>
            <button
              className="px-6 py-2 rounded-xl text-sm font-semibold text-white transition-colors shadow-lg shadow-purple-100"
              style={{ background: '#8B3A8F' }}
              onClick={() => {
                window.print();
              }}
            >
              Download PDF
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResumePreviewModal;
