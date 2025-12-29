import { motion } from "framer-motion";
import { MapPin, Building2, Link as LinkIcon, Calendar, Download, Star, GitFork, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { JourneyData } from "@/pages/JourneyPage";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface HeroSectionProps {
  journey: JourneyData;
}

const HeroSection = ({ journey }: HeroSectionProps) => {
  const { github_data } = journey;
  const { user, repos, languages, contributions } = github_data;

  const joinDate = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const handleSavePDF = () => {
    window.open(`/${journey.github_username}/print`, "_blank");
  };

  const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
  const currentYear = new Date().getFullYear();
  const reposThisYear = repos.filter((r) => new Date(r.created_at).getFullYear() === currentYear).length;
  const reposLastYear = repos.filter((r) => new Date(r.created_at).getFullYear() === currentYear - 1).length;
  const activeYears = contributions.years.length || 1;
  const avgReposPerYear = (repos.length / activeYears).toFixed(1);
  const mostActiveYearEntry = [...contributions.years].sort((a, b) => b.contributions - a.contributions)[0];
  const mostActiveYear = mostActiveYearEntry?.year ?? currentYear;

  const languageData = Object.entries(languages)
    .map(([name, bytes]) => ({ name, value: bytes }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

  return (
    <section className="container mx-auto px-4 py-12 md:py-20">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative flex-shrink-0"
        >
          <div className="relative w-28 h-28 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-primary/20 shadow-soft">
            <img
              src={user.avatar_url}
              alt={user.name || journey.github_username}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 text-center lg:text-left"
        >
          <h1 className="font-display text-2xl sm:text-3xl md:text-5xl font-semibold text-foreground mb-2">
            {user.name || journey.github_username}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-4">@{journey.github_username}</p>

          {user.bio && <p className="text-muted-foreground mb-6 max-w-xl text-sm md:text-base">{user.bio}</p>}

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground mb-6">
            {user.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                <span>{user.location}</span>
              </div>
            )}
            {user.company && (
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3 h-3 md:w-4 md:h-4 text-primary" />
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
                <LinkIcon className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                <span>Website</span>
              </a>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3 md:w-4 md:h-4 text-primary" />
              <span>Active since {joinDate}</span>
            </div>
          </div>

          <Button variant="outline" size="sm" className="gap-2" onClick={handleSavePDF}>
            <Download className="w-4 h-4" />
            Save as PDF
          </Button>
        </motion.div>

        {/* <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full lg:w-[340px] bg-card/50 backdrop-blur-sm border rounded-2xl p-5 shadow-sm"
        >
          <h3 className="font-semibold mb-4 text-xs tracking-wider text-muted-foreground uppercase">At a Glance</h3>

          <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
            <div className="bg-background/60 p-3 rounded-xl border">
              <div className="text-[11px] text-muted-foreground mb-1">Total Stars</div>
              <div className="text-lg font-bold flex items-center gap-1.5">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                {totalStars}
              </div>
            </div>
            <div className="bg-background/60 p-3 rounded-xl border">
              <div className="text-[11px] text-muted-foreground mb-1">Repos {currentYear}</div>
              <div className="text-lg font-bold flex items-center gap-1.5">
                <GitFork className="w-4 h-4 text-primary" />
                {reposThisYear}
              </div>
            </div>
            <div className="bg-background/60 p-3 rounded-xl border">
              <div className="text-[11px] text-muted-foreground mb-1">Repos {currentYear - 1}</div>
              <div className="text-lg font-bold flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-500" />
                {reposLastYear}
              </div>
            </div>
            <div className="bg-background/60 p-3 rounded-xl border">
              <div className="text-[11px] text-muted-foreground mb-1">Most Active Year</div>
              <div className="text-lg font-bold">{mostActiveYear}</div>
              <div className="text-[11px] text-muted-foreground mt-1">{avgReposPerYear} repos/year</div>
            </div>
          </div>

          <div className="h-36 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={languageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={32}
                  outerRadius={54}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {languageData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: 8,
                  }}
                  itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[11px] font-medium text-muted-foreground">Languages</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {languageData.slice(0, 4).map((lang, index) => (
              <div key={lang.name} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                {lang.name}
              </div>
            ))}
          </div>
        </motion.div> */}
      </div>
    </section>
  );
};

export default HeroSection;
