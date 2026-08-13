import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ArrowRight, Sparkles, Moon, Sun, Globe, Linkedin, Twitter, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import TetrisBackground from "@/components/ConstellationBackground";
import { useTransition } from "@/contexts/TransitionContext";
import LoadingState from "@/components/journey/LoadingState";

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
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingPage, setShowLoadingPage] = useState(false);
  const [keystrokeCount, setKeystrokeCount] = useState(0);
  const { navigateWithTransition, navigateWithoutTransition, triggerTransition } = useTransition();
  const { theme, setTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setIsLoading(true);
      // Show transition immediately
      await triggerTransition("in", 1000);
      setShowLoadingPage(true);

      // Show loading page for 2-3 seconds
      // await new Promise(resolve => setTimeout(resolve, 2500));

      // Trigger reverse broadcast transition
      await triggerTransition("out", 1000);

      // Navigate to journey page (without transition since we already did it)
      navigateWithoutTransition(`/${username.trim()}`);
    }
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
            <LoadingState username={username.trim()} />
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
      
      {/* <div className="absolute inset-0 bg-grid-pattern opacity-50" /> */}

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

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onSubmit={handleSubmit}
            className="w-full max-w-lg mb-8"
          >
            <div className="backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-2xl p-2 flex gap-2 shadow-2xl shadow-primary/10">
              <div className="flex-1 relative">
                <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter GitHub username"
                  value={username}
                  onChange={handleInputChange}
                  className="pl-12 h-14 bg-white/20 dark:bg-white/5 backdrop-blur-sm border-0 text-lg rounded-xl placeholder:text-muted-foreground/70 focus-visible:ring-1 focus-visible:ring-primary/50"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={!username.trim() || isLoading}
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

          {isLoading && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-primary font-medium mb-4"
            >
              Generating your code persona...
            </motion.p>
          )}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-muted-foreground text-sm text-centre"
          >
            get yours at <span className="font-bold text-primary">codepersona.app/your-github-username</span>
          </motion.p>

          {/* <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-muted-foreground text-xs pt-10 text-red-300 text-centre"
          >
            services down due to very high traffic, will resume shortly, when this text disappears
          </motion.p> */}

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
              className="w-9 h-9 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/laksh-nijhawan-576888280/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://github.com/laksh2005"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://x.com/laksh_2705"
              target="_blank"
              rel="noopener noreferrer"
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
