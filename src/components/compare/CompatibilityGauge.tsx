import { motion } from "framer-motion";

interface CompatibilityGaugeProps {
  score: number;
  size?: number;
}

export function compatibilityVerdict(score: number): string {
  if (score >= 85) return "Remarkably aligned developer profiles.";
  if (score >= 65) return "Strong overlap in how they build.";
  if (score >= 40) return "Some shared ground, different strengths.";
  return "Very different builders with complementary skillsets.";
}

const STROKE = 14;

const CompatibilityGauge = ({ score, size = 220 }: CompatibilityGaugeProps) => {
  const radius = size / 2 - STROKE;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth={STROKE} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - dash }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-semibold text-primary tabular-nums" style={{ fontSize: size * 0.22 }}>
          {score}%
        </span>
      </div>
    </div>
  );
};

export default CompatibilityGauge;
