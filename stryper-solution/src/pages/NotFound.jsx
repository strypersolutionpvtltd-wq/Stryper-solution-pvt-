import { Link } from 'react-router-dom';

/**
 * 404 Not Found Page
 */
const NotFound = () => {
  return (
    <section className="section-padding flex items-center justify-center min-h-[60vh]">
      <div className="container-sm text-center">
        <p className="text-8xl font-display font-bold text-gradient-purple mb-4">404</p>
        <h1 className="text-display-sm text-neutral-900 mb-4">Page Not Found</h1>
        <p className="text-neutral-500 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
