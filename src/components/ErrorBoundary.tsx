import React from 'react';
import { Button } from '@/components/ui/button';

interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="text-center space-y-4 max-w-md">
            <div className="text-5xl font-accent text-primary">✦</div>
            <h2 className="font-heading text-2xl font-bold">Something went wrong</h2>
            <p className="text-muted-foreground text-sm font-mono bg-muted px-3 py-2 rounded-lg">
              {this.state.error?.message ?? 'An unexpected error occurred.'}
            </p>
            <Button onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}>
              Reload Page
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
