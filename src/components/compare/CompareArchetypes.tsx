import { Boxes } from "lucide-react";
import { motion } from "framer-motion";
import { archetypeBreakdown, type ArchetypeSlice } from "@/lib/repoArchetype";
import type { JourneyData } from "@/types/journey";

function ArchetypeList({ name, slices }: { name: string; slices: ArchetypeSlice[] }) {
  return (
    <div className="card-cinematic shadow-soft">
      <h3 className="font-display text-lg font-semibold text-foreground mb-4">{name}</h3>
      {slices.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">Not enough data to classify.</p>
      ) : (
        <div className="space-y-4">
          {slices.map((slice) => (
            <div key={slice.archetype}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-foreground">{slice.archetype}</span>
                <span className="text-muted-foreground tabular-nums">
                  {slice.count} repo{slice.count === 1 ? "" : "s"} · {slice.pct}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${slice.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface CompareArchetypesProps {
  nameA: string;
  nameB: string;
  journeyA: JourneyData;
  journeyB: JourneyData;
}

const CompareArchetypes = ({ nameA, nameB, journeyA, journeyB }: CompareArchetypesProps) => {
  const slicesA = archetypeBreakdown(journeyA);
  const slicesB = archetypeBreakdown(journeyB);

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Boxes className="w-6 h-6 text-primary" />
          </div>
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">What They Build</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">A breakdown of each person's project types</p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <ArchetypeList name={nameA} slices={slicesA} />
        <ArchetypeList name={nameB} slices={slicesB} />
      </div>
    </section>
  );
};

export default CompareArchetypes;
