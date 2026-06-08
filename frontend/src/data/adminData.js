export const OVERVIEW_STATS = [
  { label: 'Total Users', value: '12,840', change: '+12%', type: 'up' },
  { label: 'Candidates', value: '8,420', change: '+18%', type: 'up' },
  { label: 'Companies', value: '4,420', change: '+5%', type: 'up' },
  { label: 'Active Jobs', value: '1,245', change: '-2%', type: 'down' },
  { label: 'Applicants', value: '45,210', change: '+24%', type: 'up' },
  { label: 'New Today', value: '142', change: '+8%', type: 'up' },
  { label: 'Revenue', value: '₹4.2M', change: '+15%', type: 'up' },
  { label: 'Site Visits', value: '184K', change: '+10%', type: 'up' },
];

export const USER_GROWTH_DATA = [
  { month: 'Jan', candidates: 400, companies: 240 },
  { month: 'Feb', candidates: 600, companies: 300 },
  { month: 'Mar', candidates: 900, companies: 450 },
  { month: 'Apr', candidates: 1200, companies: 600 },
  { month: 'May', candidates: 1800, companies: 750 },
  { month: 'Jun', candidates: 2400, companies: 900 },
];

export const JOB_ANALYTICS_DATA = [
  { name: 'Active', value: 45 },
  { name: 'Pending', value: 25 },
  { name: 'Expired', value: 20 },
  { name: 'Blocked', value: 10 },
];

export const RECENT_ACTIVITY = [
  { id: 1, type: 'registration', user: 'Rahul Sharma', time: '2 mins ago', detail: 'Signed up as Candidate' },
  { id: 2, type: 'job_posted', user: 'Acme Corp', time: '15 mins ago', detail: 'Posted "Senior React Developer"' },
  { id: 3, type: 'application', user: 'Priya Singh', time: '45 mins ago', detail: 'Applied to Google (SWE)' },
  { id: 4, type: 'company', user: 'Tech Hub', time: '1 hour ago', detail: 'Registered as verified company' },
];

export const LATEST_USERS = [
  { id: '101', name: 'Amit Kumar', email: 'amit@gmail.com', role: 'Candidate', status: 'Active', joined: 'May 22, 2026' },
  { id: '102', name: 'Zomato Ltd', email: 'hr@zomato.com', role: 'Company', status: 'Verified', joined: 'May 21, 2026' },
  { id: '103', name: 'Sneha Rao', email: 'sneha@yahoo.com', role: 'Candidate', status: 'Inactive', joined: 'May 20, 2026' },
  { id: '104', name: 'Microsoft', email: 'jobs@microsoft.com', role: 'Company', status: 'Pending', joined: 'May 19, 2026' },
];

export const ALL_USERS = [
  ...LATEST_USERS,
  { id: '105', name: 'Rahul Verma', email: 'rahul@gmail.com', role: 'Candidate', status: 'Active', joined: 'May 18, 2026' },
  { id: '106', name: 'Swiggy', email: 'careers@swiggy.com', role: 'Company', status: 'Verified', joined: 'May 17, 2026' },
  { id: '107', name: 'Pooja Hegde', email: 'pooja@outlook.com', role: 'Candidate', status: 'Active', joined: 'May 16, 2026' },
  { id: '108', name: 'Amazon India', email: 'hr-india@amazon.com', role: 'Company', status: 'Verified', joined: 'May 15, 2026' },
];

export const ALL_COMPANIES = [
  { id: 'C01', name: 'Google', industry: 'Technology', location: 'Hyderabad', employees: '5000+', jobs: 12, status: 'Verified' },
  { id: 'C02', name: 'Microsoft', industry: 'Software', location: 'Bangalore', employees: '4000+', jobs: 8, status: 'Verified' },
  { id: 'C03', name: 'Zomato', industry: 'Food Tech', location: 'Gurgaon', employees: '2000+', jobs: 15, status: 'Verified' },
  { id: 'C04', name: 'Tesla India', industry: 'Automotive', location: 'Pune', employees: '500+', jobs: 5, status: 'Pending' },
  { id: 'C05', name: 'Netflix', industry: 'Entertainment', location: 'Mumbai', employees: '1000+', jobs: 4, status: 'Verified' },
];

export const PUBLIC_JOBS = [
  {
    id: 'J1', featured: true,
    title: 'Senior React Developer', company: 'Google', location: 'Remote', locationType: 'Remote',
    experience: '3-6 Years', salary: '₹25 - 40 LPA', type: 'Full-time', industry: 'IT / Software',
    skills: ['React', 'TypeScript', 'Node.js', 'AWS'], postedDays: 1, applicants: 45, status: 'Active',
    desc: 'Build scalable web applications using React and modern frontend tooling. Work with cross-functional teams.',
    logo: null,
  },
  {
    id: 'J2', featured: true,
    title: 'UI/UX Designer', company: 'Zomato', location: 'Gurgaon', locationType: 'Remote',
    experience: '2-4 Years', salary: '₹15 - 25 LPA', type: 'Full-time', industry: 'Design',
    skills: ['Figma', 'Prototyping', 'User Research', 'Tailwind'], postedDays: 2, applicants: 120, status: 'Active',
    desc: 'Create beautiful, user-centric designs for web and mobile products. Own the design system.',
    logo: null,
  },
  {
    id: 'J3', featured: false,
    title: 'Backend Engineer', company: 'Microsoft', location: 'Bangalore', locationType: 'Onsite',
    experience: '4-8 Years', salary: '₹20 - 35 LPA', type: 'Full-time', industry: 'IT / Software',
    skills: ['Docker', 'Kubernetes', 'CI/CD', 'Terraform'], postedDays: 3, applicants: 80, status: 'Active',
    desc: 'Manage cloud infrastructure, automate deployments, and ensure system reliability at scale.',
    logo: null,
  },
  {
    id: 'J4', featured: false,
    title: 'Data Scientist', company: 'Amazon', location: 'Hyderabad', locationType: 'Hybrid',
    experience: '3-5 Years', salary: '₹30 - 50 LPA', type: 'Full-time', industry: 'Data Science',
    skills: ['Python', 'Machine Learning', 'SQL', 'Analytics'], postedDays: 5, applicants: 210, status: 'Pending',
    desc: 'Lead data analysis, build predictive models, and drive measurable business growth.',
    logo: null,
  },
  {
    id: 'J5', featured: false,
    title: 'Product Manager', company: 'Swiggy', location: 'Bangalore', locationType: 'Remote',
    experience: '2-5 Years', salary: '₹25 - 45 LPA', type: 'Full-time', industry: 'Product Management',
    skills: ['Agile', 'Jira', 'Product Strategy', 'Roadmapping'], postedDays: 7, applicants: 55, status: 'Active',
    desc: 'Design and build robust product roadmaps. Work on high-traffic consumer features.',
    logo: null,
  },
];

export const ALL_JOBS = PUBLIC_JOBS;

export const ALL_APPLICATIONS = [
  { id: 'A01', candidate: 'Amit Kumar', job: 'Senior React Developer', company: 'Google', date: 'May 22, 2026', status: 'Shortlisted' },
  { id: 'A02', candidate: 'Sneha Rao', job: 'UI/UX Designer', company: 'Zomato', date: 'May 21, 2026', status: 'Applied' },
  { id: 'A03', candidate: 'Rahul Verma', job: 'Backend Engineer', company: 'Microsoft', date: 'May 20, 2026', status: 'Rejected' },
  { id: 'A04', candidate: 'Pooja Hegde', job: 'Data Scientist', company: 'Amazon', date: 'May 19, 2026', status: 'Applied' },
  { id: 'A05', candidate: 'Vikas Khanna', job: 'Product Manager', company: 'Swiggy', date: 'May 18, 2026', status: 'Shortlisted' },
];

// Applications for Stryper's own internal job postings (from Careers page)
export const STRYPER_APPLICATIONS = [
  { id: 'SA01', candidate: 'Arjun Mehta', job: 'HR Manager', date: 'Jun 5, 2026', status: 'Applied', experience: '5 years', location: 'Delhi', phone: '+91 98001 11111', resume: null },
  { id: 'SA02', candidate: 'Divya Sharma', job: 'Operations Executive', date: 'Jun 4, 2026', status: 'Shortlisted', experience: '3 years', location: 'Gurgaon', phone: '+91 98001 22222', resume: null },
  { id: 'SA03', candidate: 'Karan Singh', job: 'HR Manager', date: 'Jun 3, 2026', status: 'Interview', experience: '7 years', location: 'Noida', phone: '+91 98001 33333', resume: null },
  { id: 'SA04', candidate: 'Neha Joshi', job: 'Operations Executive', date: 'Jun 2, 2026', status: 'Rejected', experience: '2 years', location: 'Delhi', phone: '+91 98001 44444', resume: null },
  { id: 'SA05', candidate: 'Rohit Gupta', job: 'HR Manager', date: 'Jun 1, 2026', status: 'Applied', experience: '4 years', location: 'Gurugram', phone: '+91 98001 55555', resume: null },
];

export const ANALYTICS_PERFORMANCE = [
  { day: 'Mon', apps: 120, hires: 12 },
  { day: 'Tue', apps: 150, hires: 18 },
  { day: 'Wed', apps: 200, hires: 25 },
  { day: 'Thu', apps: 180, hires: 20 },
  { day: 'Fri', apps: 250, hires: 35 },
  { day: 'Sat', apps: 90, hires: 8 },
  { day: 'Sun', apps: 70, hires: 5 },
];

export const REVENUE_DATA = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
];

export const ADMIN_NOTIFICATIONS = [
  { id: 1, title: 'New Company Request', message: 'Tesla India has requested verification.', time: '2 mins ago', type: 'warning', read: false, link: '/admin/users/C04' },
  { id: 2, title: 'System Update', message: 'Platform maintenance scheduled for Sunday.', time: '1 hour ago', type: 'info', read: false },
  { id: 3, title: 'Job Reported', message: 'Job #J04 reported for suspicious content.', time: '3 hours ago', type: 'error', read: true, link: '/admin/jobs' },
  { id: 4, title: 'High Traffic Alert', message: 'Candidate registration increased by 40%.', time: '5 hours ago', type: 'success', read: true },
];

export const ALL_STRYPER_PARTNERS = [
  { id: 'PART01', name: 'Elite Recruitment', specialty: 'Tech & IT', experience: '10+ years', activeHires: 25, rating: 4.8, status: 'Active' },
  { id: 'PART02', name: 'Global Talent HR', specialty: 'Executive Search', experience: '15 years', activeHires: 12, rating: 4.9, status: 'Verified' },
  { id: 'PART03', name: 'Future Career Sol.', specialty: 'Marketing & Sales', experience: '5 years', activeHires: 40, rating: 4.5, status: 'Active' },
  { id: 'PART04', name: 'ProHire Advisors', specialty: 'Healthcare', experience: '8 years', activeHires: 18, rating: 4.7, status: 'Pending' },
];