import { expect } from "chai";
import { headingAndVelocityToVector, addVectorToPoint } from "./geometry2d";

describe("geometry2d", () => {
  describe("#headingAndVelocityToVector", () => {
    it("when angle is 0", () => {
      const result = headingAndVelocityToVector(0, 10);
      expect(result.x).to.equal(10);
      expect(result.y).to.equal(0);
    });

    it("when angle is between > 0 and < 90", () => {
      const result = headingAndVelocityToVector(20, 10);
      expect(result.x).to.equal(9);
      expect(result.y).to.equal(3);
    });

    it("when angle is 90", () => {
      const result = headingAndVelocityToVector(90, 10);
      expect(result.x).to.equal(0);
      expect(result.y).to.equal(10);
    });

    it("when angle is > 90 and < 180", () => {
      const result = headingAndVelocityToVector(120, 100);
      expect(result).to.eql({ x: -50, y: 87 });
    });

    it("when angle is > 180 and < 270", () => {
      const result = headingAndVelocityToVector(190, 100);
      expect(result).to.eql({ x: -98, y: -17 });
    });
  });

  describe("#addVectorToPoint", () => {
    it("adds x and y values", () => {
      const point = { x: 5, y: 7 };
      const vector = { x: -3, y: 12 };
      const resultPoint = addVectorToPoint(point, vector);
      expect(resultPoint).to.eql({ x: 2, y: 19 });
    });
  });
});
