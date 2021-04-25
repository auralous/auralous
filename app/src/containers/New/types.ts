import { ParamListBase } from "@react-navigation/routers";

export interface RootStackParamListNew extends ParamListBase {
  "new/final": {
    selectedTracks: string[];
    modeTitle: string;
  };
}
