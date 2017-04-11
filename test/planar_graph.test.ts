import { intersect, inInterior, PlanarGraph } from '../src/planar_graph';

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
  const v = (x: number, y: number) => ({ x: x, y: y });
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
