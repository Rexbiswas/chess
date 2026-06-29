import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useGameStore } from '../hooks/useGameStore';

export const Modal = ({ isOpen, onClose, title, children }) => {
  const theme = useGameStore((state) => state.theme);

  const getThemeClass = () => {
    switch (theme) {
      case 'emerald': return 'border-emerald-500/25 shadow-emerald-950/20';
      case 'crimson': return 'border-red-500/25 shadow-red-950/20';
      case 'gold': return 'border-yellow-500/25 shadow-yellow-950/20';
      default: return 'border-cyan-500/25 shadow-cyan-950/20';
    }
  };

  const getThemeTextClass = () => {
    switch (theme) {
      case 'emerald': return 'text-emerald-400';
      case 'crimson': return 'text-red-400';
      case 'gold': return 'text-yellow-400';
      default: return 'text-cyber-cyan';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
          {/* Backdrop with strong blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`relative z-10 w-full max-w-md overflow-hidden rounded-2xl border bg-slate-950/90 p-6.5 shadow-2xl backdrop-blur-2xl ${getThemeClass()}`}
          >
            {/* Corner visual tech accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-slate-700/40 rounded-tl" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-slate-700/40 rounded-tr" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-slate-700/40 rounded-bl" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-slate-700/40 rounded-br" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-900 pb-4.5 mb-5 relative z-10">
              {title && (
                <h3 className={`text-base font-black tracking-widest uppercase font-mono ${getThemeTextClass()}`}>
                  {title}
                </h3>
              )}
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-450 hover:bg-slate-900/60 hover:text-slate-100 transition active:scale-90"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Content */}
            <div className="text-slate-350 text-sm relative z-10">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
