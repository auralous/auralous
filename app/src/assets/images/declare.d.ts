import { ImageURISource } from "react-native";

declare module "*.jpg" {
  export default ImageURISource;
}

declare module "*.png" {
  export default ImageURISource;
}
