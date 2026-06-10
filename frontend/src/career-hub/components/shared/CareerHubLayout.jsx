import { Outlet, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CareerHubSidebar from './CareerHubSidebar';
import { useAuth } from '@/context/AuthContext';

/**
 * CareerHubLayout — nested inside MainLayout via PublicGuard.
 * Adds the two-column sidebar + content layout for all /career-hub/* pages.
 */
export const CareerHubLayout = () => {
  return (
    <div className="min-h-[calc(100vh-200px)] bg-neutral-50 pt-[104px] pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex gap-6 items-start">
          {/* Sidebar — sticky, hidden on mobile */}
          <div className="hidden lg:block sticky top-[120px]">
            <CareerHubSidebar />
          </div>

          {/* Page content */}
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

/**
 * CareerHubGuard — only allows candidates through.
 */
const CareerHubGuard = () => {
  const { isLoggedIn, userRole } = useAuth();
  if (isLoggedIn && userRole === 'candidate') return <CareerHubLayout />;
  return <Navigate to="/" replace />;
};

export default CareerHubGuard;
