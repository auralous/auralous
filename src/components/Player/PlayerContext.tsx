import React from "react";
import { IPlayerContext } from "./types";

const PlayerContext = React.createContext<IPlayerContext>({} as IPlayerContext);

export default PlayerContext;
