export interface PlayerState {
  name: string;
  color: string;
  x: number;
  y: number;
}

export interface GameState {
  players: PlayerState[];
}
