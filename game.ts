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
  const renderWithArgs = () => render(state);
  setInterval(renderWithArgs, 1000);
  window.addEventListener("resize", renderWithArgs);
}
