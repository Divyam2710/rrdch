import React from 'react';
import { AlertOctagon } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service here
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{ padding: '4rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
            <AlertOctagon size={80} color="#e74c3c" style={{ margin: '0 auto 1.5rem auto' }} />
            <h1 style={{ color: '#2c3e50', fontSize: '2.5rem', marginBottom: '1rem' }}>Something went wrong.</h1>
            <p style={{ color: '#7f8c8d', fontSize: '1.2rem', marginBottom: '2rem' }}>We apologize for the inconvenience. A critical application error has occurred.</p>
            <div style={{ textAlign: 'left', background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', border: '1px solid #dee2e6' }}>
                <p style={{ fontWeight: 'bold', color: '#e74c3c', marginBottom: '0.5rem' }}>{this.state.error && this.state.error.toString()}</p>
                <details style={{ whiteSpace: 'pre-wrap', color: '#6c757d', fontSize: '0.85rem', overflowX: 'auto' }}>
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                </details>
            </div>
            <button 
                onClick={() => window.location.href = '/'} 
                style={{ marginTop: '2rem', padding: '0.75rem 2rem', background: '#2B3A31', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1.1rem', cursor: 'pointer' }}
            >
                Reload Application
            </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
