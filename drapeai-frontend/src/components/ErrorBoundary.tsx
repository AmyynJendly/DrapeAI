import React, { ReactNode, Component, ErrorInfo } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to your error tracking service here (e.g., Sentry)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#E5DAC8] p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-[#1a1c1c] mb-2">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message || 'An unexpected error occurred. Please try refreshing the page.'}
            </p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center justify-center gap-2 bg-[#1a1c1c] text-white px-6 py-2 rounded hover:bg-gray-800 transition"
            >
              <RefreshCw className="w-4 h-4" />
              Go Back Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
