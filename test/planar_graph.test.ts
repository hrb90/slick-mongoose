import {
  createEmptyPlanarGraph,
  getVertexKey,
  addEdge,
  safeAddEdge,
  removeEdgeByVertices,
  removeVertex,
  removeVertexByCoord,
  getBoundaryEdgeKeys,
  splitChordedGraph,
  findChordKey,
  inducedInteriorSubgraph,
  findVp
} from "../src/planar_graph";
import { euler } from "./base";
import { REMOVE_VERTEX_TEST, REMOVE_VERTEX_TEST_KEY } from "./graphs";
import {} from "jest";

const v = (x: number, y: number) => ({ x: x, y: y });

describe("addEdge", () => {
  it("keeps track of the infiniteFace I", () => {
    let vs = [v(0, -10), v(0, 0), v(-10, 10), v(10, 10)];
    const graph1 = createEmptyPlanarGraph();
    const graph2 = addEdge(graph1, vs[0], vs[1]);
    const graph3 = addEdge(graph2, vs[1], vs[2]);
    const graph4 = addEdge(graph3, vs[2], vs[3]);
    const graph5 = addEdge(graph4, vs[3], vs[1]);
    expect(getBoundaryEdgeKeys(graph5, graph5.infiniteFace).length).toBe(5);
    expect(euler(graph5)).toBe(true);
  });

  it("keeps track of the infiniteFace II ", () => {
    let vs = [v(0, -10), v(0, 0), v(-10, 10), v(10, 10)];
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
    let edges: [number, number, boolean][] = [
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
        let isSafe = safeAddEdge(
          graph,
          vertices[triple[0]],
          vertices[triple[1]]
        );
        expect(isSafe).toBe(triple[2]);
        if (isSafe) {
          graph = addEdge(graph, vertices[triple[0]], vertices[triple[1]]);
        }
      });
    });

    it("maintains the correct number of edges", () => {
      expect(Object.keys(graph.edges).length / 2).toBe(13);
    });

    it("maintains the correct number of faces", () => {
      expect(Object.keys(graph.faces).length).toBe(8);
    });
  });

  describe("build a graph with intermediate steps with non-simple faces", () => {
    let graph = createEmptyPlanarGraph();

    let vertices = [v(2, 2), v(10, 15), v(18, 2), v(0, 0), v(10, 17), v(20, 0)];

    let edges: [number, number, boolean][] = [
      [0, 1, true],
      [0, 2, true],
      [1, 2, true],
      [0, 3, true],
      [3, 5, true],
      [4, 5, true],
      [3, 4, true],
      [1, 4, true]
    ];

    it("takes edges unless the new edge would cross, in which case it throws an error", () => {
      edges.forEach(triple => {
        let isSafe = safeAddEdge(
          graph,
          vertices[triple[0]],
          vertices[triple[1]]
        );
        expect(isSafe).toBe(triple[2]);
        if (isSafe) {
          graph = addEdge(graph, vertices[triple[0]], vertices[triple[1]]);
        }
      });
    });

    it("maintains the correct number of edges", () => {
      expect(Object.keys(graph.edges).length / 2).toBe(8);
    });

    it("maintains the correct number of faces", () => {
      expect(Object.keys(graph.faces).length).toBe(4);
    });
  });

  describe("build another graph with some non-simple faces", () => {
    let graph = createEmptyPlanarGraph();

    let vertices = [v(0, 0), v(1, 1), v(2, 1), v(3, 0), v(1.5, 4)];

    let edges: [number, number, boolean][] = [
      [1, 0, true],
      [1, 2, true],
      [2, 3, true],
      [1, 4, true],
      [4, 2, true],
      [0, 4, true],
      [3, 4, true]
    ];

    it("takes edges unless the new edge would cross, in which case it throws an error", () => {
      edges.forEach(triple => {
        let isSafe = safeAddEdge(
          graph,
          vertices[triple[0]],
          vertices[triple[1]]
        );
        expect(isSafe).toBe(triple[2]);
        if (isSafe) {
          graph = addEdge(graph, vertices[triple[0]], vertices[triple[1]]);
        }
      });
    });

    it("maintains the correct number of edges", () => {
      expect(Object.keys(graph.edges).length / 2).toBe(7);
    });

    it("maintains the correct number of faces", () => {
      expect(Object.keys(graph.faces).length).toBe(4);
    });
  });
});

describe("removeEdge", () => {
  it("keeps track of the infiniteFace", () => {
    let vs = [v(0, -10), v(0, 0), v(-10, 10), v(10, 10)];
    const graph1 = createEmptyPlanarGraph();
    const graph2 = addEdge(graph1, vs[0], vs[1]);
    const graph3 = addEdge(graph2, vs[1], vs[2]);
    const graph4 = addEdge(graph3, vs[2], vs[3]);
    const graph5 = addEdge(graph4, vs[3], vs[0]);
    const graph6 = addEdge(graph5, vs[1], vs[3]);
    const graph7 = removeEdgeByVertices(graph6, vs[1], vs[2]);
    expect(getBoundaryEdgeKeys(graph5, graph5.infiniteFace).length).toBe(4);
    expect(getBoundaryEdgeKeys(graph7, graph7.infiniteFace).length).toBe(5);
    expect(euler(graph5)).toBe(true);
    expect(euler(graph7)).toBe(true);
  });

  describe("build a graph with intermediate steps with non-simple faces", () => {
    let graph = createEmptyPlanarGraph();

    let vertices = [v(2, 2), v(10, 15), v(18, 2), v(0, 0), v(10, 17), v(20, 0)];

    let edges: [number, number][] = [
      [0, 1],
      [0, 2],
      [1, 2],
      [0, 3],
      [3, 5],
      [4, 5],
      [3, 4],
      [1, 4]
    ];

    edges.forEach(edge => {
      graph = addEdge(graph, vertices[edge[0]], vertices[edge[1]]);
    });

    graph = removeEdgeByVertices(graph, vertices[0], vertices[3]);
    graph = removeEdgeByVertices(graph, vertices[1], vertices[2]);

    it("maintains the correct number of edges", () => {
      expect(Object.keys(graph.edges).length / 2).toBe(6);
    });

    it("maintains the correct number of faces", () => {
      expect(Object.keys(graph.faces).length).toBe(2);
    });
  });
});

describe("removeVertex", () => {
  describe("build a graph with intermediate steps with non-simple faces", () => {
    let graph = createEmptyPlanarGraph();

    let vertices = [v(2, 2), v(10, 15), v(18, 2), v(0, 0), v(10, 17), v(20, 0)];

    let edges: [number, number][] = [
      [0, 1],
      [0, 2],
      [1, 2],
      [0, 3],
      [3, 5],
      [4, 5],
      [3, 4],
      [1, 4]
    ];

    edges.forEach(edge => {
      graph = addEdge(graph, vertices[edge[0]], vertices[edge[1]]);
    });

    graph = removeVertexByCoord(graph, vertices[2]);

    it("maintains the correct number of edges", () => {
      expect(Object.keys(graph.edges).length / 2).toBe(6);
    });

    it("maintains the correct number of faces", () => {
      expect(Object.keys(graph.faces).length).toBe(3);
    });
  });

  describe("remove a vertex from a larger graph", () => {
    it("successfully does it", () => {
      const verticesBefore = Object.keys(REMOVE_VERTEX_TEST.vertices).length;
      const newGraph = removeVertex(REMOVE_VERTEX_TEST, REMOVE_VERTEX_TEST_KEY);
      expect(Object.keys(newGraph.vertices).length).toBe(verticesBefore - 1);
      // breaks the euler invariant; fix!
    });
  });
});

describe("splitChordedGraph", () => {
  it("passes the simplest possible case", () => {
    let graph = createEmptyPlanarGraph();
    let a = v(0, 0);
    let b = v(0, 1);
    let c = v(1, 1);
    let d = v(1, 0);
    graph = addEdge(graph, a, b);
    graph = addEdge(graph, b, c);
    graph = addEdge(graph, c, d);
    let square = addEdge(graph, d, a);
    let diamond = addEdge(square, a, c);

    let [t1, t2] = splitChordedGraph(diamond, findChordKey(diamond));
    expect(Object.keys(t1.vertices).length).toBe(3);
    expect(Object.keys(t2.vertices).length).toBe(3);
    expect(Object.keys(t1.edges).length).toBe(6);
    expect(Object.keys(t2.edges).length).toBe(6);
    expect(Object.keys(t1.faces).length).toBe(2);
    expect(Object.keys(t2.faces).length).toBe(2);
  });
});

describe("inducedInteriorSubgraph", () => {
  it("deconstructs the graph without blowing up", () => {
    let graph = createEmptyPlanarGraph();

    let vertices = [
      v(0, 0),
      v(0, 10),
      v(5, 15),
      v(10, 10),
      v(10, 0),
      v(5, -5),
      v(5, -2),
      v(7, 3),
      v(5, 12)
    ];

    let edges = [
      [0, 1],
      [0, 3],
      [0, 4],
      [0, 5],
      [0, 6],
      [0, 7],
      [1, 2],
      [1, 3],
      [1, 8],
      [2, 3],
      [2, 8],
      [3, 4],
      [3, 7],
      [3, 8],
      [4, 5],
      [4, 6],
      [4, 7],
      [5, 6]
    ];

    edges.forEach(edge => {
      graph = addEdge(graph, vertices[edge[0]], vertices[edge[1]]);
    });

    let triangle = vertices.slice(1, 4).map(c => getVertexKey(graph, c));

    let subgraph = inducedInteriorSubgraph(graph, triangle);

    expect(Object.keys(subgraph.faces).length).toBe(4);
    expect(Object.keys(subgraph.edges).length).toBe(12);
    expect(Object.keys(subgraph.vertices).length).toBe(4);
  });
});

describe("findVp", () => {
  it("finds the right point on a 5-cycle", () => {
    let g = createEmptyPlanarGraph();
    g = addEdge(g, v(0, 0), v(5, 0));
    g = addEdge(g, v(5, 0), v(5, 5));
    g = addEdge(g, v(5, 5), v(3, 7));
    g = addEdge(g, v(3, 7), v(0, 5));
    g = addEdge(g, v(0, 5), v(0, 0));

    g.mark1 = getVertexKey(g, v(0, 0));
    g.mark2 = getVertexKey(g, v(5, 0));

    let a = g.vertices[findVp(g)];

    expect(a.x).toBe(0);
    expect(a.y).toBe(5);
  });
});
