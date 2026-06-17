import { useState, useEffect } from 'react';
import { candidateProfile, upload } from '@/utils/api';
import toast from 'react-hot-toast';

const Resume = () => {
  const [resumeUrl, setResumeUrl]   = useState(null);
  const [uploading, setUploading]   = useState(false);
  const [loading, setLoading]       = useState(true);
  const [dragOver, setDragOver]     = useState(false);

  // Fetch existing resume on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await candidateProfile.get();
        if (res.data?.profile?.resume) {
          setResumeUrl(res.data.profile.resume);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleFile = async (file) => {
    if (!file) return;
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) {
      toast.error('Only PDF, DOC, DOCX files are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await upload.uploadResume(formData);
      const url = res.data?.resume;
      if (url) {
        setResumeUrl(url);
        toast.success('Resume uploaded successfully!');
      }
    } catch (err) {
      console.error('Upload error:', err?.response?.data);
      toast.error(err?.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const isPdf = resumeUrl?.toLowerCase().includes('.pdf') || resumeUrl?.includes('pdf');

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">My Resume</h1>
        <p className="text-sm text-neutral-500 mt-1">Upload your latest resume. It will be visible to employers when you apply for jobs.</p>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
        className={`bg-white rounded-2xl border-2 border-dashed p-10 flex flex-col items-center justify-center text-center transition-colors ${dragOver ? 'border-purple-400 bg-purple-50' : 'border-neutral-200 hover:border-purple-300'}`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
            <p className="text-sm text-neutral-500">Uploading...</p>
          </div>
        ) : (
          <>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: '#f3e8f5' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M12 16V4M8 8l4-4 4 4" stroke="#8B3A8F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 20h16" stroke="#8B3A8F" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-base font-semibold text-neutral-800 mb-1">
              {resumeUrl ? 'Replace Resume' : 'Upload Resume'}
            </p>
            <p className="text-sm text-neutral-400 mb-4">Drag & drop or click to browse · PDF, DOC, DOCX · Max 5MB</p>
            <label className="cursor-pointer px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: '#8B3A8F' }}>
              Choose File
              <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => handleFile(e.target.files[0])} />
            </label>
          </>
        )}
      </div>

      {/* Resume Preview */}
      {!loading && resumeUrl && (
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="2" width="16" height="20" rx="2" stroke="#ef4444" strokeWidth="1.8"/>
                  <path d="M8 7h8M8 11h8M8 15h5" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-800">Your Resume</p>
                <p className="text-xs text-neutral-400">{isPdf ? 'PDF Document' : 'Word Document'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors flex items-center gap-1.5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                Open
              </a>
              <a href={resumeUrl} download
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-90 flex items-center gap-1.5"
                style={{ background: '#8B3A8F' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download
              </a>
            </div>
          </div>

          {/* Preview — PDF inline, others show link */}
          {isPdf ? (
            <iframe
              src={`${resumeUrl}#toolbar=0&navpanes=0`}
              title="Resume Preview"
              className="w-full"
              style={{ height: '780px', border: 'none' }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="2" width="16" height="20" rx="2" stroke="#2563eb" strokeWidth="1.8"/>
                  <path d="M8 7h8M8 11h8M8 15h5" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <p className="text-sm font-semibold text-neutral-700">Word document uploaded</p>
              <p className="text-xs text-neutral-400">Preview not available for Word files.</p>
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer"
                className="mt-2 px-5 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: '#8B3A8F' }}>
                Open Document
              </a>
            </div>
          )}
        </div>
      )}

      {!loading && !resumeUrl && (
        <div className="bg-neutral-50 rounded-2xl border border-neutral-100 py-10 text-center">
          <p className="text-sm text-neutral-400">No resume uploaded yet. Upload one above to get started.</p>
        </div>
      )}
    </div>
  );
};

export default Resume;
