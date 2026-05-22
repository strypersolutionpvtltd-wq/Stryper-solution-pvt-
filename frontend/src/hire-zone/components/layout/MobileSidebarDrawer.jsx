import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';

const MobileSidebarDrawer = ({ isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 z-40 bg-neutral-900/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          aria-hidden="true"
        />
        {/* Drawer */}
        <motion.div
          className="fixed top-0 left-0 bottom-0 z-50 w-[260px]"
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <Sidebar onClose={onClose} />
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default MobileSidebarDrawer;
