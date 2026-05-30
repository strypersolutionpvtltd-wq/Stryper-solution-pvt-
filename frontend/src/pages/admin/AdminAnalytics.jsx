import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, Cell, PieChart, Pie
} from 'recharts';
import { TrendingUp, Users, Briefcase, IndianRupee, Download, Filter, Calendar } from 'lucide-react';
import { ANALYTICS_PERFORMANCE, REVENUE_DATA, JOB_ANALYTICS_DATA } from '@/data/adminData';
import toast from 'react-hot-toast';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const COLORS = ['#8B3A8F', '#F5A623', '#10b981', '#ef4444'];

const AdminAnalytics = () => {
  const handleDownload = () => {
    toast.loading('Preparing PDF report...');
    setTimeout(() => {
      toast.dismiss();
      window.print();
    }, 1000);
  };

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
          <button 
            onClick={() => toast('Date range selection coming soon!', { icon: '📅' })}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-sm font-medium hover:bg-white/10 transition-colors"
          >
            <Calendar size={16} />
            May 2026
          </button>
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
              <AreaChart data={ANALYTICS_PERFORMANCE}>
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
              <BarChart data={REVENUE_DATA}>
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
          { label: 'Conversion Rate', value: '18.4%', icon: TrendingUp, color: 'text-emerald-500' },
          { label: 'Avg. Hires/Company', value: '4.2', icon: Users, color: 'text-brand-purple-400' },
          { label: 'Job Fill Rate', value: '72%', icon: Briefcase, color: 'text-brand-gold-500' },
          { label: 'Monthly Revenue', value: '₹4.2M', icon: IndianRupee, color: 'text-emerald-500' },
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
