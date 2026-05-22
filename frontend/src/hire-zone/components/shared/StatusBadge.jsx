const STATUS_STYLES = {
  Active:     'bg-green-100 text-green-700',
  Paused:     'bg-yellow-100 text-yellow-700',
  Closed:     'bg-neutral-100 text-neutral-500',
  Applied:    'bg-blue-100 text-blue-700',
  Screening:  'bg-purple-100 text-purple-700',
  Interview:  'bg-indigo-100 text-indigo-700',
  Offer:      'bg-orange-100 text-orange-700',
  Hired:      'bg-teal-100 text-teal-700',
  Rejected:   'bg-red-100 text-red-600',
};

/**
 * Colored status pill.
 * status: "Active" | "Paused" | "Closed" | "Applied" | "Screening" |
 *         "Interview" | "Offer" | "Hired" | "Rejected"
 */
const StatusBadge = ({ status }) => {
  const cls = STATUS_STYLES[status] ?? 'bg-neutral-100 text-neutral-500';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
