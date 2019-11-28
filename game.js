function buildInitialState() {
  return {
    viewport: {
      centerCell: [0, 0],
      scale: 1
    }
  };
}

export function run() {
  const state = buildInitialState();
  renderToCanvas(state);
}

function renderToCanvas(state) {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "green";
  ctx.fillRect(10, 10, 150, 100);
  console.log("rendered");
}
