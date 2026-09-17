import { Code2 } from "lucide-react";
import { languageBreakdown, languageOverlap, sliceColor, type LanguageSlice } from "@/lib/languageFingerprint";
import type { JourneyData } from "@/types/journey";

const SIZE = 160;
const RADIUS = 60;
const STROKE = 20;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function LanguageDonut({ name, slices }: { name: string; slices: LanguageSlice[] }) {
  if (!slices.length) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div
          className="rounded-full border border-border flex items-center justify-center text-xs text-muted-foreground"
          style={{ width: SIZE, height: SIZE }}
        >
          No data
        </div>
        <p className="font-display text-lg font-semibold text-foreground">{name}</p>
      </div>
    );
  }

  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90">
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="hsl(var(--muted))" strokeWidth={STROKE} />
        {slices.map((slice, index) => {
          const dash = (slice.pct / 100) * CIRCUMFERENCE;
          const circle = (
            <circle
              key={slice.language}
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={sliceColor(index)}
              strokeWidth={STROKE}
              strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += dash;
          return circle;
        })}
      </svg>
      <p className="font-display text-lg font-semibold text-foreground">{name}</p>
      <div className="flex flex-col gap-1.5 w-full max-w-[180px]">
        {slices.map((slice, index) => (
          <div key={slice.language} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: sliceColor(index) }} />
              {slice.language}
            </span>
            <span className="font-medium text-foreground tabular-nums">{slice.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface CompareLanguagesProps {
  nameA: string;
  nameB: string;
  journeyA: JourneyData;
  journeyB: JourneyData;
}

const CompareLanguages = ({ nameA, nameB, journeyA, journeyB }: CompareLanguagesProps) => {
  const slicesA = languageBreakdown(journeyA);
  const slicesB = languageBreakdown(journeyB);
  const { shared, overlapPct } = languageOverlap(journeyA, journeyB);

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Code2 className="w-6 h-6 text-primary" />
          </div>
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">Language Fingerprint</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          {shared.length > 0
            ? `${overlapPct}% language overlap: both write ${shared.slice(0, 3).join(", ")}`
            : "No shared languages between these two profiles"}
        </p>
      </div>

      <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-12 place-items-center">
        <LanguageDonut name={nameA} slices={slicesA} />
        <LanguageDonut name={nameB} slices={slicesB} />
      </div>
    </section>
  );
};

export default CompareLanguages;
