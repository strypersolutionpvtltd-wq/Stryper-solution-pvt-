import { useState } from 'react';
import { MOCK_NOTIFICATIONS } from '@/career-hub/data/mockCandidate';

const TYPE_ICONS = {
  application: { bg: 'bg-blue-50', color: '#3B82F6', path: <><rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" fill="none"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></> },
  interview:   { bg: 'bg-purple-50', color: '#8B3A8F', path: <><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" fill="none"/><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></> },
  profile:     { bg: 'bg-amber-50', color: '#D97706', path: <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" fill="none"/></> },
};

const Notifications = () => {
  const [items, setItems] = useState(MOCK_NOTIFICATIONS);
  const unread = items.filter(n => !n.read).length;

  const markAllRead = () => setItems(prev => prev.map(n => ({ ...n, read: true })));

  return (
    <div>
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-neutral-800 mb-1">Notifications</h1>
          <p className="text-sm text-neutral-500">{unread} unread</p>
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs font-semibold hover:underline"
            style={{ color: '#8B3A8F' }}
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-2">
        {items.map(n => {
          const icon = TYPE_ICONS[n.type] ?? TYPE_ICONS.profile;
          return (
            <div
              key={n.id}
              className={`bg-white rounded-2xl border shadow-sm p-4 flex items-start gap-4 transition-colors ${n.read ? 'border-neutral-100' : 'border-purple-100'}`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${icon.bg}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" style={{ color: icon.color }}>
                  {icon.path}
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-relaxed ${n.read ? 'text-neutral-600' : 'text-neutral-800 font-medium'}`}>
                  {n.message}
                </p>
                <p className="text-xs text-neutral-400 mt-1">{n.time}</p>
              </div>
              {!n.read && (
                <span className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background: '#8B3A8F' }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Notifications;
