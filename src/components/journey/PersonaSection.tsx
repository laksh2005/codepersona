import { motion } from "framer-motion";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface PersonaSectionProps {
  persona: {
    title: string;
    insights: string[];
    codingStyle: string;
  };
  className?: string;
  compact?: boolean;
}

// Helper function to trim by full stops
const trimBySentence = (text: string, limit: number) => {
  if (!text) return "";
  const sentences = text.split(/(?<=[.!?])\s+/); // Splits by punctuation followed by space
  if (sentences.length <= limit) return text;
  return sentences.slice(0, limit).join(" ");
};

const PersonaSection = ({ persona, className, compact = false }: PersonaSectionProps) => {
  if (compact) {
    return (
      <section className={cn("h-full flex flex-col", className)}>
         <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <h2 className="font-display text-lg font-semibold text-foreground">
              Identity
            </h2>
         </div>
         
         <div className="flex-1 flex flex-col justify-center">
            <h3 className="font-display text-xl font-semibold text-foreground italic mb-4 text-center">
              {persona.title}
            </h3>
            
            <div className="space-y-2">
              {persona.insights.slice(0, 3).map((insight, index) => (
                <div key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                       <span className="text-[10px] font-bold text-primary">{index + 1}</span>
                    </div>
                    {/* Compact mode: Trimmed to 1 sentence */}
                    <p className="line-clamp-2 leading-tight">
                      {trimBySentence(insight, 1)}
                    </p>
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
        className="card-cinematic max-w-4xl mx-auto relative overflow-hidden shadow-soft"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold text-foreground">
                Developer Profile
              </h2>
              {/* <p className="text-sm text-muted-foreground">
                AI-analyzed professional identity
              </p> */}
            </div>
          </div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground italic">
              {persona.title}
            </h3>
          </motion.div>

          {/* Coding Style - Trimmed to 3 sentences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8 p-4 rounded-xl bg-muted/50 border border-border"
          >
            <p className="text-sm text-muted-foreground mb-1">Coding Approach</p>
            <p className="text-foreground text-sm leading-relaxed">
              {trimBySentence(persona.codingStyle, 3)}
            </p>
          </motion.div>

          {/* Insights - Trimmed to 1 sentence per point */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Key Strengths
            </p>
            {persona.insights.slice(0, 3).map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">{index + 1}</span>
                </div>
                <p className="text-foreground text-sm leading-relaxed">
                  {trimBySentence(insight, 1)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default PersonaSection;