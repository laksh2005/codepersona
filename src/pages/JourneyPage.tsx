import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Share2, RefreshCw, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { useTransition } from "@/contexts/TransitionContext";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

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
import { useState, useMemo } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export interface JourneyData {
  github_username: string;
  github_data: {
    user: {
      name: string;
      bio: string;
      avatar_url: string;
      followers: number;
      following: number;
      public_repos: number;
      created_at: string;
      location: string;
      company: string;
      blog: string;
    };
    repos: Array<{
      name: string;
      description: string;
      language: string;
      stargazers_count: number;
      forks_count: number;
      created_at: string;
      updated_at: string;
      topics: string[];
      size: number;
    }>;
    languages: Record<string, number>;
    contributions: {
      total: number;
      years: Array<{ year: number; contributions: number }>;
    };
  };
  ai_persona: {
    title: string;
    insights: string[];
    codingStyle: string;
  };
  ai_story: {
    phases: Array<{
      title: string;
      period: string;
      description: string;
      keyRepos: string[];
      significance: string;
    }>;
  };
  ai_tech_evolution: {
    phases: Array<{
      period: string;
      focus: string;
      technologies: string[];
      reasoning: string;
    }>;
  };
  ai_skills: {
    skills: Array<{
      name: string;
      score: number;
      reasoning: string;
    }>;
  };
  ai_achievements: {
    badges: Array<{
      name: string;
      icon: string;
      description: string;
      reasoning: string;
      rarity: "common" | "rare" | "legendary";
    }>;
  };
  ai_career_projection: {
    futureSkills: string[];
    roleAlignment: string;
    learningPath: string[];
    prediction: string;
  };
  cached?: boolean;
  rateLimited?: boolean;
  last_generated_at?: string;
  hours_until_regenerate?: number | null;
  message?: string;
}

const JourneyPage = () => {
  const { username } = useParams<{ username: string }>();
  const { navigateWithTransition, triggerTransition } = useTransition();
  const { theme, setTheme } = useTheme();
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [forceRegenerate, setForceRegenerate] = useState(false);
  const hasTriggeredTransition = useRef(false);

  const { data: journey, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["journey", username, forceRegenerate],
    queryFn: async (): Promise<JourneyData> => {
      const { data, error } = await supabase.functions.invoke("github-journey", {
        body: { username, forceRegenerate: forceRegenerate || undefined },
      });

      if (error) throw error;
      if (data?.error) {
        const customError = new Error(data.error);
        (customError as any).errorType = data.errorType;
        if (data.errorType === "RATE_LIMITED") {
          toast.error(data.error || "Rate limited: Please wait 72 hours before regenerating.");
        }
        throw customError;
      }
      // Reset forceRegenerate after successful fetch
      if (forceRegenerate) {
        setForceRegenerate(false);
      }
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry if user not found
      if (error?.errorType === "USER_NOT_FOUND") return false;
      return failureCount < 1;
    },
  });

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
        toast.error(`You can regenerate your code persona after ${hoursLeft} more hour${hoursLeft > 1 ? 's' : ''}.`);
      }
      return;
    }
    setForceRegenerate(true);
    refetch();
    toast.info("Regenerating journey... This may take a moment.");
  };

  // Get tooltip message for regenerate button
  const getRegenerateTooltip = () => {
    if (canRegenerate) {
      return "Regenerate your code persona (forces new AI generation)";
    }
    const hoursLeft = journey?.hours_until_regenerate;
    if (hoursLeft) {
      return `You can regenerate your code persona after ${hoursLeft} more hour${hoursLeft > 1 ? 's' : ''}. If you think your GitHub was updated, please wait.`;
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
    if (navigator.share) {
      await navigator.share({
        title: `${username}'s Code Persona`,
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  if (isLoading) return <LoadingState username={username || ""} />;
  if (error) return <ErrorState error={error as Error} onRetry={() => refetch()} />;
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
          >
            <Share2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-muted-foreground hover:text-foreground h-9 w-9 rounded-lg"
            title="Toggle Theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-0 transition-all dark:scale-100" />
            <Moon className="absolute h-4 w-4 rotate-0 scale-100 transition-all dark:scale-0" />
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
            <PersonaSection persona={journey.ai_persona} />
            <StoryTimeline story={journey.ai_story} onRepoClick={setSelectedRepo} />
            <TechEvolution evolution={journey.ai_tech_evolution} />
            <SkillRadar skills={journey.ai_skills} />
            <Achievements achievements={journey.ai_achievements} />
            <CareerProjection projection={journey.ai_career_projection} />
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

