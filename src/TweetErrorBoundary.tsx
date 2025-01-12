import { Component, type ReactNode, type ErrorInfo } from 'react';

type TweetErrorProps = {
  title?: string;
  children?: ReactNode;
};

const TweetError = ({ title = 'Tweet Error', children }: TweetErrorProps) => (
  <div
    style={{
      backgroundColor: '#ffebee',
      border: '1px solid #ef5350',
      borderRadius: 16,
      padding: '16px 24px',
      color: '#c62828',
      maxWidth: 500,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }}
  >
    <h4 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600 }}>{title}</h4>
    {children && <div style={{ fontSize: 14 }}>{children}</div>}
  </div>
);

type Props = {
  children: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
};

type State = {
  error: Error | null;
};

export class TweetErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Forward the error to the parent error handler if provided
    this.props.onError?.(error, errorInfo);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Tweet Error:', error);
      console.error('Component Stack:', errorInfo.componentStack);
    }
  }

  render() {
    const { error } = this.state;
    const { children } = this.props;

    if (error) {
      return <TweetError title="Tweet Error">{error.message}</TweetError>;
    }

    return children;
  }
} 