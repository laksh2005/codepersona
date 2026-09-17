import { useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Moon, Sun, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useTransition } from "@/contexts/TransitionContext";
import { useJourney } from "@/hooks/useJourney";
import LoadingState from "@/components/journey/LoadingState";
import ErrorState from "@/components/journey/ErrorState";
import CompareHero from "@/components/compare/CompareHero";
import CompareStickyBar from "@/components/compare/CompareStickyBar";
import CompareRadar from "@/components/compare/CompareRadar";
import CompareTechStack from "@/components/compare/CompareTechStack";
import CompareTopRepo from "@/components/compare/CompareTopRepo";
import CompareLanguages from "@/components/compare/CompareLanguages";
import CompareArchetypes from "@/components/compare/CompareArchetypes";
import CompatibilityGauge, { compatibilityVerdict } from "@/components/compare/CompatibilityGauge";
import { canonicalComparePath } from "@/lib/compareUrl";
import { categorizeSkills, topCategory } from "@/lib/skillTaxonomy";
import { diffTechStacks } from "@/lib/techStackDiff";
import { buildVerdict } from "@/lib/compareVerdict";
import { getTopRepo } from "@/lib/topRepo";
import { computeCompatibility } from "@/lib/compatibilityScore";

const ComparePage = () => {
  const { userA, userB } = useParams<{ userA: string; userB: string }>();
  const { navigateWithTransition } = useTransition();
  const { theme, setTheme } = useTheme();

  const canonicalPath = userA && userB ? canonicalComparePath(userA, userB) : null;
  const currentPath = userA && userB ? `/compare/${userA}/${userB}` : null;
  const isCanonical = canonicalPath !== null && currentPath === canonicalPath;

  // Only fetch once the URL is already canonical — otherwise a visit to a
  // wrong-case or wrong-order URL would fire a real (rate-limited, AI-backed)
  // generation for that exact casing before the redirect below even runs.
  const journeyA = useJourney(isCanonical ? userA : undefined);
  const journeyB = useJourney(isCanonical ? userB : undefined);

  // Bogus usernames, identical usernames, or a non-canonical URL (wrong case
  // or wrong order) all redirect to the one canonical path — see
  // src/lib/compareUrl.ts for why this matters for caching.
  if (!canonicalPath) {
    return <Navigate to="/" replace />;
  }
  if (!isCanonical) {
    return <Navigate to={canonicalPath} replace />;
  }

  if (journeyA.isLoading || journeyB.isLoading) {
    return <LoadingState username={`@${userA} vs @${userB}`} raw />;
  }

  if (journeyA.error) {
    return <ErrorState error={journeyA.error} onRetry={() => journeyA.refetch()} />;
  }
  if (journeyB.error) {
    return <ErrorState error={journeyB.error} onRetry={() => journeyB.refetch()} />;
  }
  if (!journeyA.data || !journeyB.data) {
    return <ErrorState error={new Error("No data found")} onRetry={() => { journeyA.refetch(); journeyB.refetch(); }} />;
  }

  const dataA = journeyA.data;
  const dataB = journeyB.data;

  const skillsA = dataA.ai_skills?.skills ?? [];
  const skillsB = dataB.ai_skills?.skills ?? [];
  const scoresA = categorizeSkills(skillsA);
  const scoresB = categorizeSkills(skillsB);
  const techDiff = diffTechStacks(dataA, dataB);
  const topCategoryA = topCategory(skillsA);
  const topCategoryB = topCategory(skillsB);
  const verdict = buildVerdict({ journeyA: dataA, journeyB: dataB, topA: topCategoryA, topB: topCategoryB });
  const compatibility = computeCompatibility(scoresA, scoresB);
  const topRepoA = getTopRepo(dataA);
  const topRepoB = getTopRepo(dataB);

  // GitHub allows trailing whitespace in a display name, which reads oddly
  // once it hits a possessive ("...'s top repo").
  const nameA = dataA.github_data.user.name?.trim() || dataA.github_username;
  const nameB = dataB.github_data.user.name?.trim() || dataB.github_username;

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      <div className="fixed inset-0 bg-radial-fade pointer-events-none" />

      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-6 z-50 mx-auto left-0 right-0 w-fit"
      >
        <div className="bg-background/80 backdrop-blur-md border rounded-xl shadow-lg p-2 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateWithTransition("/")}
            className="text-muted-foreground hover:text-foreground h-9 w-9 rounded-lg"
            title="Back to Home"
            aria-label="Back to Home"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="w-px h-6 bg-border my-auto" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-muted-foreground hover:text-foreground h-9 w-9 rounded-lg"
            title="Toggle Theme"
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </div>
      </motion.nav>

      <main className="relative z-10 pt-20">
        <CompareHero
          journeyA={dataA}
          journeyB={dataB}
          verdict={verdict}
          topCategoryA={topCategoryA}
          topCategoryB={topCategoryB}
        />
        <CompareStickyBar journeyA={dataA} journeyB={dataB} />

        <CompareLanguages nameA={nameA} nameB={nameB} journeyA={dataA} journeyB={dataB} />

        <CompareArchetypes nameA={nameA} nameB={nameB} journeyA={dataA} journeyB={dataB} />

        <CompareTopRepo
          nameA={nameA}
          nameB={nameB}
          usernameA={dataA.github_username}
          usernameB={dataB.github_username}
          repoA={topRepoA}
          repoB={topRepoB}
        />

        <CompareTechStack nameA={nameA} nameB={nameB} diff={techDiff} />

        <section className="container mx-auto px-4 py-16">
          <div className="max-w-xl mx-auto">
            <CompareRadar nameA={nameA} nameB={nameB} scoresA={scoresA} scoresB={scoresB} />
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 pb-32">
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Compatibility Score
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              How closely {nameA} and {nameB}'s skill profiles align
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <CompatibilityGauge score={compatibility} />
            <p className="text-foreground font-medium max-w-sm text-center">
              {compatibilityVerdict(compatibility)}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ComparePage;
