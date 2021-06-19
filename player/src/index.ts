import Player from "./Player";

export * from "./Context";
export type { Player };

// create a singleton instance of player
const player = new Player();
export default player;
