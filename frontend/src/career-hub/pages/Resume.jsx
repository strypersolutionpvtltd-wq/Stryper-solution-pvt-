import { useState } from 'react';
import { MOCK_CANDIDATE } from '@/career-hub/data/mockCandidate';

const Resume = () => {
  const { resume } = MOCK_CANDIDATE;
  const [visibility, setVisibility] = useState(resume.visibility);

  return (
    <div>
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 mb-4">
        <h1 className="text-lg font-bold text-neutral-800 mb-1">Resume</h1>
        <p className="text-sm text-neutral-500">Manage your resume and visibility to recruiters.</p>
      </div>

      {/* Current resume */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 mb-4">
        <h2 className="text-sm font-semibold text-neutral-700 mb-4">Current Resume</h2>
        <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#EF4444" strokeWidth="1.8" fill="none"/>
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-neutral-800 truncate">{resume.fileName}</p>
            <p className="text-xs text-neutral-400 mt-0.5">Uploaded on {resume.uploadedAt}</p>
          </div>
          <button className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-100 transition-colors">
            Download
          </button>
        </div>
      </div>

      {/* Resume headline */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 mb-4">
        <h2 className="text-sm font-semibold text-neutral-700 mb-3">Resume Headline</h2>
        <p className="text-sm text-neutral-500 mb-3">A short headline helps recruiters find you faster.</p>
        <div className="flex gap-3">
          <input
            defaultValue={resume.headline}
            className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-800 focus:outline-none"
            onFocus={e => e.target.style.boxShadow = '0 0 0 2px #8B3A8F40'}
            onBlur={e => e.target.style.boxShadow = ''}
          />
          <button
            className="px-4 py-2.5 rounded-xl text-white text-sm font-semibold"
            style={{ background: '#8B3A8F' }}
          >
            Save
          </button>
        </div>
      </div>

      {/* Visibility */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-neutral-700">Resume Visibility</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              {visibility === 'visible'
                ? 'Recruiters can find and view your resume.'
                : 'Your resume is hidden from recruiters.'}
            </p>
          </div>
          <button
            onClick={() => setVisibility(v => v === 'visible' ? 'hidden' : 'visible')}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${visibility === 'visible' ? 'bg-purple-600' : 'bg-neutral-200'}`}
            style={visibility === 'visible' ? { background: '#8B3A8F' } : {}}
            aria-label="Toggle resume visibility"
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${visibility === 'visible' ? 'translate-x-5' : 'translate-x-0'}`}
            />
          </button>
        </div>
      </div>

      {/* Upload new */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-neutral-700 mb-3">Upload New Resume</h2>
        <div className="border-2 border-dashed border-neutral-200 rounded-xl p-8 text-center hover:border-purple-300 transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mx-auto mb-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="#8B3A8F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-sm font-medium text-neutral-700">Drop your resume here</p>
          <p className="text-xs text-neutral-400 mt-1">PDF, DOC, DOCX up to 5MB</p>
          <button
            className="mt-4 px-5 py-2 rounded-xl text-sm font-semibold border-2 transition-colors"
            style={{ borderColor: '#8B3A8F', color: '#8B3A8F' }}
          >
            Browse File
          </button>
        </div>
      </div>
    </div>
  );
};

export default Resume;
