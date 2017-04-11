import { intersect, inInterior, isClockwise, PlanarGraph } from '../src/planar_graph';

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

describe("PlanarGraph", () => {
  it("keeps track of the infiniteFace", () => {
    let vs = [
      v(0, -10),
      v(0, 0),
      v(-10, 10),
      v(10, 10)
    ]
    let graph1 = new PlanarGraph();
    graph1.addEdge(vs[0], vs[1]);
    graph1.addEdge(vs[1], vs[2]);
    graph1.addEdge(vs[2], vs[3]);
    graph1.addEdge(vs[3], vs[1]);
    expect(graph1.getBoundaryEdges(graph1.infiniteFace).length).toBe(5);
    let graph2 = new PlanarGraph();
    graph2.addEdge(vs[0], vs[1]);
    graph2.addEdge(vs[1], vs[3]);
    graph2.addEdge(vs[3], vs[2]);
    graph2.addEdge(vs[2], vs[1]);
    expect(graph1.getBoundaryEdges(graph1.infiniteFace).length).toBe(5);
  });

  describe("build a small graph", () => {
    let graph = new PlanarGraph();
    let vertices = [
      v(0, 0),
      v(0, 2),
      v(2, 2),
      v(2, 0),
      v(1, 1.5),
      v(3, 1),
      v(4, 1)
    ];
    // first two elements of the tuple are the indices of the vertices
    // third element is whether the edge will maintain planarity
    let edges : [number, number, boolean][] = [
      [0, 1, true],
      [1, 2, true],
      [2, 3, true],
      [3, 0, true],
      [3, 4, true],
      [0, 2, false],
      [0, 4, true],
      [1, 4, true],
      [2, 4, true],
      [4, 5, false],
      [2, 5, true],
      [3, 5, true],
      [6, 5, true],
      [2, 6, true],
      [3, 6, true],
      [0, 6, false]
    ];

    it("takes edges unless the new edge would cross", () => {
      edges.forEach(triple => {
        console.log(triple);
        expect(graph.addEdge(vertices[triple[0]], vertices[triple[1]])).toBe(triple[2]);
      })
    });

    it("maintains the correct number of edges", () => {
      expect(graph.edges.length/2).toBe(13);
    })

    it("maintains the correct number of faces", () => {
      expect(graph.faces.length).toBe(8);
    })
  });

  describe("build a graph with intermediate steps with non-simple faces", () => {
    let graph = new PlanarGraph();

    let vertices = [
      v(2, 2),
      v(10, 15),
      v(18, 2),
      v(0, 0),
      v(10, 17),
      v(20, 0)
    ];

    let edges: [number, number, boolean][] = [
      [0, 1, true],
      [0, 2, true],
      [1, 2, true],
      [0, 3, true],
      [3, 5, true],
      [4, 5, true],
      [3, 4, true],
      [1, 4, true]
    ]

    it("takes edges unless the new edge would cross", () => {
      edges.forEach(triple => {
        console.log(triple);
        expect(graph.addEdge(vertices[triple[0]], vertices[triple[1]])).toBe(triple[2]);
      })
    });

    it("maintains the correct number of edges", () => {
      expect(graph.edges.length/2).toBe(8);
    })

    it("maintains the correct number of faces", () => {
      expect(graph.faces.length).toBe(4);
    })
  });
  });
});
