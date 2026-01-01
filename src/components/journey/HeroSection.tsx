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
  const raf = useRef<number | null>(null);

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
   Hero Section
======================= */
interface HeroSectionProps {
  journey: JourneyData;
}

const HeroSection = ({ journey }: HeroSectionProps) => {
  const { github_data } = journey;
  const { user, repos } = github_data;

  const joinDate = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const projectsCount = useCountUp(repos.length, 1600);
  const followersCount = useCountUp(user.followers, 1800);

  const handleSavePDF = () => {
    window.open(`/${journey.github_username}/print`, "_blank");
  };

  return (
    <section className="container mx-auto max-w-6xl px-6 pt-20 pb-14">
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12">

        {/* LEFT: Avatar + Identity */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row items-center lg:items-start gap-6 flex-1"
        >
          {/* Avatar */}
          <div className="shrink-0">
            <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full overflow-hidden border border-primary/30">
              <img
                src={user.avatar_url}
                alt={user.name || journey.github_username}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Text */}
          <div className="text-center lg:text-left">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold mb-1">
              {user.name || journey.github_username}
            </h1>

            <p className="text-muted-foreground mb-3">
              @{journey.github_username}
            </p>

            {user.bio && (
              <p className="max-w-xl text-muted-foreground text-sm md:text-base mb-4">
                {user.bio}
              </p>
            )}

            <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 text-xs sm:text-sm text-muted-foreground mb-5">
              {user.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary" />
                  {user.location}
                </span>
              )}

              {user.company && (
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-primary" />
                  {user.company}
                </span>
              )}

          

              {user.blog && (
                <a
                  href={
                    user.blog.startsWith("http")
                      ? user.blog
                      : `https://${user.blog}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-primary transition"
                >
                  <LinkIcon className="w-4 h-4 text-primary" />
                  Website
                </a>
              )}

              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-primary" />
                Active since {joinDate}
              </span>
            </div>

            <Button variant="outline" size="sm" onClick={handleSavePDF}>
              <Download className="w-4 h-4 mr-2" />
              Save as PDF
            </Button>
          </div>
        </motion.div>

        {/* RIGHT: Stats (anchored, not floating) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="w-full lg:w-auto flex justify-center"
        >
          <div className="flex items-center gap-10 rounded-2xl bg-card/70 border border-border px-8 py-5 shadow-md">
            <div className="flex flex-col items-center">
              <span className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                Projects
              </span>
              <span className="text-3xl font-semibold text-primary tabular-nums">
                {projectsCount}
              </span>
            </div>

            <div className="h-10 w-px bg-border/60" />

            <div className="flex flex-col items-center">
              <span className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                Followers
              </span>
              <span className="text-3xl font-semibold text-primary tabular-nums">
                {followersCount}
              </span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;
