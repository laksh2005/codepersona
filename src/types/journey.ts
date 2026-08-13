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
  ai_persona?: {
    title?: string;
    insights?: string[];
    codingStyle?: string;
  } | null;
  ai_story?: {
    phases?: Array<{
      title: string;
      period: string;
      description: string;
      keyRepos: string[];
      significance: string;
    }>;
  } | null;
  ai_tech_evolution?: {
    phases?: Array<{
      period: string;
      focus: string;
      technologies: string[];
      reasoning: string;
    }>;
  } | null;
  ai_skills?: {
    skills?: Array<{
      name: string;
      score: number;
      reasoning: string;
    }>;
  } | null;
  ai_achievements?: {
    badges?: Array<{
      name: string;
      icon: string;
      description: string;
      reasoning: string;
      rarity: "common" | "rare" | "legendary";
    }>;
  } | null;
  ai_career_projection?: {
    futureSkills?: string[];
    roleAlignment?: string;
    learningPath?: string[];
    prediction?: string;
  } | null;
  cached?: boolean;
  rateLimited?: boolean;
  last_generated_at?: string;
  hours_until_regenerate?: number | null;
  message?: string;
}
