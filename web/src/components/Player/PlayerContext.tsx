import { createContext } from "react";
import { IPlayerContext } from "./types";

const PlayerContext = createContext<IPlayerContext>({} as IPlayerContext);

export default PlayerContext;
