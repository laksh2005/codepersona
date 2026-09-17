import { motion } from "framer-motion";
import type { JourneyData } from "@/types/journey";
import type { SkillCategory } from "@/lib/skillTaxonomy";

interface CompareHeroProps {
  journeyA: JourneyData;
  journeyB: JourneyData;
  verdict: string;
  topCategoryA: { category: SkillCategory; score: number } | null;
  topCategoryB: { category: SkillCategory; score: number } | null;
}

function ProfileHeader({ journey, align }: { journey: JourneyData; align: "left" | "right" }) {
  const { user } = journey.github_data;
  const displayName = user.name?.trim() || journey.github_username;
  return (
    <a
      href={`https://github.com/${journey.github_username}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex flex-col items-center gap-3 group ${align === "right" ? "md:items-end" : "md:items-start"}`}
    >
      <img
        src={user.avatar_url}
        alt={displayName}
        className="w-24 h-24 rounded-full border border-primary/30 object-cover group-hover:border-primary/60 transition-colors"
      />
      <div className={`text-center ${align === "right" ? "md:text-right" : "md:text-left"}`}>
        <h2 className="font-display text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
          {displayName}
        </h2>
        <p className="text-muted-foreground text-sm">@{journey.github_username}</p>
      </div>
    </a>
  );
}

function TopCategoryCard({ top, align }: { top: { category: SkillCategory; score: number } | null; align: "left" | "right" }) {
  return (
    <div className={`flex flex-col ${align === "right" ? "items-end text-right" : "items-start text-left"}`}>
      <span className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Strongest in</span>
      {top ? (
        <>
          <span className="font-display text-lg font-semibold text-foreground">{top.category}</span>
          <span className="text-primary font-semibold tabular-nums text-sm">{top.score}/100</span>
        </>
      ) : (
        <span className="text-muted-foreground text-sm italic">Not enough data</span>
      )}
    </div>
  );
}

const CompareHero = ({ journeyA, journeyB, verdict, topCategoryA, topCategoryB }: CompareHeroProps) => {
  return (
    <section className="container mx-auto max-w-4xl px-6 pt-20 pb-4">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-8 mb-10">
        <ProfileHeader journey={journeyA} align="left" />
        <div className="font-display text-3xl italic text-muted-foreground/60 text-center">vs</div>
        <ProfileHeader journey={journeyB} align="right" />
      </div>

      {/* A real head-to-head number instead of raw repo/follower counts —
          each person's single strongest skill category, from the same data
          the radar chart plots. */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 gap-8 max-w-md mx-auto mb-10 pb-8 border-b border-border/60"
      >
        <TopCategoryCard top={topCategoryA} align="left" />
        <TopCategoryCard top={topCategoryB} align="right" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="flex flex-col items-center text-center"
      >
        <p className="font-display text-lg md:text-xl italic text-muted-foreground max-w-xl leading-snug">
          <span className="text-primary/70 text-3xl md:text-4xl align-[-0.15em] mr-0.5">&ldquo;</span>
          {verdict}
          <span className="text-primary/70 text-3xl md:text-4xl align-[-0.35em] ml-0.5">&rdquo;</span>
        </p>
      </motion.div>
    </section>
  );
};

export default CompareHero;
