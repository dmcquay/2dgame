import { render } from "./canvas-renderer";

export interface GameState {
  playerCell: [0, 0];
}

function buildInitialState(): GameState {
  return {
    playerCell: [0, 0]
  };
}

export function run() {
  const state = buildInitialState();
  const renderWithArgs = () => render(state);
  setInterval(renderWithArgs, 1000);
  window.addEventListener("resize", renderWithArgs);
}
