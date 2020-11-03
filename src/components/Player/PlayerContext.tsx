import React from "react";
import { IPlayerContext } from "./types";

const PlayerContext = React.createContext<IPlayerContext>({} as any);

export default PlayerContext;
