export interface PlayerState {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  moving: {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
  };
}

interface PlayerMap {
  [key: string]: PlayerState;
}

export interface GameState {
  players: PlayerMap;
}
