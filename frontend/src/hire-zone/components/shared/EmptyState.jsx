const EmptyState = ({ title = 'Nothing here yet', message = 'This section is coming soon.' }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mb-4">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8B3A8F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
      </svg>
    </div>
    <h3 className="text-base font-semibold text-neutral-800 mb-1">{title}</h3>
    <p className="text-sm text-neutral-500 max-w-xs">{message}</p>
  </div>
);

export default EmptyState;
