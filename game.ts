import { render } from "./canvas-renderer";

function buildInitialState() {
  return {
    viewport: {
      centerCell: [0, 0],
      cellSize: 100
    }
  };
}

export function run() {
  const state = buildInitialState();
  render(state);
}
