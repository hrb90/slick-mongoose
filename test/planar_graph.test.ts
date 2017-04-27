import { PlanarGraph, createEmptyPlanarGraph,
  addEdge, safeAddEdge, removeEdge, removeVertex,
  getBoundaryEdgeKeys, getBoundaryVertexKeys, getOutgoingEdgeKeys } from '../src/planar_graph';
import { Coord } from '../src/geom';

const v = (x: number, y: number) => ({ x: x, y: y });

describe("PlanarGraph", () => {
  it("keeps track of the infiniteFace I", () => {
    let vs = [
      v(0, -10),
      v(0, 0),
      v(-10, 10),
      v(10, 10)
    ]
    const graph1 = createEmptyPlanarGraph();
    const graph2 = addEdge(graph1, vs[0], vs[1]);
    const graph3 = addEdge(graph2, vs[1], vs[2]);
    const graph4 = addEdge(graph3, vs[2], vs[3]);
    const graph5 = addEdge(graph4, vs[3], vs[1]);
    expect(getBoundaryEdgeKeys(graph5, graph5.infiniteFace).length).toBe(5);
  });

  it("keeps track of the infiniteFace II ", () => {
    let vs = [
      v(0, -10),
      v(0, 0),
      v(-10, 10),
      v(10, 10)
    ]
    const graph = createEmptyPlanarGraph();
    const graph1 = addEdge(graph, vs[0], vs[1]);
    const graph2 = addEdge(graph1, vs[1], vs[3]);
    const graph3 = addEdge(graph2, vs[3], vs[2]);
    const graph4 = addEdge(graph3, vs[2], vs[1]);
    expect(getBoundaryEdgeKeys(graph4, graph4.infiniteFace).length).toBe(5);
  });

  describe("build a small graph", () => {
    let graph = createEmptyPlanarGraph();
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
    // third element is whether we will throw an error
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

    it("takes edges unless the new edge would cross, in which case it throws an error", () => {
      edges.forEach(triple => {
        let isSafe = safeAddEdge(graph, vertices[triple[0]], vertices[triple[1]]);
        expect(isSafe).toBe(triple[2]);
        if (isSafe) {
          graph = addEdge(graph, vertices[triple[0]], vertices[triple[1]]);
        }
      })
    });

    it("maintains the correct number of edges", () => {
      expect(Object.keys(graph.edges).length/2).toBe(13);
    })

    it("maintains the correct number of faces", () => {
      expect(Object.keys(graph.faces).length).toBe(8);
    })
  });

  describe("build a graph with intermediate steps with non-simple faces", () => {
    let graph = createEmptyPlanarGraph();

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

    it("takes edges unless the new edge would cross, in which case it throws an error", () => {
      edges.forEach(triple => {
        let isSafe = safeAddEdge(graph, vertices[triple[0]], vertices[triple[1]]);
        expect(isSafe).toBe(triple[2]);
        if (isSafe) {
          graph = addEdge(graph, vertices[triple[0]], vertices[triple[1]]);
        }
      })
    });

    it("maintains the correct number of edges", () => {
      expect(Object.keys(graph.edges).length/2).toBe(8);
    })

    it("maintains the correct number of faces", () => {
      expect(Object.keys(graph.faces).length).toBe(4);
    })
  });

  describe("build another graph with some non-simple faces", () => {
    let graph = createEmptyPlanarGraph();

    let vertices = [
      v(0, 0),
      v(1, 1),
      v(2, 1),
      v(3, 0),
      v(1.5, 4)
    ];

    let edges: [number, number, boolean][] = [
      [1, 0, true],
      [1, 2, true],
      [2, 3, true],
      [1, 4, true],
      [4, 2, true],
      [0, 4, true],
      [3, 4, true],
    ]

    it("takes edges unless the new edge would cross, in which case it throws an error", () => {
      edges.forEach(triple => {
        let isSafe = safeAddEdge(graph, vertices[triple[0]], vertices[triple[1]]);
        expect(isSafe).toBe(triple[2]);
        if (isSafe) {
          graph = addEdge(graph, vertices[triple[0]], vertices[triple[1]]);
        }
      })
    });

    it("maintains the correct number of edges", () => {
      expect(Object.keys(graph.edges).length/2).toBe(7);
    })

    it("maintains the correct number of faces", () => {
      expect(Object.keys(graph.faces).length).toBe(4);
    })
  })
});
