import { useState } from "react";
import { Swords, Github, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTransition } from "@/contexts/TransitionContext";
import { canonicalComparePath } from "@/lib/compareUrl";

interface CompareCTAProps {
  username: string;
}

/**
 * An inline section (not a floating popup) suggesting the compare feature —
 * placed at the natural end of the report, in the normal scroll flow, so
 * anyone who reads to the bottom sees it. A corner toast is easy to miss or
 * dismiss without registering; a page section isn't.
 */
const CompareCTA = ({ username }: CompareCTAProps) => {
  const [target, setTarget] = useState("");
  const { navigateWithTransition } = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const path = canonicalComparePath(username, target);
    if (!path) {
      toast.error("Enter a different, valid GitHub username to compare.");
      return;
    }
    navigateWithTransition(path);
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-10 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Swords className="w-6 h-6 text-primary" />
          </div>
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
          Compare Your Journey
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          See how @{username}'s story, skills, and tech stack stack up against someone else's
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        onSubmit={handleSubmit}
        className="max-w-md mx-auto"
      >
        <div className="card-cinematic shadow-soft flex gap-2 p-2">
          <div className="flex-1 relative">
            <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Their GitHub username"
              aria-label="GitHub username to compare with"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="pl-9 h-11 border-0 bg-muted/50"
            />
          </div>
          <Button type="submit" disabled={!target.trim()} className="h-11 px-5">
            Compare
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.form>
    </section>
  );
};

export default CompareCTA;
