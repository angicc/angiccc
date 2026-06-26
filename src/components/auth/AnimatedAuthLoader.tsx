import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  mode: 'login' | 'logout';
  onComplete: () => void;
};

const LOGIN_LINES = [
  'Authenticating Agency Credentials...',
  'Initializing Neural Routing...',
  'Loading Platform State...',
  'Access Granted.',
];

const MATRIX_CHARS = '01アイウエオカキクケコABCDEF0123456789';

function randomChar() {
  return MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
}

function MatrixCell({ delay }: { delay: number }) {
  const [char, setChar] = useState(randomChar());

  useEffect(() => {
    const interval = setInterval(() => setChar(randomChar()), 120 + Math.random() * 180);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.6, 0.2, 0.5, 0] }}
      transition={{ delay, duration: 2.5, repeat: Infinity, repeatDelay: Math.random() * 2 }}
      className="text-emerald-400/40 text-xs font-mono select-none"
      style={{ fontSize: '10px' }}
    >
      {char}
    </motion.span>
  );
}

export default function AnimatedAuthLoader({ mode, onComplete }: Props) {
  const [lineIndex, setLineIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (mode === 'logout') {
      const t = setTimeout(() => {
        setVisible(false);
        setTimeout(onComplete, 600);
      }, 1400);
      return () => clearTimeout(t);
    }

    // Login: cycle through lines then exit
    const timers: ReturnType<typeof setTimeout>[] = [];
    LOGIN_LINES.forEach((_, i) => {
      timers.push(setTimeout(() => setLineIndex(i), i * 700));
    });
    timers.push(
      setTimeout(() => {
        setVisible(false);
        setTimeout(onComplete, 500);
      }, LOGIN_LINES.length * 700 + 400)
    );
    return () => timers.forEach(clearTimeout);
  }, [mode, onComplete]);

  const cells = Array.from({ length: 240 });

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="auth-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Matrix grid background */}
          {mode === 'login' && (
            <div
              className="absolute inset-0 grid gap-1 p-4"
              style={{ gridTemplateColumns: 'repeat(30, 1fr)' }}
            >
              {cells.map((_, i) => (
                <MatrixCell key={i} delay={i * 0.01} />
              ))}
            </div>
          )}

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center gap-6">
            {mode === 'login' ? (
              <>
                {/* Logo pulse */}
                <motion.div
                  animate={{ scale: [1, 1.08, 1], boxShadow: ['0 0 20px rgba(16,185,129,0.3)', '0 0 50px rgba(16,185,129,0.7)', '0 0 20px rgba(16,185,129,0.3)'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center"
                >
                  <span className="text-2xl font-black text-emerald-400">A</span>
                </motion.div>

                {/* Typing lines */}
                <div className="space-y-2 text-center min-h-[6rem]">
                  {LOGIN_LINES.map((line, i) => (
                    <motion.p
                      key={line}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: i <= lineIndex ? 1 : 0, y: i <= lineIndex ? 0 : 8 }}
                      transition={{ duration: 0.4 }}
                      className={`text-sm font-mono ${i === lineIndex ? 'text-emerald-400' : 'text-slate-600'}`}
                    >
                      {i < lineIndex ? '✓ ' : i === lineIndex ? '› ' : ''}{line}
                    </motion.p>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="w-48 h-0.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-emerald-400 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${((lineIndex + 1) / LOGIN_LINES.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </>
            ) : (
              <>
                {/* Logout: simple disconnection message */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <p className="text-2xl font-black text-white tracking-widest uppercase font-mono">
                    System Disconnected
                  </p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm text-slate-600 mt-2 font-mono"
                  >
                    Session terminated. Returning to base.
                  </motion.p>
                </motion.div>

                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1, ease: 'linear' }}
                  className="h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent"
                  style={{ width: '200px' }}
                />
              </>
            )}
          </div>

          {/* Scanline overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 3px)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
