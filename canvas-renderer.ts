import { GameState } from "./game";

const playerImg = new Image();
playerImg.src = "/static/images/link.png";
let playerImgIsReady = false;
playerImg.addEventListener("load", e => (playerImgIsReady = true));

export function render(state: GameState) {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  updateCanvasSize(canvas);
  const ctx = canvas.getContext("2d");
  renderGrid(canvas, ctx);
  renderPlayer(0, 0, ctx, canvas);
}

function updateCanvasSize(canvas: HTMLCanvasElement) {
  if (canvas.width != document.body.clientWidth) {
    canvas.width = document.body.clientWidth;
  }
  if (canvas.height != document.body.clientHeight) {
    canvas.height = document.body.clientHeight;
  }
}

function renderGrid(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const cellSize = 100;
  const cellsWide = Math.ceil(canvas.width / cellSize); // assert odd
  const cellsTall = Math.ceil(canvas.height / cellSize); // assert odd
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

function renderPlayer(
  cellX: number,
  cellY: number,
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
) {
  const cellSize = 100;
  if (!playerImgIsReady) return;
  const x = canvas.width / 2 - cellSize / 2;
  const y = canvas.height / 2 - cellSize / 2;
  ctx.drawImage(playerImg, x, y, cellSize, cellSize);
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

function renderCell(
  cellX: number,
  cellY: number,
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
) {
  const cellSize = 100;
  const color = colors[Math.floor(Math.random() * colors.length)];
  ctx.fillStyle = color;
  const x = Math.floor(canvas.width / 2) + cellX * cellSize - cellSize / 2;
  const y = Math.floor(canvas.height / 2) + cellY * cellSize - cellSize / 2;
  ctx.fillRect(x, y, cellSize, cellSize);
}
