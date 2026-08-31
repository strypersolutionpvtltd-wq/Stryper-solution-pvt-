const STATUS_STYLES = {
  Active:             'bg-green-100 text-green-700',
  PendingApproval:    'bg-amber-100 text-amber-700 border border-amber-200',
  Draft:              'bg-neutral-100 text-neutral-600 border border-neutral-200',
  Paused:             'bg-yellow-100 text-yellow-700',
  Closed:             'bg-neutral-100 text-neutral-500',
  Archived:           'bg-amber-100 text-amber-600',
  Applied:            'bg-blue-100 text-blue-700',
  PendingAdminReview: 'bg-amber-100 text-amber-700 border border-amber-200',
  Screening:          'bg-purple-100 text-purple-700',
  Interview:          'bg-indigo-100 text-indigo-700',
  Offer:              'bg-orange-100 text-orange-700',
  Hired:              'bg-teal-100 text-teal-700',
  Rejected:           'bg-red-100 text-red-600',
  AdminRejected:      'bg-red-100 text-red-600',
};

const STATUS_LABELS = {
  PendingApproval:    'Pending Approval',
  PendingAdminReview: 'Under Review',
  AdminRejected:      'Rejected',
};

/**
 * Colored status pill.
 */
const StatusBadge = ({ status }) => {
  const cls = STATUS_STYLES[status] ?? 'bg-neutral-100 text-neutral-500';
  const label = STATUS_LABELS[status] ?? status;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
