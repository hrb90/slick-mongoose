export interface Vertex {
  x: number,
  y: number,
  colors?: Array<string>,
  incidentEdge?: HalfEdge;
}

export interface Face {
  infinite: boolean;
  incidentEdge?: HalfEdge;
}

export interface HalfEdge {
  origin: Vertex;
  twin?: HalfEdge;
  // next is the next half edge traveling along the face
  // prev is the previous half edge traveling along the face
  next?: HalfEdge;
  prev?: HalfEdge;
  incidentFace?: Face;
}

// coordinate equality
export const eq = (a: Vertex, b: Vertex) => (a.x === b.x && a.y === b.y);

// 2-dimensional cross product
export const xProd = (v1: Vertex, v2: Vertex) => (v1.x * v2.y - v1.y * v2.x);

// dot product
const dot = (v1: Vertex, v2: Vertex) => (v1.x * v2.x + v1.y + v2.y);

export const angle = (v1: Vertex, v2: Vertex) => {
  return Math.atan2(v1.y - v2.y, v1.x - v2.x);
};

export const getConsecutiveVertexPairs =
  (v: Vertex, i: number, p: Vertex[]) => ([v, p[(i+1)%p.length]]);

// Do the line segments from v1-v2 and v3-v4 intersect?
export const intersect = (v1: Vertex, v2: Vertex, v3: Vertex, v4: Vertex, halfOpen: boolean = false) => {
  let r = { x: v2.x - v1.x, y: v2.y - v1.y };
  let s = { x: v4.x - v3.x, y: v4.y - v3.y };
  let diff = { x: v3.x - v1.x, y: v3.y - v1.y };
  let det = xProd(r, s);
  if (det !== 0) {
    let t = xProd(diff, r)/det;
    let u = xProd(diff, s)/det;
    let interior = (x: number) => (0 < x && x < 1);
    let boundary = (x: number) => (x === 0 || x === 1);
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
      let t0 = dot(diff, r)/dot(r, r);
      let t1 = t0 + dot(s, r)/dot(r, r);
      return (Math.max(t0, t1) > 0 && Math.min(t0, t1) < 1);
    }
  }
}

// Is v in the interior of polygon?
export const inInterior = (polygon: Array<Vertex>, v: Vertex) => {
  if (polygon.length < 3 || polygon.some(u => eq(u, v))) return false;
  let maxX = Math.max(...polygon.map(v => v.x));
  let maxY = Math.max(...polygon.map(v => v.y));
  let outerVertex = { x: maxX + 1, y: maxY + 1 };
  while (polygon.some(u => collinear3([u, v, outerVertex]))) {
    outerVertex.x = outerVertex.x + 1;
  }
  let crossingNum = 0;
  polygon.map(getConsecutiveVertexPairs).forEach(pair => {
    if (intersect(v, outerVertex, pair[0], pair[1], true)) crossingNum += 1;
  })
  return crossingNum % 2 === 1;
}

export const signedArea = (polygon: Array<Vertex>) => {
  let signedAreaSum = 0;
  polygon.map(getConsecutiveVertexPairs).forEach(pair => {
    signedAreaSum += (pair[1].x - pair[0].x) * (pair[1].y + pair[0].y);
  })
  return signedAreaSum;
}

export const isClockwise = (polygon: Array<Vertex>) => (signedArea(polygon) > 0);

export const collinear3 = (polygon: Array<Vertex>) => (signedArea(polygon) === 0);

// Helper method for convex hull
const lexSortYX = (a: Vertex, b: Vertex) => {
  if (a.y - b.y !== 0) {
    return a.y - b.y;
  } else {
    return a.x - b.x;
  }
}

// Graham scan
export const convexHull = (vertices: Vertex[]): Vertex[] => {
  let stack: Vertex[] = [];
  // Don't mutate the input
  let verticesCopy = vertices.slice(0);
  // 1. Find lowest y-value
  let firstVertex: Vertex = verticesCopy.sort(lexSortYX)[0];
  stack.unshift(firstVertex);
  let otherVertices = verticesCopy.slice(1);
  // 2. Sort vertices by angle
  otherVertices.sort((v1: Vertex, v2: Vertex) => (
    isClockwise([firstVertex, v1, v2]) ? -1 : 1
  ))
  // 3. Do the scan
  otherVertices.forEach(nextVertex => {
    while (stack.length > 1 && !isClockwise([stack[1], stack[0], nextVertex])) {
      stack.shift();
    }
    stack.unshift(nextVertex);
  });
  return stack;
};
