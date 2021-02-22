import Portal from "@reach/portal";
import { SvgLogo } from "assets/svg";

interface LoadingFullpageProps {
  error?: Error | null | undefined;
  isLoading?: boolean | undefined;
  pastDelay?: boolean | undefined;
  retry?: (() => void) | undefined;
  timedOut?: boolean | undefined;
}

const LoadingFullpage: React.FC<LoadingFullpageProps> = ({ isLoading }) => {
  if (!isLoading) return null;
  return (
    <Portal>
      <div className="flex justify-center items-center bg-background text-foreground w-full h-full fixed top-0 left-0 z-50">
        <SvgLogo className="animate-pulse fill-current w-48 h-48" />
      </div>
    </Portal>
  );
};

export default LoadingFullpage;
