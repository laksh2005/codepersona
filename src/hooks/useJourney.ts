import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { invokeEdgeFunction, type AppError } from "@/lib/edgeFunction";
import type { JourneyData } from "@/types/journey";

/**
 * Shared query for a username's journey report. Both the report page and the
 * print page use this so a "Save as PDF" click reads from cache instead of
 * re-invoking the (rate-limited, AI-backed) edge function a second time.
 */
export function useJourney(username: string | undefined): UseQueryResult<JourneyData, AppError> & {
  regenerate: () => void;
} {
  // Held in a ref (not state) so `handleRegenerate` can flip it and have the very
  // next `queryFn` invocation see it, without it being part of the query key —
  // putting it in the key caused the previous implementation to fire 2-3 requests
  // per regenerate click.
  const forceRegenerateRef = useRef(false);

  const query = useQuery<JourneyData, AppError>({
    queryKey: ["journey", username],
    queryFn: async (): Promise<JourneyData> => {
      const forceRegenerate = forceRegenerateRef.current;
      forceRegenerateRef.current = false;
      return invokeEdgeFunction<JourneyData>(supabase, "github-journey", {
        username,
        forceRegenerate: forceRegenerate || undefined,
      });
    },
    enabled: !!username,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error) => {
      if (error?.errorType === "USER_NOT_FOUND" || error?.errorType === "INVALID_USERNAME") return false;
      return failureCount < 1;
    },
  });

  const regenerate = () => {
    forceRegenerateRef.current = true;
    query.refetch();
  };

  return { ...query, regenerate };
}
