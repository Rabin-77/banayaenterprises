import React, { useState } from 'react';
import { motion, useScroll, useSpring, useMotionValueEvent, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'none';
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  id?: string;
  onClick?: () => void;
  amount?: number;
}

const SMOOTH_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 28,
  className = '',
  id,
  onClick,
  amount = 0.12
}) => {
  const getInitial = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: distance };
      case 'down':
        return { opacity: 0, y: -distance };
      case 'left':
        return { opacity: 0, x: -distance };
      case 'right':
        return { opacity: 0, x: distance };
      case 'scale':
        return { opacity: 0, scale: 0.94 };
      case 'none':
      default:
        return { opacity: 0 };
    }
  };

  const getTarget = () => {
    switch (direction) {
      case 'up':
      case 'down':
        return { opacity: 1, y: 0 };
      case 'left':
      case 'right':
        return { opacity: 1, x: 0 };
      case 'scale':
        return { opacity: 1, scale: 1 };
      case 'none':
      default:
        return { opacity: 1 };
    }
  };

  return (
    <motion.div
      id={id}
      onClick={onClick}
      initial={getInitial()}
      whileInView={getTarget()}
      viewport={{ once: true, amount }}
      transition={{
        duration,
        delay,
        ease: SMOOTH_EASE
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    restDelta: 0.001
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#064E3B] via-[#059669] to-amber-400 origin-left z-50 pointer-events-none"
      aria-hidden="true"
    />
  );
};

export const ScrollToTopButton: React.FC = () => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setVisible(latest > 450);
  });

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 16 }}
          transition={{ duration: 0.25, ease: SMOOTH_EASE }}
          onClick={handleScrollTop}
          className="fixed bottom-4 left-3.5 sm:bottom-6 sm:left-6 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#064E3B] hover:bg-[#047857] text-white shadow-lg hover:shadow-xl border border-emerald-700/60 flex items-center justify-center cursor-pointer transition-colors"
          aria-label="Scroll back to top"
          title="Back to top"
        >
          <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
