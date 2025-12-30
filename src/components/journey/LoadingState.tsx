import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface LoadingStateProps {
  username: string;
}

const LoadingState = ({ username }: LoadingStateProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Simple background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />

      <div className="relative z-10 text-center px-4">
        {/* Simple logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="mb-8 inline-block"
        >
          <div className="w-20 h-20 rounded-full bg-card border border-primary/30 flex items-center justify-center">
            <img src="/blackbg.png" alt="Logo" className="w-12 h-12" />
          </div>
        </motion.div>

        {/* Username */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <p className="text-sm text-muted-foreground mb-2">Creating the code persona for</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              @{username}
            </span>
          </h1>
        </motion.div>

        {/* Simple loading */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          {/* Simple spinner */}
          <div className="flex items-center justify-center mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-6 h-6 text-primary" />
            </motion.div>
          </div>

          {/* Simple message */}
          <p className="text-muted-foreground">Just a few seconds...</p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingState;
