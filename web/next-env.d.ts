/// <reference types="next" />
/// <reference types="next/types/global" />

declare module "*.svg" {
  const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  export default ReactComponent;
}

interface Window {
  resetUrqlClient: () => void;
}
