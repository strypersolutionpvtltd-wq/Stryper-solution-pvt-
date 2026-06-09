import { useEffect } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

// Public layout + pages
import MainLayout  from '@/layouts/MainLayout';
import Home        from '@/pages/Home';
import About       from '@/pages/About';
import Services    from '@/pages/Services';
import IndustrialManpower from '@/pages/services/IndustrialManpower';
import LogisticsWarehouse from '@/pages/services/LogisticsWarehouse';
import FacilityManagement from '@/pages/services/FacilityManagement';
import PayrollCompliance from '@/pages/services/PayrollCompliance';
import Industries  from '@/pages/Industries';
import Careers     from '@/pages/Careers';
import Jobs        from '@/pages/Jobs';
import Contact     from '@/pages/Contact';
import NotFound    from '@/pages/NotFound';

// Career Hub layout + pages
import CareerHubGuard   from '@/career-hub/components/shared/CareerHubLayout';
import CHProfile        from '@/career-hub/pages/Profile';
import CHInterviews     from '@/career-hub/pages/Interviews';
import CHResume         from '@/career-hub/pages/Resume';
import CHAppliedJobs    from '@/career-hub/pages/AppliedJobs';
import CHSavedJobs      from '@/career-hub/pages/SavedJobs';
import CHNotifications  from '@/career-hub/pages/Notifications';
import CHSettings       from '@/career-hub/pages/Settings';

// Hire Zone layout + pages
import HireZoneLayout   from '@/hire-zone/components/layout/HireZoneLayout';
import HireZoneNotFound from '@/hire-zone/components/shared/HireZoneNotFound';
import Dashboard        from '@/hire-zone/pages/Dashboard';
import PostJob          from '@/hire-zone/pages/PostJob';
import ManageJobs       from '@/hire-zone/pages/ManageJobs';
import ResumeSearch     from '@/hire-zone/pages/ResumeSearch';
import Applicants       from '@/hire-zone/pages/Applicants';
import Interviews       from '@/hire-zone/pages/Interviews';
import Analytics        from '@/hire-zone/pages/Analytics';
import Notifications    from '@/hire-zone/pages/Notifications';
import Settings         from '@/hire-zone/pages/Settings';
import CompanyProfile   from '@/hire-zone/pages/CompanyProfile';

// Admin layout + pages
import AdminLayout    from '@/layouts/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsers     from '@/pages/admin/AdminUsers';
import AdminUserDetail  from '@/pages/admin/AdminUserDetail';
import AdminCompanies from '@/pages/admin/AdminCompanies';
import AdminJobs      from '@/pages/admin/AdminJobs';
import AdminStryperPartners from '@/pages/admin/AdminStryperPartners';
import AdminApplications from '@/pages/admin/AdminApplications';
import AdminAnalytics from '@/pages/admin/AdminAnalytics';
import AdminNotifications from '@/pages/admin/AdminNotifications';
import AdminSettings from '@/pages/admin/AdminSettings';
import RestrictedAccess from '@/pages/RestrictedAccess';

/**
 * Guard for /admin/* — strict restriction.
 * Redirects to /restricted-area if not authenticated as admin.
 */
const AdminGuard = () => {
  const { isLoggedIn, userRole } = useAuth();
  if (isLoggedIn && userRole === 'admin') return <AdminLayout />;
  return <Navigate to="/restricted-area" replace />;
};

/**
 * Guard for /hire-zone/* — redirects to / if not authenticated as company.
 * Renders HireZoneLayout (which contains <Outlet />) when authenticated.
 */
const HireZoneGuard = () => {
  const { isLoggedIn, userRole } = useAuth();
  if (isLoggedIn && userRole === 'company') return <HireZoneLayout />;
  return <Navigate to="/" replace />;
};

/**
 * Guard for public routes — redirects authenticated companies/admins to their dashboards.
 * Renders MainLayout (which contains <Outlet />) for everyone else.
 */
const PublicGuard = () => {
  const { isLoggedIn, userRole } = useAuth();
  const { pathname } = useLocation();

  if (isLoggedIn && pathname === '/') {
    if (userRole === 'company') return <Navigate to="/hire-zone/dashboard" replace />;
    if (userRole === 'admin') return <Navigate to="/admin/dashboard" replace />;
  }
  return <MainLayout />;
};

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Prevent smooth scroll jumps for admin and hire-zone dashboards
    if (!pathname.startsWith('/hire-zone') && !pathname.startsWith('/admin')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname]);

  return (
    <Routes>
      {/* ── Public routes + Career Hub (both use MainLayout) ── */}
      <Route element={<PublicGuard />}>
        <Route path="/"           element={<Home />} />
        <Route path="/about"      element={<About />} />
        <Route path="/services"   element={<Services />} />
        <Route path="/services/industrial-manpower"   element={<IndustrialManpower />} />
        <Route path="/services/logistics-warehouse"   element={<LogisticsWarehouse />} />
        <Route path="/services/facility-management"   element={<FacilityManagement />} />
        <Route path="/services/payroll-compliance"    element={<PayrollCompliance />} />
        <Route path="/industries" element={<Industries />} />
        <Route path="/careers"    element={<Careers />} />
        <Route path="/jobs"       element={<Jobs />} />
        <Route path="/contact"    element={<Contact />} />
        <Route path="*"           element={<NotFound />} />

        {/* Career Hub — nested inside MainLayout, guarded by role */}
        <Route path="/career-hub" element={<CareerHubGuard />}>
          <Route index element={<Navigate to="/career-hub/profile" replace />} />
          <Route path="profile"       element={<CHProfile />} />
          <Route path="interviews"    element={<CHInterviews />} />
          <Route path="resume"        element={<CHResume />} />
          <Route path="applied-jobs"  element={<CHAppliedJobs />} />
          <Route path="saved-jobs"    element={<CHSavedJobs />} />
          <Route path="notifications" element={<CHNotifications />} />
          <Route path="settings"      element={<CHSettings />} />
        </Route>
      </Route>

      {/* ── Hire Zone routes ── */}
      <Route path="/hire-zone" element={<HireZoneGuard />}>
        <Route index element={<Navigate to="/hire-zone/dashboard" replace />} />
        <Route path="dashboard"        element={<Dashboard />} />
        <Route path="post-job"         element={<PostJob />} />
        <Route path="manage-jobs"      element={<ManageJobs />} />
        <Route path="resume-search"    element={<ResumeSearch />} />
        <Route path="applicants"       element={<Applicants />} />
        <Route path="interviews"       element={<Interviews />} />
        <Route path="analytics"        element={<Analytics />} />
        <Route path="notifications"    element={<Notifications />} />
        <Route path="settings"         element={<Settings />} />
        <Route path="company-profile"  element={<CompanyProfile />} />
        <Route path="*"                element={<HireZoneNotFound />} />
      </Route>

      {/* ── Admin routes ── */}
      <Route path="/admin" element={<AdminGuard />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard"    element={<AdminDashboard />} />
        <Route path="users"        element={<AdminUsers />} />
        <Route path="users/:id"    element={<AdminUserDetail />} />
        <Route path="companies"    element={<AdminCompanies />} />
        <Route path="consultants"  element={<AdminStryperPartners />} />
        <Route path="jobs"         element={<AdminJobs />} />
        <Route path="applications" element={<AdminApplications />} />
        <Route path="analytics"    element={<AdminAnalytics />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="settings"     element={<AdminSettings />} />
        
        {/* Placeholder routes for other admin pages */}
        <Route path="*" element={<div className="p-10 text-center text-neutral-500">Page under development</div>} />
      </Route>

      {/* Restricted Access Page */}
      <Route path="/restricted-area" element={<RestrictedAccess />} />
    </Routes>
  );
}

export default App;
