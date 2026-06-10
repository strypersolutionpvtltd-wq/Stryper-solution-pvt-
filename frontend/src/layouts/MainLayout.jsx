import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import WhatsAppButton from '@/components/shared/WhatsAppButton';
import BackToTop from '@/components/shared/BackToTop';

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar />

      <main className="flex-1">
        {/* Support both nested route Outlet and direct children usage */}
        {children ?? <Outlet />}
      </main>

      <Footer />

      <BackToTop />
      <WhatsAppButton />
    </div>
  );
};

export default MainLayout;