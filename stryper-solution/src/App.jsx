import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import AppRoutes from '@/routes/AppRoutes';
import MainLayout from '@/layouts/MainLayout';

/**
 * Root application component.
 * Handles global scroll-to-top on route change and wraps
 * all pages inside the shared MainLayout.
 */
function App() {
  const { pathname } = useLocation();

  // Smooth scroll to top on every route transition
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return (
    <MainLayout>
      <AppRoutes />
    </MainLayout>
  );
}

export default App;
