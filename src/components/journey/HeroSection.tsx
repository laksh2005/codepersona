import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Building2,
  Link as LinkIcon,
  Calendar,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { JourneyData } from "@/pages/JourneyPage";

/* =======================
   Animated counter hook
======================= */
function useCountUp(to: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const raf = useRef<number>();

  useEffect(() => {
    let start: number | null = null;

    function animate(ts: number) {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(progress * to));

      if (progress < 1) {
        raf.current = requestAnimationFrame(animate);
      } else {
        setCount(to);
      }
    }

    raf.current = requestAnimationFrame(animate);
    return () => raf.current && cancelAnimationFrame(raf.current);
  }, [to, duration]);

  return count;
}

/* =======================
   Stat rail item (SAFE)
======================= */
function StatRailItem({
  label,
  value,
  duration,
}: {
  label: string;
  value: number;
  duration: number;
}) {
  const count = useCountUp(value, duration);

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <span className="text-3xl md:text-4xl font-semibold text-primary tabular-nums">
        {count}
      </span>
    </div>
  );
}

/* =======================
   Hero Section
======================= */
interface HeroSectionProps {
  journey: JourneyData;
}

const HeroSection = ({ journey }: HeroSectionProps) => {
  const { github_data } = journey;
  const { user, repos, contributions } = github_data;

  const joinDate = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  // Compute lifetime total commits safely
  const totalCommits = contributions.years && contributions.years.length > 0
    ? contributions.years.reduce((sum, year) => sum + year.contributions, 0)
    : (contributions.total ?? 0);

  // Call hooks at the top level (React rules)
  const consistencyCount = useCountUp(totalCommits, 2000);
  const projectsCount = useCountUp(repos.length, 2000);
  const communityCount = useCountUp(user.followers, 2000);

  const handleSavePDF = () => {
    window.open(`/${journey.github_username}/print`, "_blank");
  };

  return (
    <section className="relative container mx-auto px-4 py-12 md:py-20">
      <div className="flex flex-col gap-8 w-full">
        {/* Top row: Avatar on left, Stats Strip on right */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8 w-full">
          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative flex-shrink-0"
          >
            <div className="relative w-28 h-28 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-primary/20">
              <img
                src={user.avatar_url}
                alt={user.name || journey.github_username}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Horizontal stats strip - spans the rest */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 w-full"
          >
            <div className="flex flex-row items-center justify-center lg:justify-start gap-10 bg-card/80 border border-border rounded-2xl px-8 py-5 shadow-lg">
              {/* Consistency (lifetime commits) */}
              <div className="flex flex-col items-center min-w-[90px]">
                <span className="text-xs text-muted-foreground mb-1 tracking-wide uppercase font-semibold">Commits</span>
                <span className="text-3xl md:text-4xl font-bold text-primary tabular-nums">
                  {consistencyCount}
                </span>
              </div>
              {/* Projects Built (repos) */}
              <div className="flex flex-col items-center min-w-[90px]">
                <span className="text-xs text-muted-foreground mb-1 tracking-wide uppercase font-semibold">Projects Built</span>
                <span className="text-3xl md:text-4xl font-bold text-primary tabular-nums">
                  {projectsCount}
                </span>
              </div>
              {/* Community Reach (followers) */}
              <div className="flex flex-col items-center min-w-[90px]">
                <span className="text-xs text-muted-foreground mb-1 tracking-wide uppercase font-semibold">Followers</span>
                <span className="text-3xl md:text-4xl font-bold text-primary tabular-nums">
                  {communityCount}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main content - below the stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center lg:text-left"
        >
          <h1 className="font-display text-2xl sm:text-3xl md:text-5xl font-semibold mb-2">
            {user.name || journey.github_username}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-4">
            @{journey.github_username}
          </p>

          {user.bio && (
            <p className="text-muted-foreground mb-6 max-w-xl text-sm md:text-base mx-auto lg:mx-0">
              {user.bio}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground mb-6">
            {user.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{user.location}</span>
              </div>
            )}
            {user.company && (
              <div className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-primary" />
                <span>{user.company}</span>
              </div>
            )}
            {user.blog && (
              <a
                href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-primary transition-colors"
              >
                <LinkIcon className="w-4 h-4 text-primary" />
                <span>Website</span>
              </a>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" />
              <span>Active since {joinDate}</span>
            </div>
          </div>

          <Button variant="outline" size="sm" className="gap-2" onClick={handleSavePDF}>
            <Download className="w-4 h-4" />
            Save as PDF
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;