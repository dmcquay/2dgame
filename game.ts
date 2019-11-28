import { render } from "./canvas-renderer";

interface GameStateViewport {
  centerCell: [number, number];
  cellSize: number;
}

export interface GameState {
  viewport: GameStateViewport;
}

function buildInitialState(): GameState {
  return {
    viewport: {
      centerCell: [0, 0],
      cellSize: 100
    }
  };
}

export function run() {
  const state = buildInitialState();
  const renderWithArgs = () => render(state);
  setInterval(renderWithArgs, 1000);
  window.addEventListener("resize", renderWithArgs);
}
