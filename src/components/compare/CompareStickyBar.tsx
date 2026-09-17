import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import type { JourneyData } from "@/types/journey";

interface CompareStickyBarProps {
  journeyA: JourneyData;
  journeyB: JourneyData;
}

// Scroll distance (px) past which the mini bar appears — roughly where the
// full-size hero above has scrolled out of view.
const SHOW_AFTER = 280;

function MiniProfile({ journey, align }: { journey: JourneyData; align: "left" | "right" }) {
  const { user } = journey.github_data;
  const displayName = user.name?.trim() || journey.github_username;
  return (
    <a
      href={`https://github.com/${journey.github_username}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-2.5 group min-w-0 ${align === "right" ? "flex-row-reverse text-right" : ""}`}
    >
      <img
        src={user.avatar_url}
        alt={displayName}
        className="w-9 h-9 rounded-full border border-primary/30 object-cover shrink-0 group-hover:border-primary/60 transition-colors"
      />
      <div className="min-w-0">
        <p className="font-display text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
          {displayName}
        </p>
        <p className="text-muted-foreground text-xs truncate">@{journey.github_username}</p>
      </div>
    </a>
  );
}

/**
 * A compact "always visible" recap of who's being compared, once the full
 * hero has scrolled out of view. Deliberately a separate element from
 * CompareHero rather than one component that morphs between both sizes —
 * that approach needs the surrounding layout to reserve exactly the right
 * amount of space for it, and any mismatch there causes page content to
 * visibly overlap the bar. A simple show/hide fade has no such failure mode.
 */
const CompareStickyBar = ({ journeyA, journeyB }: CompareStickyBarProps) => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > SHOW_AFTER);
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="fixed top-0 inset-x-0 z-40 bg-background/95 backdrop-blur-md border-b border-border shadow-md"
        >
          {/* pt-16 clears the floating nav pill (top-6, ~54px tall) instead of
              leaving the bar itself transparent up there — an opaque bar that
              starts below the nav has a gap where scrolling content peeks
              through; padding the content down while the background covers
              all the way to the top does not. */}
          <div className="max-w-4xl mx-auto px-6 pt-16 pb-3 flex items-center justify-between gap-4">
            <MiniProfile journey={journeyA} align="left" />
            <MiniProfile journey={journeyB} align="right" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CompareStickyBar;
