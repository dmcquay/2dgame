export interface PlayerState {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  velocity: number;
  headingDegrees: number;
  acceleratingForward: boolean;
  acceleratingBackward: boolean;
  turningLeft: boolean;
  turningRight: boolean;
}

export interface PlayerMap {
  [key: string]: PlayerState;
}

export interface GameState {
  players: PlayerMap;
}
