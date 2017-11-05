import { PlanarGraph, getEndpoints } from "../src/planar_graph";
import { fiveColor } from "../src/thomassen";
import { euler } from "./base";
import { NINE_VERTEX, W6, BIG_GRAPH } from "./graphs";
import {} from "jest";

describe("fiveColor", () => {
  const testEdgeColoring = (coloredGraph: PlanarGraph, eKey: string) => {
    let endpoints = getEndpoints(coloredGraph, eKey);
    let v0 = coloredGraph.vertices[endpoints[0]];
    let v1 = coloredGraph.vertices[endpoints[1]];
    return (
      v0.colors.length === 1 &&
      v1.colors.length === 1 &&
      v0.colors[0] !== v1.colors[0]
    );
  };

  const testGraphColoring = (graph: PlanarGraph) => {
    const coloredGraph = fiveColor(graph);
    let result = true;
    Object.keys(coloredGraph.edges).forEach(eKey => {
      result = result && testEdgeColoring(coloredGraph, eKey);
    });
    return result;
  };

  const testGraph = (graph: PlanarGraph) =>
    testGraphColoring(graph) && euler(graph);

  it("colors a small graph", () => {
    expect(testGraph(W6)).toBe(true);
  });

  it("colors a medium size graph", () => {
    expect(testGraph(NINE_VERTEX)).toBe(true);
  });

  it("colors a big graph", () => {
    expect(testGraph(BIG_GRAPH)).toBe(true);
  });
});
