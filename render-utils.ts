export interface RenderingContext {
  canvasWidth: number;
  canvasHeight: number;
  cellSize: number;
}

export function getVisibleCells(
  renderingContext: RenderingContext
): [number, number][] {
  const cells: [number, number][] = [];
  const cellsWide = Math.ceil(
    renderingContext.canvasWidth / renderingContext.cellSize
  ); // assert odd
  const cellsTall = Math.ceil(
    renderingContext.canvasHeight / renderingContext.cellSize
  ); // assert odd
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
      cells.push([x, y]);
    }
  }
  return cells;
}

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
