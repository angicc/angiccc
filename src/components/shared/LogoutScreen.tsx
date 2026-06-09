import { motion } from 'framer-motion';
import { Logo } from '@/components/shared/Logo';

const LOGOUT_GIF = 'https://media.giphy.com/media/DhEMKGIDYp6QU/giphy.gif';

export function LogoutScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
    >
      <img
        src={LOGOUT_GIF}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/65" />
      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Logo />
        </motion.div>
        <div className="flex items-center gap-3">
          {[0, 0.2, 0.4].map((delay, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-amber-400"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
              transition={{ duration: 0.9, repeat: Infinity, delay }}
            />
          ))}
        </div>
        <p className="text-white/70 text-sm font-medium tracking-wide">Logging out…</p>
      </div>
    </motion.div>
  );
}
