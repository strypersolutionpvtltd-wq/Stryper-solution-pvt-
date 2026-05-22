export const KPI_DATA = [
  { id: 'total-jobs',   title: 'Total Jobs',           value: 24,  trend: '+3',  trendDirection: 'up',   icon: 'briefcase',  accentColor: 'purple' },
  { id: 'active-jobs',  title: 'Active Hiring',        value: 8,   trend: '+1',  trendDirection: 'up',   icon: 'zap',        accentColor: 'green'  },
  { id: 'applicants',   title: 'Total Applicants',     value: 142, trend: '+18', trendDirection: 'up',   icon: 'users',      accentColor: 'blue'   },
  { id: 'shortlisted',  title: 'Shortlisted',          value: 31,  trend: '+5',  trendDirection: 'up',   icon: 'star',       accentColor: 'gold'   },
  { id: 'interviews',   title: 'Interviews Scheduled', value: 12,  trend: '-2',  trendDirection: 'down', icon: 'calendar',   accentColor: 'orange' },
  { id: 'hired',        title: 'Hired This Month',     value: 4,   trend: '+4',  trendDirection: 'up',   icon: 'check',      accentColor: 'teal'   },
];

export const RECENT_APPLICATIONS = [
  { id: 1, name: 'Priya Sharma',   role: 'Frontend Developer',  status: 'Screening', date: '2025-01-10', exp: '3 yrs', location: 'Delhi'     },
  { id: 2, name: 'Rahul Verma',    role: 'DevOps Engineer',     status: 'Interview', date: '2025-01-09', exp: '5 yrs', location: 'Noida'     },
  { id: 3, name: 'Anjali Singh',   role: 'HR Manager',          status: 'Applied',   date: '2025-01-09', exp: '7 yrs', location: 'Gurugram'  },
  { id: 4, name: 'Karan Mehta',    role: 'Backend Developer',   status: 'Offer',     date: '2025-01-08', exp: '4 yrs', location: 'Bangalore' },
  { id: 5, name: 'Sneha Patel',    role: 'UI/UX Designer',      status: 'Hired',     date: '2025-01-07', exp: '2 yrs', location: 'Mumbai'    },
  { id: 6, name: 'Amit Joshi',     role: 'Data Analyst',        status: 'Applied',   date: '2025-01-06', exp: '3 yrs', location: 'Pune'      },
];

export const CHART_DATA = [
  { month: 'Aug', applications: 18, hired: 2 },
  { month: 'Sep', applications: 27, hired: 3 },
  { month: 'Oct', applications: 35, hired: 5 },
  { month: 'Nov', applications: 22, hired: 2 },
  { month: 'Dec', applications: 41, hired: 6 },
  { month: 'Jan', applications: 38, hired: 4 },
];

export const UPCOMING_INTERVIEWS = [
  { id: 1, candidate: 'Rahul Verma',   role: 'DevOps Engineer',    time: 'Today, 2:00 PM',    type: 'Video',     avatar: 'R' },
  { id: 2, candidate: 'Priya Sharma',  role: 'Frontend Developer', time: 'Today, 4:30 PM',    type: 'In-person', avatar: 'P' },
  { id: 3, candidate: 'Karan Mehta',   role: 'Backend Developer',  time: 'Tomorrow, 11:00 AM', type: 'Video',    avatar: 'K' },
  { id: 4, candidate: 'Neha Gupta',    role: 'Product Manager',    time: 'Jan 15, 3:00 PM',   type: 'Phone',     avatar: 'N' },
];

export const ACTIVE_JOBS = [
  { id: 1, title: 'Frontend Developer',  applicants: 28, newToday: 3, daysLeft: 12, progress: 70 },
  { id: 2, title: 'DevOps Engineer',     applicants: 14, newToday: 1, daysLeft: 8,  progress: 45 },
  { id: 3, title: 'Backend Developer',   applicants: 35, newToday: 5, daysLeft: 20, progress: 85 },
  { id: 4, title: 'Data Analyst',        applicants: 11, newToday: 2, daysLeft: 15, progress: 30 },
];

export const PIPELINE_STATS = [
  { stage: 'Applied',     count: 142, color: '#6366f1' },
  { stage: 'Screening',   count: 58,  color: '#8B3A8F' },
  { stage: 'Interview',   count: 24,  color: '#f59e0b' },
  { stage: 'Offer',       count: 8,   color: '#10b981' },
  { stage: 'Hired',       count: 4,   color: '#0d9488' },
];
