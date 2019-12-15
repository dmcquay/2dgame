import { expect } from "chai";
import { getRenderableCellBounds, getCellCoords } from "./render-utils";

describe("#getRenderableCellBounds", () => {
  it("works", () => {
    // center is 0, 0
    // cellSize is 100
    // screen is 500px wide and 300px tall
    // [-150,-250] to [150,250]
    // [-1,-2] to [1,2]
    const result = getRenderableCellBounds();
    expect(result).to.be.eql([
      [-2, -1],
      [2, 1]
    ]);
  });
});

describe("#getCellCoords", () => {
  it("works", () => {
    const result = getCellCoords(2, 1, 100);
    expect(result).to.equal([]);
  });
});
