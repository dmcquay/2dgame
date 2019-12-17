import * as R from "ramda";

import { GameState, PlayerState } from "./types";

export const MOVE_PX_PER_INTERVAL = 5;
export const MAX_VELOCITY = 10;
export const VELOCITY_CHANGE_PER_INTERVAL = 1;
export const HEADING_CHANGE_PER_INTERVAL = 5;

export function buildInitialGameState(): GameState {
  return {
    players: {}
  };
}

function getLeastUsedCarIdx(gameState: GameState): number {
  const options = [0, 1, 2, 3, 4];
  const getCount = (idx: number) =>
    Object.values(gameState.players).filter(player => player.carIdx === idx)
      .length;
  const sortedOptions = R.sortBy(getCount, options);
  return sortedOptions[0];
}

export function buildPlayer(id: string, name: string) {
  return {
    id,
    name,
    carIdx: Math.round(Math.random() * 4),
    x: 0,
    y: 0,
    velocity: 0,
    headingDegrees: 90,
    acceleratingForward: false,
    acceleratingBackward: false,
    turningLeft: false,
    turningRight: false
  };
}

export function addPlayer(
  id: string,
  name: string,
  gameState: GameState
): GameState {
  return {
    ...gameState,
    players: {
      ...gameState.players,
      [id]: {
        ...buildPlayer(id, name),
        carIdx: getLeastUsedCarIdx(gameState)
      }
    }
  };
}

function increaseVelocityTo(maxVelocity: number, playerState: PlayerState) {
  return {
    ...playerState,
    velocity: Math.min(
      maxVelocity,
      playerState.velocity + VELOCITY_CHANGE_PER_INTERVAL
    )
  };
}

function decreaseVelocityTo(minVelocity: number, playerState: PlayerState) {
  return {
    ...playerState,
    velocity: Math.max(
      minVelocity,
      playerState.velocity - VELOCITY_CHANGE_PER_INTERVAL
    )
  };
}

export function modifyVelocity(playerState: PlayerState): PlayerState {
  if (playerState.acceleratingForward) {
    return increaseVelocityTo(MAX_VELOCITY, playerState);
  }

  if (playerState.acceleratingBackward) {
    return decreaseVelocityTo(MAX_VELOCITY * -1, playerState);
  }

  if (playerState.velocity < 0) {
    return increaseVelocityTo(0, playerState);
  }

  if (playerState.velocity > 0) {
    return decreaseVelocityTo(0, playerState);
  }

  return playerState;
}

export function modifyHeading(playerState: PlayerState): PlayerState {
  if (playerState.velocity === 0) return playerState;

  const changeFactor =
    HEADING_CHANGE_PER_INTERVAL *
    (Math.abs(playerState.velocity) / MAX_VELOCITY);

  if (playerState.turningLeft) {
    return {
      ...playerState,
      headingDegrees: (playerState.headingDegrees + changeFactor) % 360
    };
  }

  if (playerState.turningRight) {
    return {
      ...playerState,
      headingDegrees: (360 + playerState.headingDegrees - changeFactor) % 360
    };
  }

  return playerState;
}
