import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Share2, RefreshCw, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { useTransition } from "@/contexts/TransitionContext";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState, useMemo } from "react";

import HeroSection from "@/components/journey/HeroSection";
import PersonaSection from "@/components/journey/PersonaSection";
import StoryTimeline from "@/components/journey/StoryTimeline";
import TechEvolution from "@/components/journey/TechEvolution";
import SkillRadar from "@/components/journey/SkillRadar";
import Achievements from "@/components/journey/Achievements";
import CareerProjection from "@/components/journey/CareerProjection";
import LoadingState from "@/components/journey/LoadingState";
import ErrorState from "@/components/journey/ErrorState";
import RepoModal from "@/components/journey/RepoModal";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useJourney } from "@/hooks/useJourney";

export type { JourneyData } from "@/types/journey";

const JourneyPage = () => {
  const { username } = useParams<{ username: string }>();
  const { navigateWithTransition, triggerTransition } = useTransition();
  const { theme, setTheme } = useTheme();
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const hasTriggeredTransition = useRef(false);

  const { data: journey, isLoading, error, isRefetching, refetch, regenerate } = useJourney(username);

  // Check if regenerate is allowed (72 hours must have passed)
  const canRegenerate = useMemo(() => {
    if (!journey?.last_generated_at) return true; // New user, can regenerate
    const hoursUntilRegenerate = journey.hours_until_regenerate;
    return hoursUntilRegenerate === null || hoursUntilRegenerate <= 0;
  }, [journey]);

  // Handle regenerate (forces new AI generation)
  const handleRegenerate = () => {
    if (!canRegenerate) {
      const hoursLeft = journey?.hours_until_regenerate;
      if (hoursLeft) {
        toast.error(`You can regenerate your code persona after ${Math.ceil(hoursLeft)} more hour${hoursLeft >= 1 ? 's' : ''}.`);
      }
      return;
    }
    regenerate();
    toast.info("Regenerating journey... This may take a moment.");
  };

  // Get tooltip message for regenerate button
  const getRegenerateTooltip = () => {
    // If we're showing cached AI data, explain that here
    if (journey?.cached) {
      const hoursLeft = journey.hours_until_regenerate;
      if (hoursLeft != null && hoursLeft > 0) {
        return `This profile is currently served from cached analysis. Regeneration will be available in approximately ${Math.ceil(
          hoursLeft
        )} hour${hoursLeft > 1 ? "s" : ""}.`;
      }
      return "This profile is currently served from cached analysis. You can regenerate your code persona now.";
    }

    if (canRegenerate) {
      return "Regenerate your code persona (forces new AI generation)";
    }

    const hoursLeft = journey?.hours_until_regenerate;
    if (hoursLeft) {
      return `You can regenerate your code persona after ${hoursLeft} more hour${
        hoursLeft > 1 ? "s" : ""
      }. If you think your GitHub was updated, please wait.`;
    }

    return "You can regenerate your code persona after 72 hours. If you think your GitHub was updated, please wait.";
  };

  // Trigger reverse transition when data loads
  useEffect(() => {
    if (!isLoading && journey && !hasTriggeredTransition.current) {
      hasTriggeredTransition.current = true;
      // Small delay to ensure smooth transition
      setTimeout(() => {
        triggerTransition("out", 600);
      }, 100);
    }
  }, [isLoading, journey, triggerTransition]);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        // Cancelling the native share sheet rejects with AbortError — not a real failure.
        await navigator.share({
          title: `${username}'s Code Persona`,
          url,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      } else {
        toast.error("Sharing isn't supported in this browser.");
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        toast.error("Couldn't share this link.");
      }
    }
  };

  if (isLoading) return <LoadingState username={username || ""} />;
  if (error) return <ErrorState error={error} onRetry={() => refetch()} />;
  if (!journey) return <ErrorState error={new Error("No data found")} onRetry={() => refetch()} />;

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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRegenerate}
                disabled={isRefetching || !canRegenerate}
                aria-label="Regenerate code persona"
                className={cn(
                  "text-muted-foreground hover:text-foreground h-9 w-9 rounded-lg",
                  !canRegenerate && "opacity-50 cursor-not-allowed"
                )}
              >
                <RefreshCw className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <p className="text-sm">{getRegenerateTooltip()}</p>
            </TooltipContent>
          </Tooltip>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            className="text-muted-foreground hover:text-foreground h-9 w-9 rounded-lg"
            title="Share Profile"
            aria-label="Share Profile"
          >
            <Share2 className="w-4 h-4" />
          </Button>
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
        <AnimatePresence mode="wait">
          <motion.div
            key={username}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <HeroSection journey={journey} />
            {journey.ai_persona && <PersonaSection persona={journey.ai_persona} />}
            {journey.ai_story?.phases && journey.ai_story.phases.length > 0 && (
              <StoryTimeline story={journey.ai_story} onRepoClick={setSelectedRepo} />
            )}
            {journey.ai_tech_evolution?.phases && journey.ai_tech_evolution.phases.length > 0 && (
              <TechEvolution evolution={journey.ai_tech_evolution} />
            )}
            {journey.ai_skills?.skills && journey.ai_skills.skills.length > 0 && (
              <SkillRadar skills={journey.ai_skills} />
            )}
            {journey.ai_achievements?.badges && journey.ai_achievements.badges.length > 0 && (
              <Achievements achievements={journey.ai_achievements} />
            )}
            {journey.ai_career_projection && (
              <CareerProjection projection={journey.ai_career_projection} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <RepoModal
        isOpen={!!selectedRepo}
        onClose={() => setSelectedRepo(null)}
        repoName={selectedRepo || ""}
        username={username || ""}
      />
    </div>
  );
};

export default JourneyPage;

