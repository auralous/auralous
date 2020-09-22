import { useContext } from "react";
import PlayerContext from "./PlayerContext";

export default function usePlayer() {
  return useContext(PlayerContext);
}
