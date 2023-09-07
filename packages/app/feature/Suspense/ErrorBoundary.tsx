import { Component, ErrorInfo, ReactNode } from 'react';
import { Text } from 'react-native';
import analytics from '@react-native-firebase/analytics';
interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    analytics().logEvent('error', { error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return <Text>Sorry.. there was an error</Text>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
