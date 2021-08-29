declare module "*.svg" {
  import type { SvgProps } from "react-native-svg";
  const ReactComponent: React.FunctionComponent<SvgProps>;
  export default ReactComponent;
}
