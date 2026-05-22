import { Link } from 'react-router-dom';

const HireZoneNotFound = () => (
  <div className="flex flex-col items-center justify-center h-full py-24 text-center px-6">
    <div className="w-20 h-20 rounded-2xl bg-purple-50 flex items-center justify-center mb-6">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#8B3A8F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
      </svg>
    </div>
    <h2 className="text-3xl font-bold text-neutral-900 mb-2">404</h2>
    <p className="text-neutral-500 mb-6 max-w-sm">This page doesn't exist in the Hire Zone. Check the URL or head back to your dashboard.</p>
    <Link
      to="/hire-zone/dashboard"
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
      style={{ background: '#8B3A8F' }}
    >
      Back to Dashboard
    </Link>
  </div>
);

export default HireZoneNotFound;
