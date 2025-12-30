import { motion, AnimatePresence } from "framer-motion";
import { Github } from "lucide-react";
import { useTransition } from "@/contexts/TransitionContext";

interface BroadcastTransitionProps {
  isActive: boolean;
}

const BroadcastTransition = ({ isActive }: BroadcastTransitionProps) => {
  const { transitionDirection } = useTransition();
  const direction = transitionDirection;
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
        >
          {/* Left panel - slides from left */}
          <motion.div
            className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-background via-background to-primary/20"
            initial={{ x: direction === "out" ? "0%" : "-100%" }}
            animate={{ x: direction === "in" ? "0%" : "-100%" }}
            exit={{ x: "-100%" }}
            transition={{
              duration: 0.6,
              ease: [0.76, 0, 0.24, 1],
              delay: direction === "out" ? 0 : 0.1,
            }}
          >
            {/* Diagonal stripe accent */}
            <motion.div
              className="absolute right-0 top-0 w-16 h-full bg-primary/30 origin-top-right"
              style={{ transform: "skewX(-12deg)", marginRight: "-8px" }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            />
            <motion.div
              className="absolute right-4 top-0 w-2 h-full bg-primary origin-top-right"
              style={{ transform: "skewX(-12deg)" }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.3, delay: 0.25 }}
            />
          </motion.div>

          {/* Right panel - slides from right */}
          <motion.div
            className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-background via-background to-primary/20"
            initial={{ x: direction === "out" ? "0%" : "100%" }}
            animate={{ x: direction === "in" ? "0%" : "100%" }}
            exit={{ x: "100%" }}
            transition={{
              duration: 0.6,
              ease: [0.76, 0, 0.24, 1],
              delay: direction === "out" ? 0 : 0.1,
            }}
          >
            {/* Diagonal stripe accent */}
            <motion.div
              className="absolute left-0 top-0 w-16 h-full bg-primary/30 origin-top-left"
              style={{ transform: "skewX(12deg)", marginLeft: "-8px" }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            />
            <motion.div
              className="absolute left-4 top-0 w-2 h-full bg-primary origin-top-left"
              style={{ transform: "skewX(12deg)" }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.3, delay: 0.25 }}
            />
          </motion.div>

          {/* Center logo burst */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: direction === "out" ? 1 : 0, scale: direction === "out" ? 1 : 0 }}
            animate={{ opacity: direction === "in" ? 1 : 0, scale: direction === "in" ? 1 : 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              duration: 0.4,
              delay: direction === "out" ? 0 : 0.3,
              ease: [0.34, 1.56, 0.64, 1],
            }}
          >
            {/* Glow ring */}
            <motion.div
              className="absolute w-40 h-40 rounded-full border-4 border-primary/50"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.5, opacity: [0, 1, 0] }}
              transition={{ duration: 0.6, delay: 0.4 }}
            />
            <motion.div
              className="absolute w-32 h-32 rounded-full bg-primary/20 blur-2xl"
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{ duration: 0.5, delay: 0.35 }}
            />
            
            {/* Logo container */}
            <motion.div
              className="relative w-24 h-24 rounded-2xl bg-card border-2 border-primary/50 flex items-center justify-center shadow-2xl"
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              exit={{ rotate: 180, scale: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.35,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            >
              <Github className="w-12 h-12 text-primary" />
            </motion.div>
          </motion.div>

          {/* Horizontal scan lines effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute left-0 right-0 h-px bg-primary/30"
                style={{ top: `${(i + 1) * 5}%` }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: [0, 1, 0] }}
                transition={{
                  duration: 0.4,
                  delay: 0.3 + i * 0.02,
                }}
              />
            ))}
          </motion.div>

          {/* Corner accents */}
          <motion.div
            className="absolute top-8 left-8 w-16 h-16 border-l-4 border-t-4 border-primary/60"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          />
          <motion.div
            className="absolute top-8 right-8 w-16 h-16 border-r-4 border-t-4 border-primary/60"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          />
          <motion.div
            className="absolute bottom-8 left-8 w-16 h-16 border-l-4 border-b-4 border-primary/60"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          />
          <motion.div
            className="absolute bottom-8 right-8 w-16 h-16 border-r-4 border-b-4 border-primary/60"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BroadcastTransition;
