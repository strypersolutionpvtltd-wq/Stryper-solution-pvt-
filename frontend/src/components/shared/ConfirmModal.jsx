import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", isDanger = true }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-neutral-900/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] w-full max-w-sm overflow-hidden pointer-events-auto border border-neutral-100"
            >
              <div className="p-10 pb-8">
                <div className="flex flex-col items-center text-center">
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-sm ${isDanger ? 'bg-red-50 text-red-600' : 'bg-brand-purple-50 text-brand-purple-700'}`}>
                    <AlertTriangle size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-3 tracking-tight">{title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed px-2">{message}</p>
                </div>
              </div>

              <div className="p-6 bg-neutral-50/50 border-t border-neutral-100 flex gap-4">
                <button
                  onClick={onClose}
                  className="flex-1 py-4 rounded-2xl text-sm font-bold text-neutral-500 hover:bg-white hover:shadow-sm transition-all"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  className={`flex-1 py-4 rounded-2xl text-sm font-bold text-white transition-all shadow-lg active:scale-95 ${
                    isDanger 
                      ? 'bg-red-600 hover:bg-red-700 shadow-red-200' 
                      : 'bg-brand-purple-600 hover:bg-brand-purple-700 shadow-brand-purple-200'
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
