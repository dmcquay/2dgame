export function render(state: any) {
  const canvas = document.getElementById("canvas");
  updateCanvasSize(canvas);
  const ctx = (canvas as any).getContext("2d");
  renderGrid(canvas, ctx);
}

function updateCanvasSize(canvas: any) {
  if (canvas.width != document.body.clientWidth) {
    canvas.width = document.body.clientWidth;
  }
  if (canvas.height != document.body.clientHeight) {
    canvas.height = document.body.clientHeight;
  }
}

function renderGrid(canvas: any, ctx: any) {
  const cellSize = 100;
  const width = canvas.width;
  const height = canvas.height;
  const cellsWide = Math.ceil(canvas.width / cellSize); // assert odd
  const cellsTall = Math.ceil(canvas.height / cellSize); // assert odd
  console.log({ cellSize, cellsWide, cellsTall, width, height });
  for (
    let x = Math.floor(cellsWide / 2) * -1;
    x <= Math.floor(cellsWide / 2);
    x += 1
  ) {
    for (
      let y = Math.floor(cellsTall / 2) * -1;
      y <= Math.floor(cellsTall / 2);
      y += 1
    ) {
      renderCell(x, y, ctx, canvas);
    }
  }
}

const colors = [
  "green",
  "red",
  "blue",
  "orange",
  "violet",
  "yellow",
  "black",
  "white",
  "gray"
];

function renderCell(cellX: number, cellY: number, ctx: any, canvas: any) {
  const cellSize = 100;
  const color = colors[Math.floor(Math.random() * colors.length)];
  ctx.fillStyle = color;
  const x = Math.floor(canvas.width / 2) + cellX * cellSize - cellSize / 2;
  const y = Math.floor(canvas.height / 2) + cellY * cellSize - cellSize / 2;
  ctx.fillRect(x, y, cellSize, cellSize);
}
