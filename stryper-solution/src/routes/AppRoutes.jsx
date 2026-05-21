import { Routes, Route } from 'react-router-dom';

import Home       from '@/pages/Home';
import About      from '@/pages/About';
import Services   from '@/pages/Services';
import Industries from '@/pages/Industries';
import Careers    from '@/pages/Careers';
import Jobs       from '@/pages/Jobs';
import Contact    from '@/pages/Contact';
import NotFound   from '@/pages/NotFound';

/**
 * Centralised route configuration.
 * Add new routes here - keeps App.jsx clean.
 */
const AppRoutes = () => (
  <Routes>
    <Route path="/"           element={<Home />} />
    <Route path="/about"      element={<About />} />
    <Route path="/services"   element={<Services />} />
    <Route path="/industries" element={<Industries />} />
    <Route path="/careers"    element={<Careers />} />
    <Route path="/jobs"       element={<Jobs />} />
    <Route path="/contact"    element={<Contact />} />
    <Route path="*"           element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
