import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export function HistoryLoadingScreen({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
        >
          <img src="https://media.giphy.com/media/nrOxkPtjln6ZG/giphy.gif" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/75" />
          <div className="relative z-10 text-center space-y-4">
            <Loader2 className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
            <p className="font-heading text-2xl font-bold text-white">Entering the historical realm...</p>
            <p className="text-amber-300/70 text-sm">Preparing your journey through time</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
