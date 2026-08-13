import { Suspense, lazy } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import BroadcastTransition from "./components/BroadcastTransition";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { TransitionProvider, useTransition } from "./contexts/TransitionContext";
import LoadingState from "./components/journey/LoadingState";

// Lazy-loaded: JourneyPrintPage pulls in html2pdf.js (jsPDF + html2canvas, ~1MB
// raw) — keeping these off the initial bundle means visitors of "/" never pay
// for the print flow.
const JourneyPage = lazy(() => import("./pages/JourneyPage"));
const JourneyPrintPage = lazy(() => import("./pages/JourneyPrintPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Journeys are backed by an AI-generation edge function that's rate-limited
      // per-username — refetching every window focus would burn that budget for
      // no benefit, since the server already caches for 5+ minutes.
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent = () => {
  const { isTransitioning } = useTransition();

  return (
    <>
      <BroadcastTransition isActive={isTransitioning} />
      <ErrorBoundary>
        <Suspense fallback={<LoadingState username="" />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/:username" element={<JourneyPage />} />
            <Route path="/:username/print" element={<JourneyPrintPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <TransitionProvider>
            <AppContent />
          </TransitionProvider>
        </BrowserRouter>
        <Analytics />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
