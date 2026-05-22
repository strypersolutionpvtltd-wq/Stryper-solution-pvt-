import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

/**
 * Guards all /hire-zone/* routes.
 * Renders child routes only when authenticated as a company.
 * Redirects to public homepage otherwise.
 */
const ProtectedRoute = () => {
  const { isLoggedIn, userRole } = useAuth();

  if (isLoggedIn && userRole === 'company') {
    return <Outlet />;
  }

  return <Navigate to="/" replace />;
};

export default ProtectedRoute;
