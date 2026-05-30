import { useState } from 'react';
import ResumeParser from '@/career-hub/components/ResumeParser';

const Resume = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-8">
        <h1 className="text-2xl font-bold text-neutral-800 mb-2">Resume & AI Auto-Fill</h1>
        <p className="text-neutral-500 text-sm">
          Upload your latest resume and let our AI automatically build your profile for you. 
          You can always edit the details manually.
        </p>
      </div>

      {/* Main Resume Parser Component */}
      <ResumeParser />
    </div>
  );
};

export default Resume;
