import { motion } from "framer-motion";
import { Github, Sparkles } from "lucide-react";

interface LoadingStateProps {
  username: string;
}

const loadingMessages = [
  "Analyzing your interests...",
  "Crafting your code persona...",
  "Seeing how what your journey like...",
];

const LoadingState = ({ username }: LoadingStateProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute inset-0 bg-radial-fade" />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-1/3 left-1/3 w-64 h-64 rounded-full bg-primary/10 blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full bg-secondary/10 blur-3xl"
        animate={{
          x: [0, -25, 0],
          y: [0, 25, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 text-center px-4">
        {/* Animated logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="mb-8 inline-block"
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/30 blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className="relative w-24 h-24 rounded-full bg-card border border-primary/30 flex items-center justify-center glow-cyan">
              <Github className="w-12 h-12 text-primary" />
            </div>
          </div>
        </motion.div>

        {/* Username */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-lg text-muted-foreground mb-2">Creating the code persona for</p>
          <h1 className="font-display text-3xl font-bold text-gradient mb-8">
            @{username}
          </h1>
        </motion.div>

        {/* Loading animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          {/* Spinner */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-6 h-6 text-primary" />
            </motion.div>
          </div>

          {/* Cycling messages */}
          <div className="h-6 overflow-hidden">
            {loadingMessages.map((message, index) => (
              <motion.p
                key={message}
                initial={{ y: 24, opacity: 0 }}
                animate={{
                  y: [24, 0, 0, -24],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 3,
                  delay: index * 3,
                  repeat: Infinity,
                  repeatDelay: (loadingMessages.length - 1) * 3,
                  times: [0, 0.1, 0.9, 1],
                }}
                className="text-muted-foreground"
              >
                {message}
              </motion.p>
            ))}
          </div>

          {/* Progress bar */}
          <div className="w-64 h-1 rounded-full bg-muted mx-auto overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-secondary to-primary"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ width: "50%" }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingState;
