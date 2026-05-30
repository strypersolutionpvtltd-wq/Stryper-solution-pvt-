import { NavLink } from 'react-router-dom';
import { CAREER_HUB_NAV } from '@/career-hub/utils/careerHubRoutes';
import { MOCK_CANDIDATE } from '@/career-hub/data/mockCandidate';

// Simple icon map using SVG paths
const ICONS = {
  user: <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
  video: <><path d="M23 7l-7 5 7 5V7z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/></>,
  'file-text': <><rect x="4" y="2" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="1.8" fill="none"/><path d="M8 7h8M8 11h8M8 15h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></>,
  briefcase: <><rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" fill="none"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></>,
  bookmark: <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
  bell: <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/></>,
  settings: <><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" fill="none"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="1.8" fill="none"/></>,
};

const Icon = ({ name }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    {ICONS[name]}
  </svg>
);

const Initials = ({ name }) => {
  const parts = name.trim().split(' ');
  return `${parts[0]?.[0] ?? ''}${parts[1]?.[0] ?? ''}`.toUpperCase();
};

const CareerHubSidebar = () => {
  const c = MOCK_CANDIDATE;

  return (
    <aside className="w-64 shrink-0">
      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-5 mb-4 shadow-sm">
        {/* Avatar */}
        <div className="flex flex-col items-center text-center mb-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold mb-3"
            style={{ background: 'linear-gradient(135deg, #8B3A8F, #6d2b70)' }}
          >
            <Initials name={c.fullName} />
          </div>
          <p className="font-semibold text-neutral-800 text-sm leading-tight">{c.fullName}</p>
          <p className="text-xs text-neutral-500 mt-0.5">{c.title}</p>
          <p className="text-xs text-neutral-400 mt-0.5">{c.location}</p>
        </div>

        {/* Profile completion */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-neutral-500 font-medium">Profile Strength</span>
            <span className="text-xs font-bold" style={{ color: '#8B3A8F' }}>{c.profileCompletion}%</span>
          </div>
          <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${c.profileCompletion}%`, background: 'linear-gradient(90deg, #8B3A8F, #b05ab5)' }}
            />
          </div>
          <p className="text-[11px] text-neutral-400 mt-1.5">Add experience to reach 100%</p>
        </div>
      </div>

      {/* Nav links */}
      <nav className="bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm">
        {CAREER_HUB_NAV.map(({ label, path, icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-colors duration-150',
                'border-b border-neutral-50 last:border-0',
                isActive
                  ? 'text-white'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800',
              ].join(' ')
            }
            style={({ isActive }) =>
              isActive ? { background: '#8B3A8F', color: 'white' } : {}
            }
          >
            <Icon name={icon} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default CareerHubSidebar;
