export function render(state: any) {
  const canvas = document.getElementById("canvas");
  sizeCanvas(canvas);
  const ctx = (canvas as any).getContext("2d");
  renderGrid(ctx);
}

function sizeCanvas(canvas: any) {
  if (canvas.width != document.body.clientWidth) {
    canvas.width = document.body.clientWidth;
  }
  if (canvas.height != document.body.clientHeight) {
    canvas.height = document.body.clientHeight;
  }
}

function renderGrid(ctx: any) {
  ctx.fillStyle = "green";
  ctx.fillRect(0, 0, 150, 100);
  console.log("rendered");

  // create a grid of cells (bounding boxes)
  // must be able to correspond to cells in game state
}
