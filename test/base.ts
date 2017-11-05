import { PlanarGraph } from "../src/planar_graph";

export const euler = (graph: PlanarGraph) => {
  const length = (x: object) => Object.keys(x).length;
  return (
    length(graph.vertices) - length(graph.edges) / 2 + length(graph.faces) === 2
  );
};
