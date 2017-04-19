import { Vertex, intersect, inInterior, isClockwise, convexHull } from '../src/vertex';
import { shuffle } from 'lodash';

const v = (x: number, y: number) => ({ x: x, y: y });

describe("intersect", () => {
  const intersectTrue = (a, b, c, d) => intersect(a, b, c, d, true);
  const intersectFalse = (a, b, c, d) => intersect(a, b, c, d, false);

  describe("points in general position", () => {
    it("handles the case of quadrilateral convex hull", () => {
      const v1 = { x: 0, y: 0 };
      const v2 = { x: 1, y: 5 };
      const v3 = { x: 6, y: 1 };
      const v4 = { x: 6, y: 4 };
      [intersectTrue, intersectFalse].forEach(i => {
        expect(i(v1, v2, v3, v4)).toBe(false);
        expect(i(v1, v3, v2, v4)).toBe(false);
        expect(i(v1, v4, v2, v3)).toBe(true);
      });
    });

    it("handles the case of triangular convex hull", () => {
      const v1 = { x: 0, y: 0 };
      const v2 = { x: 6, y: 6 };
      const v3 = { x: 6, y: 1 };
      const v4 = { x: 5, y: 2 };
      [intersectTrue, intersectFalse].forEach(i => {
        expect(i(v1, v2, v3, v4)).toBe(false);
        expect(i(v1, v3, v2, v4)).toBe(false);
        expect(i(v1, v4, v2, v3)).toBe(false);
      });
    });
  });

  describe("not general position", () => {
    const v1 = { x: 0, y: 0 };
    const v2 = { x: 6, y: 6 };
    const v3 = { x: 6, y: 1 };
    const v4 = { x: 3, y: 3 };
    const v5 = { x: 9, y: 9 };
    it("handles cases where endpoints are identical", () => {
      expect(intersect(v1, v2, v1, v3, true)).toBe(false);
      expect(intersect(v1, v2, v1, v3, false)).toBe(false);
    });
    it("handles cases where three points are collinear", () => {
      expect(intersect(v1, v2, v3, v4, false)).toBe(true);
      expect(intersect(v3, v4, v1, v2, false)).toBe(true);
      expect(intersect(v1, v2, v3, v4, true)).toBe(false);
      expect(intersect(v3, v4, v1, v2, true)).toBe(false);
      expect(intersect(v1, v2, v4, v3, true)).toBe(true);
      expect(intersect(v4, v3, v1, v2, true)).toBe(true);
      expect(intersect(v2, v3, v1, v5, false)).toBe(true);
      expect(intersect(v2, v3, v1, v5, true)).toBe(true);
      expect(intersect(v1, v4, v2, v3, true)).toBe(false);
      expect(intersect(v1, v4, v2, v3, false)).toBe(false);

    });
    it("handles cases where four points are collinear", () => {
      expect(intersect(v1, v4, v2, v5)).toBe(false);
      expect(intersect(v1, v2, v4, v5)).toBe(true);
      expect(intersect(v1, v5, v2, v4)).toBe(true);
    });
  });
});

describe("inInterior", () => {
  const v1 = v(0, 0);
  const v2 = v(0, 10);
  const v3 = v(5, 8);
  const v4 = v(10, 10);
  const v5 = v(10, 0);
  const v6 = v(5, 2);
  describe("general position", () => {
    it("returns false when there are two or fewer vertices", () => {
      expect(inInterior([v5], v4)).toBe(false);
      expect(inInterior([v1, v2], v3)).toBe(false);
      expect(inInterior([v1, v4], v(5, 5))).toBe(false);
    });

    it("handles triangles", () => {
      expect(inInterior([v1, v2, v4], v3)).toBe(true);
      expect(inInterior([v1, v2, v4], v6)).toBe(false);
      expect(inInterior([v1, v3, v5], v6)).toBe(true);
      expect(inInterior([v1, v3, v5], v4)).toBe(false);
      expect(inInterior([
        v(468, 483),
        v(175, 394),
        v(332, 407)
      ], v(90, 105))).toBe(false);
    });

    it("handles quadrilaterals", () => {
      // convex
      expect(inInterior([v1, v2, v4, v5], v3)).toBe(true);
      expect(inInterior([v1, v2, v4, v5], v6)).toBe(true);
      expect(inInterior([v1, v2, v4, v5], v(6, 12))).toBe(false);
      // nonconvex
      let v59 = v(5, 9);
      let v78 = v(7, 8);
      expect(inInterior([v1, v2, v3, v4], v5)).toBe(false);
      expect(inInterior([v1, v2, v4, v3], v5)).toBe(false);
      expect(inInterior([v1, v2, v3, v4], v59)).toBe(false);
      expect(inInterior([v1, v2, v4, v3], v59)).toBe(true);
      expect(inInterior([v1, v2, v3, v4], v78)).toBe(true);
      expect(inInterior([v1, v2, v4, v3], v78)).toBe(false);
    });

    it("handles a hexagon", () => {
      let hexagon = [v1, v2, v3, v4, v5, v6];
      expect(inInterior(hexagon, v(5, 1))).toBe(false);
      expect(inInterior(hexagon, v(5, 5))).toBe(true);
      expect(inInterior(hexagon, v(5, 9))).toBe(false);
      expect(inInterior(hexagon, v(7, 8))).toBe(true);
      expect(inInterior(hexagon, v(2, 3))).toBe(true);
      expect(inInterior(hexagon, v(3, 11))).toBe(false);
    })
  });

  describe("not general position", () => {

  });
});

describe("isClockwise", () => {
  const v1 = v(0, 0);
  const v2 = v(0, 10);
  const v3 = v(5, 8);
  const v4 = v(10, 10);
  const v5 = v(10, 0);
  const v6 = v(5, 2);

  it("works for clockwise triangles", () => {
    expect(isClockwise([v1, v2, v5])).toBe(true);
    expect(isClockwise([v3, v6, v1])).toBe(true);
    expect(isClockwise([v4, v3, v2])).toBe(true);
  });

  it("works for counterclockwise triangles", () => {
    expect(isClockwise([v1, v5, v2])).toBe(false);
    expect(isClockwise([v5, v6, v1])).toBe(false);
    expect(isClockwise([v1, v4, v3])).toBe(false);
  });

  it("works for a hexagon", () => {
    expect(isClockwise([v1, v2, v3, v4, v5, v6])).toBe(true);
    expect(isClockwise([v6, v5, v4, v3, v2, v1])).toBe(false);
  })
});

describe("convexHull", () => {
  const testVertexSet = (vertexSet: Vertex[], name: string, expectedLength: number) => {
    describe(name, () => {
      let polygon = convexHull(shuffle(vertexSet));

      it("returns in counterclockwise order", () => {
        expect(isClockwise(polygon)).toBe(false);
      });

      it("returns a polygon containing every other vertex", () => {
        vertexSet.forEach((v: Vertex) => {
          expect(inInterior(polygon, v) || polygon.includes(v)).toBe(true);
        })
      });

      it("has the right length", () => {
        expect(polygon.length).toBe(expectedLength);
      });
    });
  }

  testVertexSet([v(0, 0), v(1, 3), v(4, 6)], "triangle", 3);
  testVertexSet([v(0, 0), v(1, 2), v(3, 2), v(2, 3), v(1, 1), v(4, 0)],
    "pentagon + 1 interior", 5);
  testVertexSet([v(0, 0), v(0, 10), v(10, 10), v(10, 0),
    v(3, 5), v(6, 2), v(1, 1), v(8, 3), v(4, 9), v(4, 4)],
    "square + 6 interior", 4);
});
