import { motion } from "framer-motion";
import { Trophy, Zap, Star, Crown, Code2, Globe, Lightbulb, Rocket, Target, Puzzle } from "lucide-react";
import { cn } from "@/lib/utils";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AchievementsProps {
  achievements?: {
    badges?: Array<{
      name: string;
      icon: string;
      description: string;
      reasoning: string;
      rarity: "common" | "rare" | "legendary";
    }>;
  } | null;
  className?: string;
  compact?: boolean;
}

const iconMap: Record<string, typeof Trophy> = {
  trophy: Trophy,
  zap: Zap,
  star: Star,
  crown: Crown,
  code: Code2,
  globe: Globe,
  lightbulb: Lightbulb,
  rocket: Rocket,
  target: Target,
  puzzle: Puzzle,
};

const rarityStyles = {
  common: {
    bg: "bg-card",
    border: "border-green-500/30 dark:border-green-500/30",
    icon: "bg-green-500/20 dark:bg-green-500/20 text-green-600 dark:text-green-400",
    glow: "shadow-green-500/10 dark:shadow-green-500/10",
  },
  rare: {
    bg: "bg-card",
    border: "border-yellow-500/30 dark:border-yellow-500/30",
    icon: "bg-yellow-500/20 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400",
    glow: "shadow-yellow-500/10 dark:shadow-yellow-500/10",
  },
  legendary: {
    bg: "bg-card",
    border: "border-red-500/30 dark:border-red-500/30",
    icon: "bg-red-500/20 dark:bg-red-500/20 text-red-600 dark:text-red-400",
    glow: "shadow-red-500/10 dark:shadow-red-500/10",
  },
} satisfies Record<string, { bg: string; border: string; icon: string; glow: string }>;

// AI-generated `rarity` isn't schema-guaranteed — fall back to "common" styling
// rather than crashing the whole page on an unexpected value.
const DEFAULT_RARITY_STYLES = rarityStyles.common;

const Achievements = ({ achievements, className, compact = false }: AchievementsProps) => {
  const badges = achievements?.badges ?? [];

  if (!badges.length) {
    return null;
  }

  if (compact) {
     return (
      <section className={cn("h-full flex flex-col", className)}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-accent" />
          </div>
          <h2 className="font-display text-lg font-semibold text-foreground">
            Badges
          </h2>
        </div>

        <div className="flex-1 grid grid-cols-4 gap-2 content-start">
           {badges.slice(0, 8).map((badge, index) => {
              const IconComponent = iconMap[badge.icon?.toLowerCase()] || Trophy;
              const styles = rarityStyles[badge.rarity] || DEFAULT_RARITY_STYLES;

              return (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={`aspect-square rounded-xl flex items-center justify-center border cursor-help ${styles.bg} ${styles.border} ${styles.glow}`}>
                         <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${styles.icon.split(" ").filter(c => c.startsWith("bg")).join(" ")}`}>
                           <IconComponent className={`w-5 h-5 ${styles.icon.split(" ").filter(c => c.startsWith("text")).join(" ")}`} />
                         </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs">
                      <p className="font-semibold">{badge.name}</p>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
           })}
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
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-accent" />
          </div>
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">Verified Achievements</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Recognition earned through demonstrated contributions and expertise
        </p>
      </motion.div>

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {badges.map((badge, index) => {
            const IconComponent = iconMap[badge.icon?.toLowerCase()] || Trophy;
            const styles = rarityStyles[badge.rarity] || DEFAULT_RARITY_STYLES;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative overflow-hidden rounded-2xl p-6 ${styles.bg} border ${styles.border} shadow-lg ${styles.glow}`}
              >
                <div className="relative z-10">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${styles.icon}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-display text-lg font-semibold text-foreground mb-2">{badge.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{badge.description}</p>
                      <div className="p-3 rounded-lg bg-muted/30 dark:bg-muted/20 border border-border">
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">Evidence: </span>
                          {badge.reasoning}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
