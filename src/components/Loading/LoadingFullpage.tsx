import Portal from "@reach/portal";
import { SvgLogo } from "assets/svg";
import { Box } from "components/View";

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
      <Box
        backgroundColor="background"
        justifyContent="center"
        alignItems="center"
        style={{ zIndex: 50, position: "fixed" }}
        top={0}
        left={0}
        fullWidth
        fullHeight
      >
        <SvgLogo className="animate-pulse fill-current w-48 h-48" />
      </Box>
    </Portal>
  );
};

export default LoadingFullpage;
