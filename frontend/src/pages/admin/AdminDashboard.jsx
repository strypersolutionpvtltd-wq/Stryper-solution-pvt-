import { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  TrendingUp, TrendingDown, Clock, Filter, Download,
  X, ChevronDown, Check, Loader2, Info, Search,
  Users, Building2, Briefcase, Calendar, Eye
} from 'lucide-react';
import {
  OVERVIEW_STATS, USER_GROWTH_DATA, JOB_ANALYTICS_DATA,
  RECENT_ACTIVITY, ALL_USERS, ALL_JOBS,
  ALL_APPLICATIONS, ALL_STRYPER_PARTNERS,
} from '@/data/adminData';
import UserProfileModal from '@/components/admin/UserProfileModal';
import toast from 'react-hot-toast';

const fadeInUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const COLORS = ['#8B3A8F', '#F5A623', '#10b981', '#ef4444'];

// ── Stat info map ──────────────────────────────────────────────
const STAT_INFO = {
  'Total Users':  'Total registered users across all roles on the platform.',
  'Candidates':   'Active job seekers currently registered on the platform.',
  'Companies':    'Total verified and registered companies on the platform.',
  'Active Jobs':  'Job postings currently live and accepting applications.',
  'Applicants':   'Total job applications submitted across all listings.',
  'New Today':    'New user registrations recorded today.',
  'Revenue':      'Total platform revenue generated to date.',
  'Site Visits':  'Total unique traffic and page visits on the platform.',
};

// ── Filter config ──────────────────────────────────────────────
const FILTER_OPTIONS = {
  userType: {
    label: 'User Type',
    icon: Users,
    options: ['All', 'Candidate', 'Company', 'Stryper Partner', 'Admin'],
  },
  status: {
    label: 'Status',
    icon: Check,
    options: ['All', 'Active', 'Pending', 'Verified', 'Rejected', 'Shortlisted', 'Applied'],
  },
  period: {
    label: 'Time Range',
    icon: Calendar,
    options: ['Today', 'Last 7 Days', 'Last 30 Days', 'Last 6 Months', 'All Time'],
  },
};

// ── Normalised export row ──────────────────────────────────────
const normaliseRow = (item, role) => ({
  id:     item.id     ?? '',
  name:   item.name   ?? item.title ?? item.candidate ?? '',
  email:  item.email  ?? item.specialty ?? item.company ?? item.job ?? '',
  role,
  status: item.status ?? '',
  joined: item.joined ?? item.experience ?? item.date ?? '',
});

// Export only users/applications — no company rows
const getExportData = (userType, status) => {
  let data;
  switch (userType) {
    case 'Stryper Partner':  data = ALL_STRYPER_PARTNERS.map(r => normaliseRow(r, 'Stryper Partner')); break;
    case 'Jobs':        data = ALL_JOBS.map(r => normaliseRow(r, 'Job')); break;
    case 'Applications':data = ALL_APPLICATIONS.map(r => normaliseRow(r, 'Application')); break;
    default:            data = ALL_USERS.map(r => normaliseRow(r, r.role ?? 'User'));
  }
  if (status !== 'All') data = data.filter(d => d.status === status);
  return data;
};

const toCSV = (rows) => {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]).join(',');
  const body = rows.map(r => Object.values(r).map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  return `${headers}\n${body}`;
};

const downloadBlob = (content, filename, mime) => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

// ── InfoTooltip — Portal-based to escape overflow:hidden ──────
const InfoTooltip = ({ text }) => {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);

  const updatePos = () => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    setPos({ top: r.top + window.scrollY, left: r.left + r.width / 2 });
  };

  const handleEnter = () => { updatePos(); setShow(true); };
  const handleLeave = () => setShow(false);

  return (
    <>
      <button
        ref={btnRef}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className="w-5 h-5 rounded-full flex items-center justify-center text-neutral-600 hover:text-neutral-300 hover:bg-white/10 transition-all"
        aria-label="More info"
      >
        <Info size={12} />
      </button>

      {show && createPortal(
        <div
          style={{
            position: 'absolute',
            top: pos.top - 8,
            left: pos.left,
            transform: 'translate(-50%, -100%)',
            zIndex: 99999,
            pointerEvents: 'none',
            width: '200px',
          }}
        >
          <div className="bg-[#1a1a1a] border border-brand-purple-600/40 rounded-xl px-3 py-2.5 shadow-2xl shadow-black/80 backdrop-blur-xl">
            <p className="text-[11px] text-neutral-300 leading-relaxed">{text}</p>
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: '-5px',
              left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
              width: '10px',
              height: '10px',
              background: '#1a1a1a',
              borderRight: '1px solid rgba(139,58,143,0.4)',
              borderBottom: '1px solid rgba(139,58,143,0.4)',
            }}
          />
        </div>,
        document.body
      )}
    </>
  );
};

// ── FilterDropdown ─────────────────────────────────────────────
const FilterDropdown = ({ label, icon: Icon, options, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const isActive = value !== 'All' && value !== 'All Time';

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen(p => !p)}
        className={`flex items-center gap-2 h-10 px-4 rounded-xl border text-sm font-medium transition-all min-w-[150px] justify-between ${
          isActive
            ? 'bg-brand-purple-600/15 border-brand-purple-600/50 text-brand-purple-300'
            : open
            ? 'bg-white/8 border-brand-purple-600/30 text-white'
            : 'bg-white/5 border-white/8 text-neutral-300 hover:bg-white/8 hover:border-white/15'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          {Icon && <Icon size={13} className={isActive ? 'text-brand-purple-400' : 'text-neutral-500'} />}
          <span className="truncate text-xs">{value}</span>
        </div>
        <ChevronDown size={13} className={`shrink-0 text-neutral-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.13 }}
            className="absolute z-50 top-full mt-1.5 left-0 bg-[#161616] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/60 min-w-full"
          >
            <div className="px-3 py-2 border-b border-white/5">
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{label}</p>
            </div>
            {options.map(opt => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-neutral-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                <span>{opt}</span>
                {value === opt && <Check size={12} className="text-brand-purple-400 shrink-0" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── ExportDropdown ─────────────────────────────────────────────
const ExportDropdown = ({ onExport, loading }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen(p => !p)}
        disabled={loading}
        className="flex items-center gap-2 h-10 px-4 rounded-xl bg-brand-purple-600 text-white text-sm font-semibold hover:bg-brand-purple-700 transition-all shadow-lg shadow-brand-purple-600/25 disabled:opacity-60"
      >
        {loading ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
        Export
        <ChevronDown size={13} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.13 }}
            className="absolute z-50 top-full mt-1.5 right-0 bg-[#161616] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/60 min-w-[170px]"
          >
            {[
              { fmt: 'CSV',   desc: 'Comma-separated file' },
              { fmt: 'Excel', desc: 'Excel-compatible CSV'  },
              { fmt: 'PDF',   desc: 'Print-ready report'    },
            ].map(({ fmt, desc }) => (
              <button
                key={fmt}
                onClick={() => { onExport(fmt); setOpen(false); }}
                className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
              >
                <p className="text-sm text-white font-medium">Export as {fmt}</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">{desc}</p>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── AdminDashboard ─────────────────────────────────────────────
const AdminDashboard = () => {
  const [filters, setFilters] = useState({ userType: 'All', status: 'All', period: 'All Time' });
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportError, setExportError] = useState('');
  const [tableLoading, setTableLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [activities, setActivities] = useState(RECENT_ACTIVITY);
  const [loadingActivity, setLoadingActivity] = useState(false);

  // Debounce search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Loading state when filters change
  useEffect(() => {
    setTableLoading(true);
    const timer = setTimeout(() => setTableLoading(false), 600);
    return () => clearTimeout(timer);
  }, [filters, debouncedSearch]);

  const handleLoadMoreActivity = () => {
    setLoadingActivity(true);
    setTimeout(() => {
      const newItems = [
        { id: Date.now() + 1, user: 'Priya Verma', detail: 'Applied for UI/UX Designer', time: '5h ago' },
        { id: Date.now() + 2, user: 'Karan Singh', detail: 'Updated Company Profile', time: '6h ago' },
      ];
      setActivities([...activities, ...newItems]);
      setLoadingActivity(false);
      toast.success("Loaded more activity");
    }, 1000);
  };

  const activeFilterCount = [
    filters.userType !== 'All',
    filters.status !== 'All',
    filters.period !== 'All Time',
    debouncedSearch !== '',
  ].filter(Boolean).length;

  // Dynamic stats based on period
  const dynamicStats = useMemo(() => {
    if (filters.period === 'All Time') return OVERVIEW_STATS;
    
    // Mock variation for different periods
    return OVERVIEW_STATS.map(stat => {
      const val = parseInt(stat.value.replace(/[^0-9]/g, ''));
      let newVal = val;
      if (filters.period === 'Today') newVal = Math.floor(val / 30);
      else if (filters.period === 'Last 7 Days') newVal = Math.floor(val / 4);
      else if (filters.period === 'Last 30 Days') newVal = Math.floor(val / 2);

      return {
        ...stat,
        value: stat.value.includes('₹') ? `₹${(newVal/1000000).toFixed(1)}M` : 
               stat.value.includes('K') ? `${newVal}K` : newVal.toLocaleString(),
        change: filters.period === 'Today' ? '+2%' : stat.change
      };
    });
  }, [filters.period]);

  // Table rows — merged and filtered pool
  const filteredRows = useMemo(() => {
    // Merge all possible user entities into one pool
    let data = [
      ...ALL_USERS,
      ...ALL_STRYPER_PARTNERS.map(p => ({ ...p, role: 'Stryper Partner' }))
    ];

    // Filter by user type
    if (filters.userType !== 'All') {
      data = data.filter(u => u.role === filters.userType);
    }

    // Filter by status
    if (filters.status !== 'All') {
      data = data.filter(u => u.status === filters.status);
    }

    // Filter by search term
    if (debouncedSearch) {
      const lower = debouncedSearch.toLowerCase();
      data = data.filter(u => 
        (u.name?.toLowerCase() || '').includes(lower) || 
        (u.email?.toLowerCase() || '').includes(lower)
      );
    }

    return data.map(r => normaliseRow(r, r.role));
  }, [filters.userType, filters.status, filters.period, debouncedSearch]);

  const handleExport = async (format) => {
    setExportLoading(true);
    setExportError('');
    try {
      await new Promise(r => setTimeout(r, 500));
      const data = getExportData(filters.userType, filters.status);
      const filename = `stryper_${filters.userType.toLowerCase()}_${Date.now()}`;

      if (format === 'CSV') {
        downloadBlob(toCSV(data), `${filename}.csv`, 'text/csv');
      } else if (format === 'Excel') {
        downloadBlob('\uFEFF' + toCSV(data), `${filename}.csv`, 'application/vnd.ms-excel');
      } else if (format === 'PDF') {
        const headers = Object.keys(data[0] || {});
        const rows = data.map(r => `<tr>${Object.values(r).map(v => `<td>${v}</td>`).join('')}</tr>`).join('');
        const html = `<html><head><title>Stryper Export</title>
          <style>
            body{font-family:Arial,sans-serif;font-size:12px;color:#111;padding:24px}
            h2{color:#8B3A8F;margin-bottom:4px}
            p.sub{font-size:11px;color:#888;margin-bottom:16px}
            table{width:100%;border-collapse:collapse}
            th{background:#8B3A8F;color:#fff;padding:8px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.05em}
            td{padding:8px 12px;border-bottom:1px solid #eee}
            tr:nth-child(even) td{background:#f9f9f9}
          </style></head>
          <body>
            <h2>Stryper Admin — ${filters.userType} Report</h2>
            <p class="sub">Generated: ${new Date().toLocaleString()} · Status: ${filters.status} · Period: ${filters.period}</p>
            <table>
              <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
              <tbody>${rows}</tbody>
            </table>
          </body></html>`;
        const win = window.open('', '_blank');
        win.document.write(html);
        win.document.close();
        win.print();
      }
    } catch {
      setExportError('Export failed. Please try again.');
      setTimeout(() => setExportError(''), 3000);
    } finally {
      setExportLoading(false);
    }
  };

  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setIsProfileModalOpen(true);
  };

  return (
    <motion.div
      initial="hidden" animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      className="space-y-8 pb-10"
    >
      <UserProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        user={selectedUser} 
      />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Platform Overview</h2>
          <p className="text-neutral-500 text-sm mt-1">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Simple Search Bar */}
          <div className="relative flex items-center">
            <Search className="absolute left-3 text-neutral-500" size={16} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-purple-600/50 w-full sm:w-64 text-white"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 text-neutral-500 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <ExportDropdown onExport={handleExport} loading={exportLoading} />
        </div>
      </div>

      {/* Export error */}
      <AnimatePresence>
        {exportError && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400 flex items-center gap-2"
          >
            <X size={14} /> {exportError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stat cards — overflow-visible so portal tooltip is not needed for card clipping */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {OVERVIEW_STATS.map((stat) => (
          <motion.div
            key={stat.label} variants={fadeInUp} whileHover={{ y: -5 }}
            className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-5 relative group"
            style={{ overflow: 'visible' }}
          >
            {/* Decorative bg circle — clipped manually */}
            <div
              className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform duration-500 pointer-events-none"
              style={{ overflow: 'hidden', borderRadius: '0 1rem 0 100%' }}
            />
            <div className="flex items-center justify-between mb-4">
              <span className="text-neutral-500 text-xs font-bold uppercase tracking-widest">{stat.label}</span>
              <div className="flex items-center gap-1.5">
                <InfoTooltip text={STAT_INFO[stat.label] ?? `Shows ${stat.label.toLowerCase()} data.`} />
                <div className={`p-2 rounded-lg ${stat.type === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                  {stat.type === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                </div>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
              <span className={`text-xs font-bold ${stat.type === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={fadeInUp} className="lg:col-span-2 bg-[#0f0f0f] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg text-white">Registration Growth</h3>
            <select
              value={filters.period}
              onChange={e => setFilters(p => ({ ...p, period: e.target.value }))}
              className="bg-white/5 border border-white/5 text-xs rounded-lg px-3 py-1.5 outline-none text-neutral-400 cursor-pointer"
            >
              {FILTER_OPTIONS.period.options.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={USER_GROWTH_DATA}>
                <defs>
                  <linearGradient id="colorCand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B3A8F" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B3A8F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f0f0f', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} />
                <Area type="monotone" dataKey="candidates" stroke="#8B3A8F" strokeWidth={3} fillOpacity={1} fill="url(#colorCand)" />
                <Area type="monotone" dataKey="companies" stroke="#F5A623" strokeWidth={3} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6">
          <h3 className="font-bold text-lg text-white mb-8">Job Analytics</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={JOB_ANALYTICS_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                  {JOB_ANALYTICS_DATA.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-medium">
            <span className="text-neutral-500 uppercase tracking-widest">Efficiency Rate</span>
            <span className="text-emerald-500">+14.2%</span>
          </div>
        </motion.div>
      </div>

      {/* Table + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={fadeInUp} className="lg:col-span-2 bg-[#0f0f0f] border border-white/5 rounded-2xl overflow-hidden relative">
          <div className="p-6 flex items-center justify-between border-b border-white/5">
            <div>
              <h3 className="font-bold text-white">
                {filters.userType === 'All' ? 'Latest Registrations' : `${filters.userType}s`}
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">{filteredRows.length} records</p>
            </div>
            <button className="text-brand-purple-400 text-xs font-bold hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto min-h-[400px]">
            {tableLoading ? (
              <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 size={32} className="animate-spin text-brand-purple-600" />
                  <p className="text-xs font-bold text-white uppercase tracking-widest">Filtering Data...</p>
                </div>
              </div>
            ) : null}
            <table className="w-full text-left border-collapse">
              <thead className="bg-white/5">
                <tr>
                  {['Name', 'Type', 'Status', 'Actions'].map((h, i) => (
                    <th key={h} className={`px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest ${i === 3 ? 'text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRows.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-10 text-center text-neutral-600 text-sm">No records match the current filters.</td></tr>
                ) : filteredRows.map((row) => (
                  <tr 
                    key={row.id} 
                    onClick={() => handleViewProfile(row)}
                    className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-white group-hover:text-brand-purple-400 transition-colors">{row.name}</p>
                      <p className="text-[11px] text-neutral-500 mt-0.5">{row.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                        row.role === 'Company'         ? 'bg-orange-500/10 text-orange-500' :
                        row.role === 'Stryper Partner' ? 'bg-blue-500/10 text-blue-400' :
                        row.role === 'Application'     ? 'bg-teal-500/10 text-teal-400' :
                        'bg-purple-500/10 text-purple-500'
                      }`}>{row.role}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          ['Active','Verified','Shortlisted'].includes(row.status) ? 'bg-emerald-500' :
                          row.status === 'Pending' ? 'bg-amber-500' : 'bg-neutral-500'
                        }`} />
                        <span className="text-xs text-neutral-400 font-medium">{row.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => handleViewProfile(row)}
                          className="p-2 rounded-lg hover:bg-brand-purple-600/10 text-neutral-400 hover:text-brand-purple-400 transition-all group/btn"
                          title="View Profile"
                        >
                          <Eye size={16} className="group-hover/btn:scale-110 transition-transform" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-white">Live Activity</h3>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full uppercase tracking-widest animate-pulse">Live</span>
          </div>
          <div className="space-y-6">
            {activities.map((activity, idx) => (
              <div key={activity.id} className="flex gap-4 relative">
                {idx !== activities.length - 1 && <div className="absolute top-8 left-4 w-px h-10 bg-white/5" />}
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                  <Clock size={14} className="text-neutral-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white">{activity.user}</p>
                    <span className="text-[10px] text-neutral-600 font-medium">{activity.time}</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1">{activity.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={handleLoadMoreActivity}
            disabled={loadingActivity}
            className="w-full mt-8 py-3 rounded-xl border border-white/5 text-xs font-bold text-neutral-400 hover:bg-white/5 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loadingActivity ? <Loader2 size={14} className="animate-spin" /> : null}
            {loadingActivity ? 'Loading...' : 'Load More Activity'}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;