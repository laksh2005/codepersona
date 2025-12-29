import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import JourneyPage from "./pages/JourneyPage";
import JourneyPrintPage from "./pages/JourneyPrintPage";
import NotFound from "./pages/NotFound";
import BroadcastTransition from "./components/BroadcastTransition";
import { TransitionProvider, useTransition } from "./contexts/TransitionContext";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isTransitioning } = useTransition();
  
  return (
    <>
      <BroadcastTransition isActive={isTransitioning} />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/:username" element={<JourneyPage />} />
        <Route path="/:username/print" element={<JourneyPrintPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <TransitionProvider>
            <AppContent />
          </TransitionProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
