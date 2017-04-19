import { Vertex, HalfEdge, Face,
  angle, getConsecutiveVertexPairs, convexHull } from './vertex';
import { PlanarGraph } from './planar_graph';
import { GraphDrawingWrapper } from './canvas_wrapper';

const PAUSE = 500;

export const animate = (canvas: GraphDrawingWrapper): void => {
  if (canvas.graph.vertices.length < 3) {
    alert("please connect more vertices");
  } else {
    window.graphLog = window.graphLog.concat("beginHullify;");
    hullify(canvas);
    window.graphLog = window.graphLog.concat("beginTriangulate;");
    triangulate(canvas);
    window.graphLog = window.graphLog.concat("endTrianguate;");
    color(canvas);
  }
}

const hullify = (canvas: GraphDrawingWrapper): void => {
  let hullVertices = convexHull(canvas.graph.vertices);
  hullVertices.map(getConsecutiveVertexPairs).forEach((pair: Vertex[]) => {
    canvas.drawEdge(pair[0], pair[1], "blue");
  });
}

const triangulate = (canvas: GraphDrawingWrapper): void => {
  let graph = canvas.graph;
  let isTriangulated = false;
  while (!isTriangulated) {
    isTriangulated = true;
    graph.faces.forEach(f => {
      isTriangulated = isTriangulated && triangulateFace(canvas, f)
    });
  }
}

const triangulateFace = (canvas: GraphDrawingWrapper, face: Face): boolean => {
  let graph = canvas.graph;
  let edges = graph.getBoundaryEdges(face);
  if (edges.length > 3 && !face.infinite) {
    let potentialEdges: Vertex[][] = edges.map(e => [e.origin, e.next.next.origin]);
    for (let i = 0; i < potentialEdges.length; i++) {
      let v1 = potentialEdges[i][0];
      let v2 = potentialEdges[i][1];
      if (graph.getEdgeFace(v1, v2) === face) {
        canvas.drawEdge(v1, v2, "blue");
        return false;
      }
    }
  }
  return true;
}

const findChord = (graph: PlanarGraph): HalfEdge | null => {
  let chord = null;
  let outerVertices = graph.getBoundaryVertices(graph.infiniteFace);
  outerVertices.forEach(v => {
    let edges = graph.getOutgoingEdges(v);
    edges.forEach(e => {
      if (outerVertices.includes(e.next.origin) && e.incidentFace != graph.infiniteFace) {
        chord = e;
      }
    });
  });
  return chord;
}

const color = (canvas: GraphDrawingWrapper): void => {
  let graph = canvas.graph;
  let chord = findChord(graph);
  if (chord) {

  } else {

  }
}
