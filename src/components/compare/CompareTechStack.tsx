import { Layers } from "lucide-react";
import type { TechStackDiff } from "@/lib/techStackDiff";

interface CompareTechStackProps {
  nameA: string;
  nameB: string;
  diff: TechStackDiff;
}

function TechChipList({ items, tone }: { items: string[]; tone: "shared" | "a" | "b" }) {
  if (!items.length) {
    return <p className="text-sm text-muted-foreground italic">None</p>;
  }

  const toneClasses =
    tone === "shared"
      ? "bg-muted text-muted-foreground border-border"
      : tone === "a"
        ? "bg-primary/10 text-primary border-primary/25"
        : "bg-[hsl(199,89%,62%)]/10 text-[hsl(199,89%,62%)] border-[hsl(199,89%,62%)]/25";

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((tech) => (
        <span key={tech} className={`px-2.5 py-1 rounded-md text-xs font-medium border ${toneClasses}`}>
          {tech}
        </span>
      ))}
    </div>
  );
}

const CompareTechStack = ({ nameA, nameB, diff }: CompareTechStackProps) => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Layers className="w-6 h-6 text-primary" />
          </div>
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">Tech Stack Overlap</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">Shared and unique technologies across both profiles</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {diff.shared.length > 0 && (
          <div className="card-cinematic shadow-soft">
            <h3 className="font-display text-lg font-semibold text-foreground mb-3">Both use</h3>
            <TechChipList items={diff.shared} tone="shared" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-cinematic shadow-soft">
            <h3 className="font-display text-lg font-semibold text-foreground mb-3">Only {nameA}</h3>
            <TechChipList items={diff.onlyA} tone="a" />
          </div>
          <div className="card-cinematic shadow-soft">
            <h3 className="font-display text-lg font-semibold text-foreground mb-3">Only {nameB}</h3>
            <TechChipList items={diff.onlyB} tone="b" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompareTechStack;
