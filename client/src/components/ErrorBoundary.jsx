import React from "react";
import { Link } from "react-router-dom";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-10 max-w-lg w-full text-center shadow-xl border border-red-100">
            <span className="text-6xl mb-6 block">🚨</span>
            <h1 className="text-2xl font-black text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-500 mb-8 leading-relaxed">
              We encountered an unexpected error. Don't worry, your data and progress are safe.
            </p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => window.location.reload()} 
                className="bg-[#00685f] hover:bg-[#004d46] text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider transition-all"
              >
                Reload Page
              </button>
              <Link 
                to="/dashboard"
                onClick={() => this.setState({ hasError: false })}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold uppercase tracking-wider transition-all"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
