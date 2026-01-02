import { motion } from "framer-motion";
import { History, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StoryTimelineProps {
  story: {
    phases: Array<{
      title: string;
      period: string;
      description: string;
      keyRepos: string[];
      significance: string;
    }>;
  };
  onRepoClick: (repoName: string) => void;
  className?: string;
  compact?: boolean;
}

const StoryTimeline = ({
  story,
  onRepoClick,
  className,
  compact = false,
}: StoryTimelineProps) => {
  // Reverse phases to show most recent first
  const reversedPhases = [...story.phases].reverse();

  if (compact) {
    return (
      <section className={cn("h-full flex flex-col", className)}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
            <History className="w-4 h-4 text-secondary" />
          </div>
          <h2 className="font-display text-lg font-semibold text-foreground">
            Timeline
          </h2>
        </div>

        <div className="flex-1 relative pl-4">
          <div className="absolute left-[5px] top-2 bottom-2 w-0.5 bg-border" />

          <div className="space-y-4">
            {reversedPhases.slice(0, 3).map((phase, index) => (
              <div key={index} className="relative pl-4">
                <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-background border-2 border-primary" />
                <div>
                  <span className="text-xs font-medium text-primary block mb-0.5">
                    {phase.period}
                  </span>
                  <h4 className="font-medium text-foreground text-sm line-clamp-1">
                    {phase.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {phase.significance}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn("container mx-auto px-4 py-16", className)}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
            <History className="w-6 h-6 text-secondary" />
          </div>
        </div>

        <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
          Career Timeline
        </h2>

        <p className="text-muted-foreground max-w-xl mx-auto">
          Key milestones and observable phases from your activity
        </p>
      </motion.div>

      <div className="relative max-w-3xl mx-auto">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 timeline-line hidden md:block" />

        {reversedPhases.map((phase, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="relative pl-0 md:pl-20 mb-12 last:mb-0"
          >
            <div className="hidden md:flex absolute left-5 top-2 w-6 h-6 rounded-full bg-card border-2 border-primary items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-primary" />
            </div>

            <div className="card-cinematic group hover:border-primary/50 transition-all duration-300 shadow-soft">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-4">
                {phase.period}
              </div>

              <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-3">
                {phase.title}
              </h3>

              <p className="text-muted-foreground mb-4 leading-relaxed">
                {phase.description}
              </p>

              <div className="p-3 rounded-lg bg-muted/50 border border-border mb-4">
                <p className="text-sm text-foreground">
                  <span className="font-medium text-primary">
                    Observed Impact:{" "}
                  </span>
                  {phase.significance}
                </p>
              </div>

              {phase.keyRepos.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                    Notable Projects
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {phase.keyRepos.map((repo) => (
                      <button
                        key={repo}
                        onClick={() => onRepoClick(repo)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted/50 hover:bg-muted text-sm text-foreground hover:text-primary transition-colors group"
                      >
                        {repo}
                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default StoryTimeline;
