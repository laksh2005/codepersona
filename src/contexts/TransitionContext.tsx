import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface TransitionContextType {
  isTransitioning: boolean;
  navigateWithTransition: (to: string) => void;
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
  const navigate = useNavigate();

  const navigateWithTransition = useCallback((to: string) => {
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

  return (
    <TransitionContext.Provider value={{ isTransitioning, navigateWithTransition }}>
      {children}
    </TransitionContext.Provider>
  );
};
