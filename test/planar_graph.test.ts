import { intersect, inInterior, PlanarGraph } from '../src/planar_graph';

describe("intersect", () => {
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

  it("handles edge cases", () => {

  });
});
