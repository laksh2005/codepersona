import { motion } from "framer-motion";
import { TrendingUp, Target, BookOpen, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

interface CareerProjectionProps {
  projection?: {
    futureSkills?: string[];
    roleAlignment?: string;
    learningPath?: string[];
    prediction?: string;
  } | null;
  className?: string;
  compact?: boolean;
}

const CareerProjection = ({ projection, className, compact = false }: CareerProjectionProps) => {
  if (!projection) {
    return null;
  }

  const futureSkills = projection.futureSkills ?? [];
  const learningPath = projection.learningPath ?? [];

  if (!projection.prediction && !projection.roleAlignment && !futureSkills.length && !learningPath.length) {
    return null;
  }

  if (compact) {
    return (
      <section className={cn("h-full flex flex-col", className)}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-secondary" />
          </div>
          <h2 className="font-display text-lg font-semibold text-foreground">
            Projection
          </h2>
        </div>

        <div className="flex-1 flex flex-col gap-3">
          <div className="p-3 rounded-xl bg-card border border-border/50">
             <div className="flex items-center gap-2 mb-1">
               <Target className="w-4 h-4 text-accent" />
               <span className="text-xs font-medium text-muted-foreground">Ideal Role</span>
             </div>
             {projection.roleAlignment && (
               <p className="font-semibold text-foreground">{projection.roleAlignment}</p>
             )}
          </div>
          
          {projection.prediction && (
            <div className="flex-1 p-3 rounded-xl bg-muted/30 border border-border/50 flex flex-col justify-center">
               <p className="text-sm text-foreground/80 leading-snug line-clamp-3 italic">
                 "{projection.prediction}"
               </p>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className={cn("container mx-auto px-4 py-16 pb-32", className)}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-secondary" />
          </div>
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
          Growth Trajectory
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          AI-powered analysis of your career direction and potential
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        {/* Main prediction */}
        {projection.prediction && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="card-cinematic mb-8 shadow-soft"
        >
          <div className="flex items-center gap-2 mb-4">
            <Compass className="w-5 h-5 text-secondary" />
            <span className="text-sm font-medium text-secondary">Career Outlook</span>
          </div>
          <p className="text-lg text-foreground leading-relaxed">
            {projection.prediction}
          </p>
        </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Role Alignment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card-cinematic shadow-soft"
          >
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Target className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-2">
              Ideal Role
            </h3>
            {projection.roleAlignment && (
              <p className="text-lg font-medium text-primary mb-2">
                {projection.roleAlignment}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Based on your demonstrated strengths
            </p>
          </motion.div>

          {/* Future Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card-cinematic shadow-soft"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-3">
              Growth Areas
            </h3>
            {!!futureSkills.length && (
            <div className="flex flex-wrap gap-2">
              {futureSkills.map((skill, index) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  className="px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-xs font-medium text-primary"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
            )}
          </motion.div>

          {/* Learning Path */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="card-cinematic shadow-soft"
          >
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
              <BookOpen className="w-5 h-5 text-secondary" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-3">
              Recommended Path
            </h3>
            {!!learningPath.length && (
            <ol className="space-y-2">
              {learningPath.map((step, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-2 text-sm"
                >
                  <span className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-secondary">
                    {index + 1}
                  </span>
                  <span className="text-muted-foreground">{step}</span>
                </motion.li>
              ))}
            </ol>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CareerProjection;