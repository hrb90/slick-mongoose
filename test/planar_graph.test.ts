import { PlanarGraph } from '../src/planar_graph';

const v = (x: number, y: number) => ({ x: x, y: y });

describe("PlanarGraph", () => {
  it("keeps track of the infiniteFace I", () => {
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
  });

  it("keeps track of the infiniteFace II ", () => {
    let vs = [
      v(0, -10),
      v(0, 0),
      v(-10, 10),
      v(10, 10)
    ]
    let graph2 = new PlanarGraph();
    graph2.addEdge(vs[0], vs[1]);
    graph2.addEdge(vs[1], vs[3]);
    graph2.addEdge(vs[3], vs[2]);
    graph2.addEdge(vs[2], vs[1]);
    expect(graph2.getBoundaryEdges(graph2.infiniteFace).length).toBe(5);
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
