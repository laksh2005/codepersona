import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ArrowRight, Sparkles, Moon, Sun, Globe, Linkedin, Mail, Swords, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import TetrisBackground from "@/components/ConstellationBackground";
import { useTransition } from "@/contexts/TransitionContext";
import LoadingState from "@/components/journey/LoadingState";
import { canonicalComparePath } from "@/lib/compareUrl";

const XIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const Index = () => {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<"single" | "compare">("single");
  const [username, setUsername] = useState("");
  const [compareUserA, setCompareUserA] = useState("");
  const [compareUserB, setCompareUserB] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingPage, setShowLoadingPage] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState("");
  const [loadingRaw, setLoadingRaw] = useState(false);
  const [keystrokeCount, setKeystrokeCount] = useState(0);
  const { navigateWithTransition, navigateWithoutTransition, triggerTransition } = useTransition();
  const { theme, setTheme } = useTheme();

  // A report page's "Compare with someone?" nudge links here as /?vs=<username>,
  // which drops straight into compare mode with the first slot already filled.
  useEffect(() => {
    const vs = searchParams.get("vs");
    if (vs) {
      setCompareUserA(vs);
      setMode("compare");
    }
  }, [searchParams]);

  const goToPath = async (path: string, label: string, raw = false) => {
    setIsLoading(true);
    setLoadingLabel(label);
    setLoadingRaw(raw);
    try {
      await triggerTransition("in", 1000);
      setShowLoadingPage(true);
      await triggerTransition("out", 1000);
      navigateWithoutTransition(path);
    } finally {
      // Component unmounts on successful navigation anyway; this only matters
      // if the user lands back on this page (e.g. browser back) mid-flight.
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;
    await goToPath(`/${encodeURIComponent(trimmed)}`, trimmed);
  };

  const handleCompareSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const path = canonicalComparePath(compareUserA, compareUserB);
    if (!path) {
      toast.error("Enter two different valid GitHub usernames to compare.");
      return;
    }
    await goToPath(path, `@${compareUserA.trim()} vs @${compareUserB.trim()}`, true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setKeystrokeCount((prev) => prev + 1);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showLoadingPage ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoadingState username={loadingLabel} raw={loadingRaw} />
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-background relative overflow-hidden"
          >
            <TetrisBackground keystrokeCount={keystrokeCount} />

      <div className="relative z-10 container mx-auto px-4 py-12 min-h-screen flex flex-col">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-transparent flex items-center justify-center overflow-hidden">
               <img src="/blackbg.png" alt="Logo" className="w-12 h-12 object-contain" />
            </div>
            <span className="font-display text-2xl font-semibold text-foreground">Code Persona</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-muted-foreground hover:text-foreground"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </motion.header>

        <main className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl md:text-6xl font-semibold mb-6 leading-tight text-foreground">
              Your code tells a story
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Your commits, choices, and projects already say <span className="text-primary">a lot</span>. <br /> <span className="text-primary">Code Persona</span> brings that story into focus.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-flex items-center gap-1 p-1 mb-6 rounded-full bg-white/10 dark:bg-white/5 border border-white/10"
          >
            <button
              type="button"
              onClick={() => setMode("single")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                mode === "single" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <UserRound className="w-3.5 h-3.5" />
              Generate
            </button>
            <button
              type="button"
              onClick={() => setMode("compare")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                mode === "compare" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              Compare
            </button>
          </motion.div>

          {mode === "single" ? (
            <motion.form
              key="single-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              onSubmit={handleSubmit}
              className="w-full max-w-lg mb-4"
            >
              <div className="backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-2xl p-2 flex gap-2 shadow-2xl shadow-primary/10">
                <div className="flex-1 relative">
                  <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter GitHub username"
                    aria-label="GitHub username"
                    name="github-username"
                    autoComplete="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    value={username}
                    onChange={handleInputChange}
                    className="pl-12 h-14 bg-white/20 dark:bg-white/5 backdrop-blur-sm border-0 text-lg rounded-xl placeholder:text-muted-foreground/70 focus-visible:ring-1 focus-visible:ring-primary/50"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={!username.trim() || isLoading}
                  aria-label="Generate code persona"
                  className="h-14 w-14 rounded-xl font-sans font-semibold bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all duration-300"
                >
                  {isLoading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <ArrowRight className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </motion.form>
          ) : (
            <motion.form
              key="compare-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              onSubmit={handleCompareSubmit}
              className="w-full max-w-lg mb-4"
            >
              <div className="backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-2xl p-2 flex flex-col gap-2 shadow-2xl shadow-primary/10">
                <div className="relative">
                  <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="First GitHub username"
                    aria-label="First GitHub username"
                    name="compare-username-a"
                    autoComplete="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    value={compareUserA}
                    onChange={(e) => setCompareUserA(e.target.value)}
                    className="pl-12 h-14 bg-white/20 dark:bg-white/5 backdrop-blur-sm border-0 text-lg rounded-xl placeholder:text-muted-foreground/70 focus-visible:ring-1 focus-visible:ring-primary/50"
                  />
                </div>
                <div className="relative">
                  <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Second GitHub username"
                    aria-label="Second GitHub username"
                    name="compare-username-b"
                    autoComplete="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    value={compareUserB}
                    onChange={(e) => setCompareUserB(e.target.value)}
                    className="pl-12 h-14 bg-white/20 dark:bg-white/5 backdrop-blur-sm border-0 text-lg rounded-xl placeholder:text-muted-foreground/70 focus-visible:ring-1 focus-visible:ring-primary/50"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={!compareUserA.trim() || !compareUserB.trim() || isLoading}
                  aria-label="Compare code personas"
                  className="h-12 w-full rounded-xl font-sans font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
                >
                  {isLoading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <>
                      Compare
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </motion.form>
          )}

          {isLoading && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-primary font-medium mb-4"
            >
              {mode === "single" ? "Generating your code persona..." : "Generating both code personas..."}
            </motion.p>
          )}

          {mode === "single" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-muted-foreground text-sm text-center mb-4"
            >
              try{" "}
              <button
                type="button"
                onClick={() => setUsername("laksh2005")}
                className="font-bold text-primary hover:underline"
              >
                @laksh2005
              </button>
            </motion.p>
          )}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-muted-foreground text-sm text-center"
          >
            get yours at <span className="font-bold text-primary">codepersona.app/your-github-username</span>
          </motion.p>
        </main>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center py-8 border-t border-border/30"
        >
          <p className="font-display text-lg text-muted-foreground mb-3">
            made by Laksh Nijhawan
          </p>
          <a
            href="https://laksh1.me"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary font-medium text-sm hover:bg-primary/20 hover:border-primary/50 transition-all"
          >
            <Globe className="w-4 h-4" />
            laksh1.me
          </a>
          <div className="flex items-center justify-center gap-4">
            <a
              href="mailto:lakshnijhawan.work@gmail.com"
              aria-label="Email Laksh Nijhawan"
              className="w-9 h-9 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/laksh-nijhawan-576888280/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Laksh Nijhawan on LinkedIn"
              className="w-9 h-9 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://github.com/laksh2005"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Laksh Nijhawan on GitHub"
              className="w-9 h-9 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://x.com/laksh_2705"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Laksh Nijhawan on X"
              className="w-9 h-9 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
            >
              <XIcon className="w-4 h-4" />
            </a>
          </div>
        </motion.footer>
      </div>
    </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Index;
