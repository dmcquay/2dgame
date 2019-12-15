import { GameState } from "./game";
import {
  RenderingContext,
  getCellCoords,
  getVisibleCells
} from "./render-utils";

const CELL_SIZE = 100;

const playerImg = new Image();
playerImg.src = "/static/images/link.png";
let playerImgIsReady = false;
playerImg.addEventListener("load", e => (playerImgIsReady = true));

export function render(state: GameState) {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  updateCanvasSize(canvas);
  const ctx = canvas.getContext("2d");
  const renderingContext = {
    canvasWidth: canvas.width,
    canvasHeight: canvas.height,
    cellSize: CELL_SIZE
  };
  renderGrid(ctx, renderingContext);
  renderPlayer(state, ctx, renderingContext);
}

function updateCanvasSize(canvas: HTMLCanvasElement) {
  if (canvas.width != document.body.clientWidth) {
    canvas.width = document.body.clientWidth;
  }
  if (canvas.height != document.body.clientHeight) {
    canvas.height = document.body.clientHeight;
  }
}

function renderGrid(
  ctx: CanvasRenderingContext2D,
  renderingContext: RenderingContext
) {
  const cells = getVisibleCells(renderingContext);
  cells.forEach(cell => renderCellBackground(cell, ctx, renderingContext));
}

function renderPlayer(
  state: GameState,
  ctx: CanvasRenderingContext2D,
  renderingContext: RenderingContext
) {
  if (!playerImgIsReady) return;
  const [x, y] = getCellCoords(state.playerCell, renderingContext);
  ctx.drawImage(playerImg, x, y, CELL_SIZE, CELL_SIZE);
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

function renderCellBackground(
  cell: [number, number],
  ctx: CanvasRenderingContext2D,
  renderingContext: RenderingContext
) {
  const color = colors[Math.floor(Math.random() * colors.length)];
  ctx.fillStyle = color;
  const [x, y] = getCellCoords(cell, renderingContext);
  ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
}
