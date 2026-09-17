import { useMemo } from "react";
import { motion } from "framer-motion";
import { SKILL_CATEGORIES } from "@/lib/skillTaxonomy";

interface CompareRadarProps {
  nameA: string;
  nameB: string;
  scoresA: Record<string, number>;
  scoresB: Record<string, number>;
}

const COLOR_A = "hsl(var(--primary))"; // gold, matches the rest of the app
const COLOR_B = "hsl(199 89% 62%)"; // sky blue — high contrast against gold on dark backgrounds

const SIZE = 320;
const CENTER = SIZE / 2;
const MAX_RADIUS = 110;
const LABEL_OFFSET = 34;

function buildPolygon(scores: Record<string, number>) {
  const count = SKILL_CATEGORIES.length;
  return SKILL_CATEGORIES.map((category, index) => {
    const angle = (index * 2 * Math.PI) / count - Math.PI / 2;
    const radius = (Math.max(0, Math.min(100, scores[category] ?? 0)) / 100) * MAX_RADIUS;
    return {
      x: CENTER + Math.cos(angle) * radius,
      y: CENTER + Math.sin(angle) * radius,
      labelX: CENTER + Math.cos(angle) * (MAX_RADIUS + LABEL_OFFSET),
      labelY: CENTER + Math.sin(angle) * (MAX_RADIUS + LABEL_OFFSET),
      category,
    };
  });
}

const CompareRadar = ({ nameA, nameB, scoresA, scoresB }: CompareRadarProps) => {
  const pointsA = useMemo(() => buildPolygon(scoresA), [scoresA]);
  const pointsB = useMemo(() => buildPolygon(scoresB), [scoresB]);

  const polygonA = pointsA.map((p) => `${p.x},${p.y}`).join(" ");
  const polygonB = pointsB.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label={`Skill comparison radar between ${nameA} and ${nameB}`}
        className="w-full max-w-[380px] h-auto overflow-visible"
      >
        <title>{`${nameA} vs ${nameB}: skill category comparison`}</title>

        {[0.25, 0.5, 0.75, 1].map((scale) => (
          <circle
            key={scale}
            cx={CENTER}
            cy={CENTER}
            r={MAX_RADIUS * scale}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth={1}
            opacity={0.4}
          />
        ))}

        {pointsA.map((point, index) => {
          const angle = (index * 2 * Math.PI) / SKILL_CATEGORIES.length - Math.PI / 2;
          return (
            <line
              key={point.category}
              x1={CENTER}
              y1={CENTER}
              x2={CENTER + Math.cos(angle) * MAX_RADIUS}
              y2={CENTER + Math.sin(angle) * MAX_RADIUS}
              stroke="hsl(var(--border))"
              strokeWidth={1}
              opacity={0.3}
            />
          );
        })}

        <motion.polygon
          points={polygonB}
          fill={COLOR_B}
          fillOpacity={0.12}
          stroke={COLOR_B}
          strokeWidth={2}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
        <motion.polygon
          points={polygonA}
          fill={COLOR_A}
          fillOpacity={0.15}
          stroke={COLOR_A}
          strokeWidth={2}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />

        {pointsA.map((point) => (
          <text
            key={point.category}
            x={point.labelX}
            y={point.labelY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="hsl(var(--foreground))"
            fontSize={11}
            fontWeight={500}
          >
            {point.category}
          </text>
        ))}
      </svg>

      <div className="flex items-center gap-6 mt-4 text-sm">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ background: COLOR_A }} />
          <span className="text-muted-foreground">{nameA}</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ background: COLOR_B }} />
          <span className="text-muted-foreground">{nameB}</span>
        </span>
      </div>
    </div>
  );
};

export default CompareRadar;
