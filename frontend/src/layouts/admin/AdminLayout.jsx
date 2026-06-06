import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import ConfirmModal from '@/components/shared/ConfirmModal';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Briefcase, 
  FileText, 
  BarChart3, 
  Bell, 
  Settings, 
  LogOut,
  Menu,
  X,
  CheckCircle2
} from 'lucide-react';
import { ADMIN_NOTIFICATIONS } from '@/data/adminData';

// ... (SidebarItem component remains the same) ...
const SidebarItem = ({ icon: Icon, label, path, active, collapsed, onClick }) => {
  const content = (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer ${
        active 
          ? 'bg-brand-purple-600 text-white shadow-lg shadow-brand-purple-600/20' 
          : 'text-neutral-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <Icon size={20} className={active ? 'text-white' : 'group-hover:text-white'} />
      {!collapsed && (
        <span className="text-sm font-medium whitespace-nowrap overflow-hidden">{label}</span>
      )}
      {active && !collapsed && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shrink-0" />
      )}
    </div>
  );

  if (onClick) {
    return <div onClick={onClick}>{content}</div>;
  }

  return <Link to={path}>{content}</Link>;
};

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, userData } = useAuth();

  const unreadCount = ADMIN_NOTIFICATIONS.filter(n => !n.read).length;

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const NAV_ITEMS = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { label: 'Users', icon: Users, path: '/admin/users' },
    { label: 'Companies', icon: Building2, path: '/admin/companies' },
    { label: 'Stryper Partners', icon: Briefcase, path: '/admin/consultants' },
    { label: 'Jobs', icon: Briefcase, path: '/admin/jobs' },
    { label: 'Applications', icon: FileText, path: '/admin/applications' },
    { label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    { label: 'Notifications', icon: Bell, path: '/admin/notifications' },
    { label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <>
      <ConfirmModal 
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out of the Admin Control Center? You will need to sign in again to access these features."
        confirmText="Log Out"
        isDanger={true}
      />
      <div 
        className="grid min-h-screen bg-[#0a0a0a] text-white transition-[grid-template-columns] duration-300 ease-in-out"
        style={{ 
          gridTemplateColumns: mobileOpen ? '1fr' : (collapsed ? '80px 1fr' : '256px 1fr'),
          scrollbarGutter: 'stable'
        }}
      >
        <Toaster position="top-right" reverseOrder={false} />
        {/* ── Sidebar (Fixed Position but Grid Aware) ── */}
        <aside 
          className={`hidden lg:flex flex-col bg-[#0f0f0f] border-r border-white/5 h-screen sticky top-0 overflow-hidden z-50`}
        >
          <div className="p-6 h-20 flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setCollapsed(!collapsed)}
              className="w-8 h-8 rounded-lg bg-brand-purple-600 flex items-center justify-center shrink-0 hover:bg-brand-purple-700 transition-colors"
            >
              <Menu size={18} className="text-white" />
            </button>
            {!collapsed && (
              <span className="font-display font-bold text-lg tracking-tight whitespace-nowrap overflow-hidden">
                Stryper Admin
              </span>
            )}
          </div>

          <nav className="flex-1 px-3 space-y-1 mt-4 overflow-y-auto no-scrollbar">
            {NAV_ITEMS.map((item) => (
              <SidebarItem 
                key={item.path} 
                {...item} 
                active={location.pathname === item.path} 
                collapsed={collapsed}
              />
            ))}
          </nav>

          <div className="p-4 border-t border-white/5 shrink-0">
            <SidebarItem 
              icon={LogOut} 
              label="Logout" 
              onClick={handleLogoutClick}
              collapsed={collapsed}
            />
          </div>
        </aside>

      {/* ── Mobile Sidebar (Drawer) ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed inset-y-0 left-0 z-[70] w-64 bg-[#0f0f0f] border-r border-white/5 flex flex-col lg:hidden"
            >
              <div className="p-6 h-20 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-purple-600 flex items-center justify-center shrink-0">
                  <Menu size={18} className="text-white" />
                </div>
                <span className="font-display font-bold text-lg tracking-tight">Stryper Admin</span>
              </div>
              <nav className="flex-1 px-3 space-y-1 mt-4">
                {NAV_ITEMS.map((item) => (
                  <SidebarItem 
                    key={item.path} 
                    {...item} 
                    active={location.pathname === item.path} 
                    collapsed={false}
                  />
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content Area ── */}
      <div className="flex flex-col min-w-0 h-screen overflow-y-auto relative bg-[#0a0a0a]">
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 px-6 h-20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileOpen(!mobileOpen)} 
              className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-neutral-400"
            >
              <Menu size={20} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`relative p-2 rounded-xl transition-colors ${showNotifications ? 'bg-brand-purple-600/20 text-brand-purple-400' : 'hover:bg-white/5 text-neutral-400'}`}
                  title="Notifications"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border-2 border-[#0a0a0a]" />
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-80 bg-[#161616] border border-white/10 rounded-2xl shadow-2xl z-20 overflow-hidden"
                      >
                        <div className="p-4 border-b border-white/5 flex items-center justify-between">
                          <h3 className="text-sm font-bold text-white">Notifications</h3>
                          <Link to="/admin/notifications" onClick={() => setShowNotifications(false)} className="text-[10px] font-bold text-brand-purple-400 uppercase hover:underline">View All</Link>
                        </div>
                        <div className="max-h-[350px] overflow-y-auto no-scrollbar">
                          {ADMIN_NOTIFICATIONS.slice(0, 5).map(n => (
                            <div key={n.id} className="p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => { navigate('/admin/notifications'); setShowNotifications(false); }}>
                              <div className="flex justify-between items-start mb-1">
                                <p className={`text-xs font-bold ${n.read ? 'text-neutral-400' : 'text-white'}`}>{n.title}</p>
                                <span className="text-[9px] text-neutral-600 whitespace-nowrap">{n.time}</span>
                              </div>
                              <p className="text-[11px] text-neutral-500 line-clamp-2">{n.message}</p>
                            </div>
                          ))}
                        </div>
                        <button 
                          onClick={() => { navigate('/admin/notifications'); setShowNotifications(false); }}
                          className="w-full py-3 bg-white/5 text-[11px] font-bold text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          Show all notifications
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-white uppercase">Super Admin</p>
                  <p className="text-[10px] text-neutral-500 uppercase font-medium tracking-tighter">Stryper Sol.</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-purple-600 to-brand-gold-500 flex items-center justify-center font-bold text-sm">
                  A
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 max-w-[1600px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
    </>
  );
};

export default AdminLayout;