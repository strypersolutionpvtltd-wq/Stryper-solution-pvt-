import { useEffect } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

// Public layout + pages
import MainLayout  from '@/layouts/MainLayout';
import Home        from '@/pages/Home';
import About       from '@/pages/About';
import Services    from '@/pages/Services';
import Industries  from '@/pages/Industries';
import Careers     from '@/pages/Careers';
import Jobs        from '@/pages/Jobs';
import Contact     from '@/pages/Contact';
import NotFound    from '@/pages/NotFound';

// Career Hub layout + pages
import CareerHubGuard   from '@/career-hub/components/shared/CareerHubLayout';
import CHProfile        from '@/career-hub/pages/Profile';
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

/**
 * Guard for /admin/* — basic guard for demo.
 */
const AdminGuard = () => {
  // In real app, check for admin role
  return <AdminLayout />;
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
 * Guard for public routes — redirects authenticated companies to dashboard.
 * Renders MainLayout (which contains <Outlet />) for everyone else.
 */
const PublicGuard = () => {
  const { isLoggedIn, userRole } = useAuth();
  if (isLoggedIn && userRole === 'company') return <Navigate to="/hire-zone/dashboard" replace />;
  // Candidates stay on the main site — no redirect
  return <MainLayout />;
};

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!pathname.startsWith('/hire-zone')) {
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
        <Route path="/industries" element={<Industries />} />
        <Route path="/careers"    element={<Careers />} />
        <Route path="/jobs"       element={<Jobs />} />
        <Route path="/contact"    element={<Contact />} />
        <Route path="*"           element={<NotFound />} />

        {/* Career Hub — nested inside MainLayout, guarded by role */}
        <Route path="/career-hub" element={<CareerHubGuard />}>
          <Route index element={<Navigate to="/career-hub/profile" replace />} />
          <Route path="profile"       element={<CHProfile />} />
          <Route path="resume"        element={<CHResume />} />
          <Route path="applied-jobs"  element={<CHAppliedJobs />} />
          <Route path="saved-jobs"    element={<CHSavedJobs />} />
          <Route path="notifications" element={<CHNotifications />} />
          <Route path="settings"      element={<CHSettings />} />
        </Route>
      </Route>

      {/* ── Hire Zone routes ── */}      <Route path="/hire-zone" element={<HireZoneGuard />}>
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
        <Route path="dashboard" element={<AdminDashboard />} />
        {/* Placeholder routes for other admin pages */}
        <Route path="*" element={<div className="p-10 text-center text-neutral-500">Page under development</div>} />
      </Route>
    </Routes>
  );
}

export default App;
