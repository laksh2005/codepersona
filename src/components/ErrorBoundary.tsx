import { Component, type ErrorInfo, type ReactNode } from "react";
import ErrorState from "@/components/journey/ErrorState";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Catches render-time throws — e.g. an LLM-generated field with an unexpected
 * shape (a `rarity` value outside "common"/"rare"/"legendary", a missing
 * `technologies` array) — so a bad AI response degrades to an error screen
 * instead of a blank white page.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled render error:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorState
          error={this.state.error}
          onRetry={() => {
            this.setState({ error: null });
            window.location.reload();
          }}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
