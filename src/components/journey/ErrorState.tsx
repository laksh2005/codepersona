import { motion } from "framer-motion";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { AppError } from "@/lib/edgeFunction";

interface ErrorStateProps {
  error: Error | AppError;
  onRetry: () => void;
}

const COPY: Record<string, { title: string; hint: string; showRetry: boolean }> = {
  USER_NOT_FOUND: {
    title: "User not found",
    hint: "There's no public GitHub profile with that username. Double-check the spelling and try again.",
    showRetry: false,
  },
  INVALID_USERNAME: {
    title: "That doesn't look like a GitHub username",
    hint: "GitHub usernames only contain letters, numbers, and single hyphens.",
    showRetry: false,
  },
  RATE_LIMITED: {
    title: "Hold on a moment",
    hint: "This persona was generated recently. You can regenerate it again in a bit — the exact wait time is shown next to the regenerate button.",
    showRetry: false,
  },
};

const ErrorState = ({ error, onRetry }: ErrorStateProps) => {
  const navigate = useNavigate();
  const errorType = (error as AppError)?.errorType;
  const copy = errorType ? COPY[errorType] : undefined;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute inset-0 bg-radial-fade" />

      <div className="relative z-10 text-center px-4 max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="mb-8 inline-block"
        >
          <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-destructive" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="font-display text-2xl font-bold text-foreground mb-4">
            {copy?.title || "Something went wrong"}
          </h1>
          <p className="text-muted-foreground mb-2">
            {error.message || "We couldn't generate the journey for this user."}
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            {copy?.hint || "The user might not exist, or there might be a temporary issue with the service."}
          </p>

          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="border-border hover:bg-muted"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
            {(copy?.showRetry ?? true) && (
              <Button
                onClick={onRetry}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ErrorState;
