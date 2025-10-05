import { Component, ReactNode, Suspense } from 'react';

interface SuspenseErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
  onReset?: () => void;
}

interface SuspenseErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  retryCount: number;
}

/**
 * Error boundary specifically for Suspense/lazy loading failures
 * Handles chunk loading errors with retry logic
 */
class SuspenseErrorBoundaryClass extends Component<
  SuspenseErrorBoundaryProps,
  SuspenseErrorBoundaryState
> {
  constructor(props: SuspenseErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<SuspenseErrorBoundaryState> {
    // Check if it's a chunk loading error
    const isChunkError =
      error.message.includes('Loading chunk') ||
      error.message.includes('Failed to fetch') ||
      error.name === 'ChunkLoadError';

    if (isChunkError) {
      return { hasError: true, error };
    }

    // Re-throw if it's not a chunk error
    throw error;
  }

  componentDidCatch(error: Error) {
    console.error('SuspenseErrorBoundary caught chunk loading error:', error);

    // Auto-retry once with exponential backoff
    if (this.state.retryCount < 1) {
      const delay = Math.pow(2, this.state.retryCount) * 1000; // 1s, 2s, 4s...
      setTimeout(() => {
        this.setState(prev => ({
          hasError: false,
          error: undefined,
          retryCount: prev.retryCount + 1,
        }));
      }, delay);
    }
  }

  handleManualRetry = () => {
    this.setState({
      hasError: false,
      error: undefined,
      retryCount: 0,
    });
    this.props.onReset?.();
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.errorFallback) {
        return this.props.errorFallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center border-2 border-red-100">
            <div className="w-16 h-16 mx-auto mb-4 text-red-500">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to Load Component</h2>

            <p className="text-gray-600 mb-6">
              This component couldn't be loaded. This might be due to a network issue or a caching
              problem.
            </p>

            {this.state.retryCount > 0 && (
              <p className="text-sm text-gray-500 mb-4">
                Retry attempt {this.state.retryCount}/1 in progress...
              </p>
            )}

            <div className="space-y-3">
              <button
                onClick={this.handleManualRetry}
                className="w-full px-4 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium"
              >
                Try Again
              </button>

              <button
                onClick={this.handleReload}
                className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Reload Page
              </button>
            </div>

            <p className="mt-4 text-xs text-gray-400">
              If this persists, try clearing your browser cache
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Combines Suspense and Error Boundary for lazy-loaded components
 */
export function SuspenseErrorBoundary({
  children,
  fallback,
  errorFallback,
  onReset,
}: SuspenseErrorBoundaryProps) {
  return (
    <SuspenseErrorBoundaryClass errorFallback={errorFallback} onReset={onReset}>
      <Suspense
        fallback={
          fallback || (
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-600 font-medium">Loading...</p>
              </div>
            </div>
          )
        }
      >
        {children}
      </Suspense>
    </SuspenseErrorBoundaryClass>
  );
}
