export interface RenderingContext {
  canvasWidth: number;
  canvasHeight: number;
  cellSize: number;
}

export function getVisibleCells() {}

export function getCellCoords(
  cell: [number, number],
  renderingContext: RenderingContext
) {
  const x =
    Math.floor(renderingContext.canvasWidth / 2) +
    cell[0] * renderingContext.cellSize -
    renderingContext.cellSize / 2;
  const y =
    Math.floor(renderingContext.canvasHeight / 2) +
    cell[1] * renderingContext.cellSize -
    renderingContext.cellSize / 2;
  return [x, y];
}
