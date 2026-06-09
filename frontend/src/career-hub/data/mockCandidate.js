export const MOCK_CANDIDATE = {
  id: "c001",
  fullName: "Rahul Sharma",
  title: "Senior Frontend Developer",
  email: "rahul.sharma@gmail.com",
  phone: "+91 98765 43210",
  location: "Delhi, India",
  avatar: null, // null = show initials
  profileCompletion: 72,
  summary:
    "Passionate frontend developer with 4+ years of experience building scalable web applications using React and modern JavaScript.",

  resume: {
    fileName: "Rahul_Sharma_Resume.pdf",
    headline: "Senior Frontend Developer | React | TypeScript | 4 Years Exp",
    visibility: "visible", // visible | hidden
    uploadedAt: "2025-05-10",
  },

  careerDetails: {
    preferredRole: "Frontend Developer",
    experience: "4 Years",
    salaryExpectation: "₹18–22 LPA",
    locationPreference: "Delhi NCR, Bangalore, Remote",
    employmentType: "Full-time",
    noticePeriod: "30 Days",
  },

  education: [
    {
      id: "e1",
      degree: "B.Tech in Computer Science",
      institution: "Delhi Technological University",
      year: "2020",
      grade: "8.4 CGPA",
    },
  ],

  skills: [
    { name: "React.js", level: "Expert" },
    { name: "TypeScript", level: "Advanced" },
    { name: "JavaScript", level: "Expert" },
    { name: "Tailwind CSS", level: "Advanced" },
    { name: "Node.js", level: "Intermediate" },
    { name: "Git", level: "Advanced" },
    { name: "REST APIs", level: "Advanced" },
    { name: "Figma", level: "Intermediate" },
  ],

  experience: [
    {
      id: "ex1",
      role: "Frontend Developer",
      company: "TechCorp Solutions",
      duration: "Jan 2022 – Present",
      location: "Delhi",
      description:
        "Built and maintained React-based dashboards, improved performance by 40%, led a team of 3 junior developers.",
    },
    {
      id: "ex2",
      role: "Junior Developer",
      company: "StartupXYZ",
      duration: "Jun 2020 – Dec 2021",
      location: "Noida",
      description:
        "Developed responsive UI components, integrated REST APIs, collaborated with design team.",
    },
  ],
};

export const MOCK_APPLIED_JOBS = [
  {
    id: "aj1",
    title: "Senior React Developer",
    company: "Infosys",
    location: "Bangalore",
    appliedDate: "2025-05-20",
    status: "Under Review",
    statusColor: "blue",
  },
  {
    id: "aj2",
    title: "Frontend Engineer",
    company: "Wipro",
    location: "Hyderabad",
    appliedDate: "2025-05-15",
    status: "Shortlisted",
    statusColor: "green",
  },
  {
    id: "aj3",
    title: "UI Developer",
    company: "HCL Technologies",
    location: "Noida",
    appliedDate: "2025-05-08",
    status: "Rejected",
    statusColor: "red",
  },
  {
    id: "aj4",
    title: "React.js Developer",
    company: "Cognizant",
    location: "Chennai",
    appliedDate: "2025-04-28",
    status: "Interview Scheduled",
    statusColor: "purple",
  },
];

export const MOCK_SAVED_JOBS = [
  {
    id: "sj1",
    title: "Full Stack Developer",
    company: "Amazon",
    location: "Bangalore",
    salary: "₹20–28 LPA",
    postedDate: "2025-05-22",
    type: "Full-time",
  },
  {
    id: "sj2",
    title: "Frontend Architect",
    company: "Microsoft",
    location: "Hyderabad",
    salary: "₹25–35 LPA",
    postedDate: "2025-05-19",
    type: "Full-time",
  },
  {
    id: "sj3",
    title: "React Native Developer",
    company: "Swiggy",
    location: "Bangalore",
    salary: "₹15–20 LPA",
    postedDate: "2025-05-17",
    type: "Full-time",
  },
];

export const MOCK_NOTIFICATIONS = [
  {
    id: "n1",
    type: "application",
    companyName: "Wipro",
    jobTitle: "Frontend Engineer",
    message: "Your application at Wipro has been shortlisted.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "n2",
    type: "interview",
    companyName: "Cognizant",
    jobTitle: "React.js Developer",
    message: "Interview scheduled with Cognizant on June 2, 2025 at 11:00 AM.",
    time: "5 hours ago",
    read: false,
  },
  {
    id: "n3",
    type: "profile",
    companyName: "TCS",
    message: "Your profile was viewed by a recruiter from TCS.",
    time: "1 day ago",
    read: true,
  },
  {
    id: "n4",
    type: "application",
    companyName: "HCL Technologies",
    jobTitle: "UI Developer",
    message: "HCL Technologies has updated your application status.",
    time: "2 days ago",
    read: true,
  },
];
