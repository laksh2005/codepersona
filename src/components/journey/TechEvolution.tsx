import { motion } from "framer-motion";
import { Layers, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TechEvolutionProps {
  evolution?: {
    phases?: Array<{
      period: string;
      focus: string;
      technologies: string[];
      reasoning: string;
    }>;
  } | null;
  className?: string;
  compact?: boolean;
}

const TechEvolution = ({ evolution, className, compact = false }: TechEvolutionProps) => {
  const phases = evolution?.phases ?? [];

  if (!phases.length) {
    return null;
  }

  const techColors: Record<string, string> = {
    JavaScript: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    TypeScript: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    Python: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    React: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    Node: "bg-lime-500/10 text-lime-600 dark:text-lime-400 border-lime-500/20",
    Go: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    Rust: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    Java: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    "C++": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    Ruby: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  };

  const getTechColor = (tech: string) => {
    const match = Object.keys(techColors).find((key) =>
      tech.toLowerCase().includes(key.toLowerCase())
    );
    return match ? techColors[match] : "bg-muted text-muted-foreground border-border";
  };

  if (compact) {
    const latestPhase = phases[phases.length - 1];

    if (!latestPhase) {
      return null;
    }
    return (
      <section className={cn("h-full flex flex-col", className)}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Layers className="w-4 h-4 text-primary" />
          </div>
          <h2 className="font-display text-lg font-semibold text-foreground">
            Current Stack
          </h2>
        </div>

        <div className="flex-1">
          <div className="mb-3">
             <div className="text-xs font-medium text-muted-foreground mb-1">{latestPhase.period}</div>
             <div className="font-semibold text-foreground line-clamp-1">{latestPhase.focus}</div>
          </div>
          <div className="flex flex-wrap gap-1.5 content-start">
            {latestPhase.technologies.slice(0, 8).map((tech) => (
              <span
                key={tech}
                className={`px-2 py-0.5 rounded text-[10px] font-medium border ${getTechColor(tech)}`}
              >
                {tech}
              </span>
            ))}
            {latestPhase.technologies.length > 8 && (
              <span className="px-2 py-0.5 rounded text-[10px] font-medium border bg-muted text-muted-foreground">
                +{latestPhase.technologies.length - 8}
              </span>
            )}
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
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Layers className="w-6 h-6 text-primary" />
          </div>
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
          Technical Expertise
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Evolution of your technology stack and specializations
        </p>
      </motion.div>

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {phases.map((phase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Connector arrow (except last) */}
              {index < phases.length - 1 && index % 3 !== 2 && (
                <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="w-6 h-6 text-muted-foreground/40" />
                </div>
              )}

              <div className="card-cinematic h-full shadow-soft">
                {/* Period */}
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground mb-4">
                  {phase.period}
                </div>

                {/* Focus */}
                <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                  {phase.focus}
                </h3>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {phase.technologies.map((tech) => (
                    <span
                      key={tech}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium border ${getTechColor(tech)}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Reasoning */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {phase.reasoning}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechEvolution;