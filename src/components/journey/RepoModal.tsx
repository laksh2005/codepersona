import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { X, GitBranch, Loader2, TrendingUp, Zap, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface RepoModalProps {
  isOpen: boolean;
  onClose: () => void;
  repoName: string;
  username: string;
}

interface RepoAnalysis {
  ai_summary: string;
  maturity_score: number;
  complexity_score: number;
  improvement_suggestions: string[];
}

const RepoModal = ({ isOpen, onClose, repoName, username }: RepoModalProps) => {
  const { data: analysis, isLoading, error } = useQuery({
    queryKey: ["repo-analysis", username, repoName],
    queryFn: async (): Promise<RepoAnalysis> => {
      const { data, error } = await supabase.functions.invoke("analyze-repo", {
        body: { username, repoName },
      });

      if (error) throw error;
      return data;
    },
    enabled: isOpen && !!repoName,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-primary";
    if (score >= 40) return "text-accent";
    return "text-muted-foreground";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl z-50"
          >
            <div className="card-cinematic max-h-[80vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 sticky top-0 bg-card pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <GitBranch className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-foreground">
                      {repoName}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      AI-Powered Analysis
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Content */}
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                  <p className="text-muted-foreground">Analyzing repository...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-destructive mb-4">Failed to analyze repository</p>
                  <p className="text-sm text-muted-foreground">
                    {(error as Error).message}
                  </p>
                </div>
              ) : analysis ? (
                <div className="space-y-6">
                  {/* Summary */}
                  <div>
                    <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-accent" />
                      Project Summary
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {analysis.ai_summary}
                    </p>
                  </div>

                  {/* Scores */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-muted/50 border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">Maturity</span>
                      </div>
                      <div className="flex items-end gap-2">
                        <span className={`text-3xl font-display font-bold ${getScoreColor(analysis.maturity_score)}`}>
                          {analysis.maturity_score}
                        </span>
                        <span className="text-muted-foreground text-sm mb-1">/100</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-background mt-2">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                          style={{ width: `${analysis.maturity_score}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-muted/50 border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-accent" />
                        <span className="text-sm text-muted-foreground">Complexity</span>
                      </div>
                      <div className="flex items-end gap-2">
                        <span className={`text-3xl font-display font-bold ${getScoreColor(analysis.complexity_score)}`}>
                          {analysis.complexity_score}
                        </span>
                        <span className="text-muted-foreground text-sm mb-1">/100</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-background mt-2">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-accent to-secondary transition-all duration-500"
                          style={{ width: `${analysis.complexity_score}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Improvement suggestions */}
                  {analysis.improvement_suggestions && analysis.improvement_suggestions.length > 0 && (
                    <div>
                      <h3 className="font-display font-semibold text-foreground mb-3">
                        Improvement Suggestions
                      </h3>
                      <ul className="space-y-2">
                        {analysis.improvement_suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-3 text-sm">
                            <span className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 text-xs font-bold text-secondary mt-0.5">
                              {index + 1}
                            </span>
                            <span className="text-muted-foreground">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RepoModal;
