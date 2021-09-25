declare module "*.svg" {
  import type { SvgProps } from "react-native-svg";
  export const ReactComponent: React.FunctionComponent<SvgProps>;
  export default ReactComponent;
}
