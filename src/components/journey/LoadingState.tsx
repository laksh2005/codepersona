import { motion } from "framer-motion";

interface LoadingStateProps {
  username: string;
}

const LoadingState = ({ username }: LoadingStateProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.06]" />
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        {/* Logo with pulse */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-10 flex justify-center"
        >
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-24 rounded-2xl bg-card flex items-center justify-center"
          >
            <img
              src="/blackbg.png"
              alt="Code Persona"
              className="w-14 h-14"
            />
          </motion.div>
        </motion.div>

        {/* Username block */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            Generating code persona
          </p>

          <h1 className="font-display text-3xl md:text-4xl font-semibold">
            <span className="bg-gradient-to-r from-primary via-yellow-400 to-primary bg-clip-text text-transparent">
              @{username}
            </span>
          </h1>
        </motion.div>

        {/* Loading indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center gap-6"
        >
          {/* Animated dots */}
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-2 h-2 rounded-full bg-primary"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Copy */}
          <p className="text-sm text-muted-foreground">
            Analyzing repositories, patterns, and signals…
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingState;
