import { expect } from "chai";

import { translateCoords } from "./canvas-renderer";

describe("canvas-renderer", () => {
  describe("#translateCoords", () => {
    it("[0, 0] should be in the middle of the canvas", () => {
      const canvas = {
        width: 500,
        height: 400
      } as HTMLCanvasElement;
      const x = 0;
      const y = 0;
      const coords = translateCoords(x, y, canvas);
      expect(coords).to.eql([250, 200]);
    });

    it("[250, 200] should be in the top right of the canvas", () => {
      const canvas = {
        width: 500,
        height: 400
      } as HTMLCanvasElement;
      const x = 250;
      const y = 200;
      const coords = translateCoords(x, y, canvas);
      expect(coords).to.eql([500, 0]);
    });
  });
});
