import { GameState, PlayerState, Point } from "./types";

export function render(state: GameState) {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  updateCanvasSize(canvas);
  const ctx = canvas.getContext("2d");
  clearCanvas(canvas, ctx);
  Object.values(state.players).forEach(player =>
    renderPlayer(player, canvas, ctx)
  );
}

function updateCanvasSize(canvas: HTMLCanvasElement) {
  if (canvas.width != document.body.clientWidth) {
    canvas.width = document.body.clientWidth;
  }
  if (canvas.height != document.body.clientHeight) {
    canvas.height = document.body.clientHeight;
  }
}

function clearCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export function translateCoords(
  x: number,
  y: number,
  canvas: HTMLCanvasElement
) {
  return [
    x + Math.floor(canvas.width / 2),
    y * -1 + Math.floor(canvas.height / 2)
  ];
}

function renderPlayer(
  playerState: PlayerState,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  const playerSize = 50;
  const [x, y] = translateCoords(playerState.x, playerState.y, canvas);

  withRotation(ctx, { x, y }, playerState.headingDegrees * -1, () => {
    ctx.fillStyle = playerState.color;
    ctx.fillRect(
      x - playerSize / 2,
      y - playerSize / 2,
      playerSize,
      playerSize
    );
  });
}

function rotateCtx(
  centerPoint: Point,
  degrees: number,
  ctx: CanvasRenderingContext2D
) {
  ctx.translate(centerPoint.x, centerPoint.y);
  ctx.rotate((degrees * Math.PI) / 180);
  ctx.translate(centerPoint.x * -1, centerPoint.y * -1);
}

function withRotation(
  ctx: CanvasRenderingContext2D,
  centerPoint: Point,
  degrees: number,
  cb: Function
) {
  rotateCtx(centerPoint, degrees, ctx);
  cb();
  rotateCtx(centerPoint, degrees * -1, ctx);
}
