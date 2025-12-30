import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface TransitionContextType {
  isTransitioning: boolean;
  transitionDirection: "in" | "out";
  navigateWithTransition: (to: string, direction?: "in" | "out") => void;
  navigateWithoutTransition: (to: string) => void;
  triggerTransition: (direction: "in" | "out", duration?: number) => Promise<void>;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export const useTransition = () => {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error("useTransition must be used within a TransitionProvider");
  }
  return context;
};

interface TransitionProviderProps {
  children: ReactNode;
}

export const TransitionProvider = ({ children }: TransitionProviderProps) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<"in" | "out">("in");
  const navigate = useNavigate();

  const navigateWithTransition = useCallback((to: string, direction: "in" | "out" = "in") => {
    setTransitionDirection(direction);
    setIsTransitioning(true);
    
    // Wait for transition animation to cover screen, then navigate
    setTimeout(() => {
      navigate(to);
      // Keep transition visible briefly after navigation
      setTimeout(() => {
        setIsTransitioning(false);
      }, 600);
    }, 500);
  }, [navigate]);

  const navigateWithoutTransition = useCallback((to: string) => {
    navigate(to);
  }, [navigate]);

  const triggerTransition = useCallback(async (direction: "in" | "out", duration: number = 800) => {
    setTransitionDirection(direction);
    setIsTransitioning(true);
    
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setIsTransitioning(false);
        resolve();
      }, duration);
    });
  }, []);

  return (
    <TransitionContext.Provider value={{ 
      isTransitioning, 
      transitionDirection,
      navigateWithTransition,
      navigateWithoutTransition,
      triggerTransition 
    }}>
      {children}
    </TransitionContext.Provider>
  );
};
