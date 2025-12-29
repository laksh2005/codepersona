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
import { useState } from "react";

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
}

const JourneyPage = () => {
  const { username } = useParams<{ username: string }>();
  const { navigateWithTransition } = useTransition();
  const { theme, setTheme } = useTheme();
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);

  const { data: journey, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["journey", username],
    queryFn: async (): Promise<JourneyData> => {
      const { data, error } = await supabase.functions.invoke("github-journey", {
        body: { username },
      });

      if (error) throw error;
      if (data?.error) {
        const customError = new Error(data.error);
        (customError as any).errorType = data.errorType;
        throw customError;
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

      {/* Floating Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-6 right-6 z-50"
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="text-muted-foreground hover:text-foreground h-9 w-9 rounded-lg"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`} />
          </Button>
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

