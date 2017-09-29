export interface Coord {
  x: number;
  y: number;
}

// coordinate equality
export const eq = (a: Coord, b: Coord) => {
  const intEq = (x: number, y: number) => Math.abs(x - y) < 0.1;
  return intEq(a.x, b.x) && intEq(a.y, b.y)
};

// 2-dimensional cross product
export const xProd = (v1: Coord, v2: Coord) => v1.x * v2.y - v1.y * v2.x;

// dot product
const dot = (v1: Coord, v2: Coord) => v1.x * v2.x + v1.y * v2.y;

const scale = (scalar: number, v: Coord) => ({
  x: scalar * v.x,
  y: scalar * v.y
});

const plus = (a: Coord, b: Coord) => ({
  x: a.x + b.x,
  y: a.y + b.y
});

const minus = (a: Coord, b: Coord) => plus(a, scale(-1, b));

export const angle = (v1: Coord, v2: Coord) => {
  return Math.atan2(v1.y - v2.y, v1.x - v2.x);
};

export const getConsecutiveCoordPairs = (v: Coord, i: number, p: Coord[]) => [
  v,
  p[(i + 1) % p.length]
];

// Do the line segments from v1-v2 and v3-v4 intersect?
export const intersect = (
  v1: Coord,
  v2: Coord,
  v3: Coord,
  v4: Coord,
  halfOpen: boolean = false
) => {
  let r = minus(v2, v1);
  let s = minus(v4, v3);
  let diff = minus(v3, v1);
  let det = xProd(r, s);
  if (det !== 0) {
    let t = xProd(diff, r) / det;
    let u = xProd(diff, s) / det;
    let interior = (x: number) => 0 < x && x < 1;
    let boundary = (x: number) => x === 0 || x === 1;
    if (interior(t) && interior(u)) {
      // the segments intersect
      return true;
    } else if (boundary(t) || boundary(u)) {
      // three points are collinear
      return (interior(t) || interior(u)) && (!halfOpen || t === 0 || u === 0);
    } else {
      return false;
    }
  } else {
    if (xProd(diff, r) !== 0) {
      // parallel, non-collinear
      return false;
    } else {
      // all 4 points collinear
      let t0 = dot(diff, r) / dot(r, r);
      let t1 = t0 + dot(s, r) / dot(r, r);
      return Math.max(t0, t1) > 0 && Math.min(t0, t1) < 1;
    }
  }
};

// Is v in the interior of polygon?
export const inInterior = (polygon: Array<Coord>, v: Coord) => {
  if (polygon.length < 3 || polygon.some(u => eq(u, v))) return false;
  let maxX = Math.max(...polygon.map(v => v.x));
  let maxY = Math.max(...polygon.map(v => v.y));
  let outerCoord = { x: maxX + 1, y: maxY + 1 };
  while (polygon.some(u => collinear3([u, v, outerCoord]))) {
    outerCoord.x = outerCoord.x + 1;
  }
  let crossingNum = 0;
  polygon.map(getConsecutiveCoordPairs).forEach(pair => {
    if (intersect(v, outerCoord, pair[0], pair[1], true)) crossingNum += 1;
  });
  return crossingNum % 2 === 1;
};

export const signedArea = (polygon: Array<Coord>) => {
  let signedAreaSum = 0;
  polygon.map(getConsecutiveCoordPairs).forEach(pair => {
    signedAreaSum += (pair[1].x - pair[0].x) * (pair[1].y + pair[0].y);
  });
  return signedAreaSum;
};

export const isClockwise = (polygon: Array<Coord>) => signedArea(polygon) > 0;

export const collinear3 = (polygon: Array<Coord>) => signedArea(polygon) === 0;

// Helper method for convex hull
const lexSortYX = (a: Coord, b: Coord) => {
  if (a.y - b.y !== 0) {
    return a.y - b.y;
  } else {
    return a.x - b.x;
  }
};

// Graham scan
export const convexHull = (vertices: Coord[]): Coord[] => {
  let stack: Coord[] = [];
  // Don't mutate the input
  let verticesCopy = vertices.slice(0);
  // 1. Find lowest y-value
  let firstCoord: Coord = verticesCopy.sort(lexSortYX)[0];
  stack.unshift(firstCoord);
  let otherVertices = verticesCopy.slice(1);
  // 2. Sort vertices by angle
  otherVertices.sort(
    (v1: Coord, v2: Coord) => (isClockwise([firstCoord, v1, v2]) ? -1 : 1)
  );
  // 3. Do the scan
  otherVertices.forEach(nextCoord => {
    while (stack.length > 1 && !isClockwise([stack[1], stack[0], nextCoord])) {
      stack.shift();
    }
    stack.unshift(nextCoord);
  });
  return stack;
};

const dist2 = (v1: Coord, v2: Coord) => {
  let diff = minus(v2, v1);
  return dot(diff, diff);
};

export const distance = (v1: Coord, v2: Coord) => {
  return Math.sqrt(dist2(v1, v2));
};

export const unitVector = (v1: Coord, v2: Coord) => {
  const d = distance(v1, v2);
  return <Coord>{ x: (v1.x - v2.x) / d, y: (v1.y - v2.y) / d };
};

export const pointSegmentDistance = (
  p: Coord,
  endPoint1: Coord,
  endPoint2: Coord
) => {
  if (eq(endPoint1, endPoint2)) {
    return distance(p, endPoint1);
  } else {
    let l2 = dist2(endPoint2, endPoint1);
    let t = dot(minus(p, endPoint1), minus(endPoint2, endPoint1)) / l2;
    t = Math.max(0, Math.min(1, t));
    return distance(p, plus(endPoint1, scale(t, minus(endPoint2, endPoint1))));
  }
};
