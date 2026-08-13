import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface SkillRadarProps {
  skills: {
    skills: Array<{
      name: string;
      score: number;
      reasoning: string;
    }>;
  };
  className?: string;
  compact?: boolean;
}

const SkillRadar = ({ skills, className, compact = false }: SkillRadarProps) => {
  const skillList = skills?.skills || [];
  
  const radarData = useMemo(() => {
    if (!skillList.length) return [];

    const count = skillList.length;
    const centerX = compact ? 100 : 140;
    const centerY = compact ? 100 : 140;
    const maxRadius = compact ? 70 : 100;

    return skillList.map((skill, index) => {
      const angle = (index * 2 * Math.PI) / count - Math.PI / 2;
      const radius = (skill.score / 100) * maxRadius;
      
      return {
        ...skill,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        labelX: centerX + Math.cos(angle) * (maxRadius + (compact ? 15 : 25)),
        labelY: centerY + Math.sin(angle) * (maxRadius + (compact ? 15 : 25)),
      };
    });
  }, [skillList, compact]);

  const polygonPoints = radarData.map((d) => `${d.x},${d.y}`).join(" ");

  if (!skillList.length) {
    return null;
  }

  if (compact) {
     return (
      <section className={cn("h-full flex flex-col", className)}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Brain className="w-4 h-4 text-accent" />
          </div>
          <h2 className="font-display text-lg font-semibold text-foreground">
            Skills
          </h2>
        </div>
        
        <div className="flex-1 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
            {[0.25, 0.5, 0.75, 1].map((scale) => (
              <div
                key={scale}
                className="absolute rounded-full border border-border"
                style={{ width: `${scale * 140}px`, height: `${scale * 140}px` }}
              />
            ))}
          </div>

          <svg width="200" height="200" className="relative z-10 overflow-visible">
            <motion.polygon
              points={polygonPoints}
              fill="hsl(var(--primary) / 0.15)"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
            />
            {radarData.map((point, index) => (
              <text
                key={index}
                x={point.labelX}
                y={point.labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="hsl(var(--foreground))"
                fontSize="10"
                fontWeight="500"
                className="select-none"
              >
                {point.name}
              </text>
            ))}
          </svg>
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
            <Brain className="w-6 h-6 text-accent" />
          </div>
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
          Core Competencies
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Skills and capabilities demonstrated through your work
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 overflow-visible gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative flex justify-center overflow-visible"
          >
            <div className="radar-bg w-[280px] h-[280px] rounded-full absolute" />
            <svg width="280" height="280" className="relative z-10 overflow-visible">
              {[0.25, 0.5, 0.75, 1].map((scale) => (
                <circle
                  key={scale}
                  cx="140"
                  cy="140"
                  r={100 * scale}
                  fill="none"
                  stroke="hsl(var(--border))"
                  strokeWidth="1"
                  opacity={0.5}
                />
              ))}

              {radarData.map((_, index) => {
                const angle = (index * 2 * Math.PI) / radarData.length - Math.PI / 2;
                const endX = 140 + Math.cos(angle) * 100;
                const endY = 140 + Math.sin(angle) * 100;
                return (
                  <line
                    key={index}
                    x1="140"
                    y1="140"
                    x2={endX}
                    y2={endY}
                    stroke="hsl(var(--border))"
                    strokeWidth="1"
                    opacity={0.3}
                  />
                );
              })}

              <motion.polygon
                points={polygonPoints}
                fill="hsl(var(--primary) / 0.15)"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />

              {radarData.map((point, index) => (
                <motion.circle
                  key={index}
                  cx={point.x}
                  cy={point.y}
                  r="5"
                  fill="hsl(var(--primary))"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                />
              ))}

              {radarData.map((point, index) => (
                <text
                  key={index}
                  x={point.labelX}
                  y={point.labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="hsl(var(--foreground))"
                  fontSize="10"
                  fontFamily="Inter, system-ui"
                  fontWeight="500"
                >
                  {point.name}
                </text>
              ))}
            </svg>
          </motion.div>

          {/* Skill explanations */}
          <div className="space-y-4">
            {skillList.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors shadow-soft"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-display font-semibold text-foreground">
                    {skill.name}
                  </h4>
                  <span className="text-sm font-bold text-primary">
                    {skill.score}/100
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted mb-3">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${Math.max(0, Math.min(100, skill.score ?? 0))}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">{skill.reasoning}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillRadar;