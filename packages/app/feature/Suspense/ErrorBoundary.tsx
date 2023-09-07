import { Component, ErrorInfo, ReactNode } from 'react';
import { Text } from 'react-native';
import analytics from '@react-native-firebase/analytics';
interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  errorText: string;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorText: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorText: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    analytics().logEvent('error_boundary_catch', { error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <>
          <Text>Sorry.. there was an error</Text>
          <Text>{this.state.errorText}</Text>
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
