export interface Point {
  x: number;
  y: number;
}

export interface Vector {
  x: number;
  y: number;
}

function degreesToRadians(degrees: number) {
  return degrees * (Math.PI / 180);
}

export function headingAndVelocityToVector(
  heading: number,
  velocity: number
): Vector {
  const rads = degreesToRadians(heading);
  return {
    x: Math.round(Math.cos(rads) * velocity),
    y: Math.round(Math.sin(rads) * velocity)
  };
}

export function addVectorToPoint(point: Point, vector: Vector) {
  return {
    x: point.x + vector.x,
    y: point.y + vector.y
  };
}
