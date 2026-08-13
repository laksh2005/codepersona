import { FunctionsHttpError } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface AppError extends Error {
  errorType?: string;
  status?: number;
}

/**
 * Invokes a Supabase edge function and unwraps its error body.
 *
 * supabase-js resolves a non-2xx response as `{ data: null, error: FunctionsHttpError }`
 * — the response body (where our edge functions put `{ error, errorType }`) is NOT
 * parsed into `data`, it's only reachable via `error.context` (the raw Response).
 * This reads that body so callers can branch on `errorType` (e.g. "USER_NOT_FOUND",
 * "RATE_LIMITED") instead of seeing a generic "non-2xx status code" message.
 */
export async function invokeEdgeFunction<T>(
  supabase: SupabaseClient,
  functionName: string,
  body: Record<string, unknown>
): Promise<T> {
  const { data, error } = await supabase.functions.invoke(functionName, { body });

  if (error) {
    if (error instanceof FunctionsHttpError && error.context instanceof Response) {
      let parsedBody: { error?: string; errorType?: string } | null = null;
      try {
        parsedBody = await error.context.clone().json();
      } catch {
        // Response body wasn't JSON — fall through to the generic message below.
      }

      const appError = new Error(
        parsedBody?.error || error.message || "The request failed."
      ) as AppError;
      appError.errorType = parsedBody?.errorType;
      appError.status = error.context.status;
      throw appError;
    }

    throw error as AppError;
  }

  // Defensive: in case a function ever returns 200 with an error body.
  if (data?.error) {
    const appError = new Error(data.error) as AppError;
    appError.errorType = data.errorType;
    throw appError;
  }

  return data as T;
}
