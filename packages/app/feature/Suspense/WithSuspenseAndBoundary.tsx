import { ReactNode, Suspense, memo } from 'react';
import ErrorBoundary from './ErrorBoundary';

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};
const WithSuspenseAndBoundary = memo<Props>((props) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={props.fallback}>{props.children}</Suspense>
    </ErrorBoundary>
  );
});

export default WithSuspenseAndBoundary;
