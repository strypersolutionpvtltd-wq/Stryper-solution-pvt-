import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MobileSidebarDrawer from './MobileSidebarDrawer';

/**
 * Full-screen layout for all /hire-zone/* routes.
 * No public Navbar or Footer.
 * Desktop: fixed 260px sidebar + scrollable content area.
 * Mobile: hamburger-triggered drawer.
 *
 * NOTE: No AnimatePresence/motion wrapper around Outlet —
 * that caused blank pages on navigation with HashRouter.
 * Each page handles its own entrance animation independently.
 */
const HireZoneLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-neutral-50 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-[260px] lg:shrink-0 h-full">
        <Sidebar />
      </div>

      {/* Mobile sidebar drawer */}
      <MobileSidebarDrawer isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        <TopBar onMenuToggle={() => setMobileOpen(p => !p)} />

        {/* Scrollable page content — Outlet renders directly, no animation wrapper */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HireZoneLayout;
