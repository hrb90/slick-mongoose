import { intersect, inInterior, PlanarGraph } from '../src/planar_graph';

describe("intersect", () => {
  describe("points in general position", () => {
    it("handles the case of quadrilateral convex hull", () => {
      const v1 = { x: 0, y: 0 };
      const v2 = { x: 1, y: 5 };
      const v3 = { x: 6, y: 1 };
      const v4 = { x: 6, y: 4 };
      expect(intersect(v1, v2, v3, v4)).toBe(false);
      expect(intersect(v1, v3, v2, v4)).toBe(false);
      expect(intersect(v1, v4, v2, v3)).toBe(true);
    });

    it("handles the case of triangular convex hull", () => {
      const v1 = { x: 0, y: 0 };
      const v2 = { x: 6, y: 6 };
      const v3 = { x: 6, y: 1 };
      const v4 = { x: 5, y: 2 };
      expect(intersect(v1, v2, v3, v4)).toBe(false);
      expect(intersect(v1, v3, v2, v4)).toBe(false);
      expect(intersect(v1, v4, v2, v3)).toBe(false);
    });
  });

  describe("not general position", () => {
    const v1 = { x: 0, y: 0 };
    const v2 = { x: 6, y: 6 };
    const v3 = { x: 6, y: 1 };
    const v4 = { x: 3, y: 3 };
    const v5 = { x: 9, y: 9 };
    it("handles cases where endpoints are identical", () => {
      expect(intersect(v1, v2, v1, v3)).toBe(false);
    });
    it("handles cases where three points are collinear", () => {
      expect(intersect(v1, v2, v3, v4)).toBe(true);
      expect(intersect(v1, v5, v2, v3)).toBe(true);
      expect(intersect(v1, v4, v2, v3)).toBe(false);
    });
    it("handles cases where four points are collinear", () => {
      expect(intersect(v1, v4, v2, v5)).toBe(false);
      expect(intersect(v1, v2, v4, v5)).toBe(true);
      expect(intersect(v1, v5, v2, v4)).toBe(true);
    });
  });
});
