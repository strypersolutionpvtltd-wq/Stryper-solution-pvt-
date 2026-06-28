import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, Cell, PieChart, Pie
} from 'recharts';
import { TrendingUp, Users, Briefcase, IndianRupee, Download, Filter, Calendar, Loader2 } from 'lucide-react';
import { admin } from '@/utils/api';
import toast from 'react-hot-toast';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const COLORS = ['#8B3A8F', '#F5A623', '#10b981', '#ef4444'];

const AdminAnalytics = () => {
  const [data, setData] = useState({
    performanceData: [],
    revenueData: [],
    stats: {
      conversionRate: '0%',
      avgHires: '0',
      fillRate: '0%',
      monthlyRevenue: '₹0'
    }
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [usersRes, jobsRes, appsRes] = await Promise.all([
        admin.getAllUsers({ limit: 1000 }),
        admin.getAllJobs({ limit: 1000 }),
        admin.getAllApplications({ limit: 1000 })
      ]);

      const users = usersRes.data?.users || [];
      const jobs = jobsRes.data?.jobs || [];
      const applications = appsRes.data?.applications || [];

      // 1. KPI Stats
      const totalApps = applications.length;
      const totalHired = applications.filter(a => ['Accepted', 'Shortlisted'].includes(a.status)).length;
      const conversionRate = totalApps > 0 ? `${((totalHired / totalApps) * 100).toFixed(1)}%` : '0%';

      const totalCompanies = users.filter(u => u.role === 'COMPANY').length;
      const avgHires = totalCompanies > 0 ? (totalHired / totalCompanies).toFixed(1) : '0';

      const closedOrHiredJobs = jobs.filter(j => 
        j.status === 'Closed' || j.status === 'Expired' ||
        applications.some(a => (a.jobId?._id === j._id || a.jobId === j._id) && a.status === 'Accepted')
      ).length;
      const fillRate = jobs.length > 0 ? `${((closedOrHiredJobs / jobs.length) * 100).toFixed(0)}%` : '0%';

      // 2. Application & Hiring Trends (Last 7 Days)
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const performanceData = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(startOfToday);
        d.setDate(startOfToday.getDate() - i);
        const dStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const dEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

        // Count apps applied on this day
        const dayApps = applications.filter(a => {
          const appliedDate = a.appliedDate || a.createdAt;
          if (!appliedDate) return false;
          const ad = new Date(appliedDate);
          return ad >= dStart && ad <= dEnd;
        });

        // Count hires/acceptances on this day (or apps created on this day that were accepted/shortlisted)
        const dayHires = dayApps.filter(a => ['Accepted', 'Shortlisted'].includes(a.status)).length;

        performanceData.push({
          day: days[d.getDay()],
          apps: dayApps.length,
          hires: dayHires
        });
      }

      // 3. Revenue Data (All 0s as requested by user)
      const monthsNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const revenueData = [];
      const currentMonthIdx = now.getMonth();
      for (let i = 5; i >= 0; i--) {
        const idx = (currentMonthIdx - i + 12) % 12;
        revenueData.push({
          name: monthsNames[idx],
          value: 0
        });
      }

      setData({
        performanceData,
        revenueData,
        stats: {
          conversionRate,
          avgHires,
          fillRate,
          monthlyRevenue: '₹0'
        }
      });
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    // Auto-refresh har 30 second mein — realtime data ke liye
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);


  const handleDownload = () => {
    toast.loading('Preparing PDF report...');
    setTimeout(() => {
      toast.dismiss();
      window.print();
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3 text-white">
        <Loader2 size={40} className="animate-spin text-brand-purple-600" />
        <p className="text-sm font-bold uppercase tracking-widest animate-pulse">Loading Analytics...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      className="space-y-8 pb-10"
    >
      <style>{`
        @media print {
          aside, header, .flex.items-center.gap-3, button {
            display: none !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          .grid {
            display: block !important;
          }
          .rounded-2xl {
            border: 1px solid #eee !important;
            break-inside: avoid;
            margin-bottom: 2rem;
          }
          .bg-[#0f0f0f] {
            background: white !important;
          }
          h2, h3, h4, p {
            color: black !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Performance Analytics</h2>
          <p className="text-neutral-500 text-sm mt-1">Deep dive into platform growth and revenue metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            <input 
              type="date" 
              className="pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/5 text-sm font-medium hover:bg-white/10 transition-colors text-white focus:outline-none appearance-none cursor-pointer [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
            />
          </div>
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-purple-600 text-white text-sm font-semibold hover:bg-brand-purple-700 transition-all"
          >
            <Download size={16} />
            Download PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={fadeInUp} className="lg:col-span-2 bg-[#0f0f0f] border border-white/5 rounded-2xl p-6">
          <h3 className="font-bold text-white mb-6">Application & Hiring Trends</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.performanceData}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B3A8F" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B3A8F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f0f0f', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="apps" stroke="#8B3A8F" fillOpacity={1} fill="url(#colorApps)" strokeWidth={3} />
                <Area type="monotone" dataKey="hires" stroke="#10b981" fillOpacity={0} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6">
          <h3 className="font-bold text-white mb-6">Revenue Growth (₹)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f0f0f', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}
                />
                <Bar dataKey="value" fill="#F5A623" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Conversion Rate', value: data.stats.conversionRate, icon: TrendingUp, color: 'text-emerald-500' },
          { label: 'Avg. Hires/Company', value: data.stats.avgHires, icon: Users, color: 'text-brand-purple-400' },
          { label: 'Job Fill Rate', value: data.stats.fillRate, icon: Briefcase, color: 'text-brand-gold-500' },
          { label: 'Monthly Revenue', value: data.stats.monthlyRevenue, icon: IndianRupee, color: 'text-emerald-500' },
        ].map((item) => (
          <motion.div 
            key={item.label}
            variants={fadeInUp}
            className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl bg-white/5 ${item.color}`}>
              <item.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">{item.label}</p>
              <h4 className="text-xl font-bold text-white mt-1">{item.value}</h4>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AdminAnalytics;
