import { Coord, angle, getConsecutiveCoordPairs, convexHull } from './geom';
import { Vertex, HalfEdge, Face, PlanarGraph,
  getBoundaryEdgeKeys, getBoundaryVertexKeys, getOutgoingEdgeKeys, getSplitFaceKey } from './planar_graph';
import { GraphDrawingWrapper } from './canvas_wrapper';
import { values, forIn } from 'lodash';

const PAUSE = 500;

export const animate = (canvas: GraphDrawingWrapper): void => {
  if (values(canvas.graph.vertices).length < 3) {
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
  let hullVertices = convexHull(values(canvas.graph.vertices));
  hullVertices.map(getConsecutiveCoordPairs).forEach((pair: Vertex[]) => {
    canvas.drawEdge(pair[0], pair[1], "blue");
  });
}

const triangulate = (canvas: GraphDrawingWrapper): void => {
  let graph = canvas.graph;
  let isTriangulated = false;
  while (!isTriangulated) {
    isTriangulated = true;
    forIn(graph.faces, (f, fKey) => {
      isTriangulated = isTriangulated && triangulateFace(canvas, fKey)
    });
  }
}

const triangulateFace = (canvas: GraphDrawingWrapper, faceKey: string): boolean => {
  let graph = canvas.graph;
  let edges = getBoundaryEdgeKeys(graph, faceKey);
  if (edges.length > 3 && graph.infiniteFace !== faceKey) {
    let potentialEdges: string[][] = edges.map(eKey =>
      [graph.edges[eKey].origin, graph.edges[graph.edges[graph.edges[eKey].next].next].origin]);
    for (let i = 0; i < potentialEdges.length; i++) {
      let v1 = graph.vertices[potentialEdges[i][0]];
      let v2 = graph.vertices[potentialEdges[i][1]];
      if (getSplitFaceKey(graph, v1, v2) === faceKey) {
        canvas.drawEdge(v1, v2, "blue");
        return false;
      }
    }
  }
  return true;
}

const findChordKey = (graph: PlanarGraph): string | null => {
  let chordKey = null;
  let outerVertices = getBoundaryVertexKeys(graph, graph.infiniteFace);
  outerVertices.forEach(vKey => {
    let edgeKeys = getOutgoingEdgeKeys(graph, vKey);
    edgeKeys.forEach(eKey => {
      let e = graph.edges[eKey];
      if (outerVertices.includes(graph.edges[e.next].origin) && e.incidentFace != graph.infiniteFace) {
        chordKey = eKey;
      }
    });
  });
  return chordKey;
}

const color = (canvas: GraphDrawingWrapper): void => {
  let graph = canvas.graph;
  let chord = findChordKey(graph);
  if (chord) {

  } else {

  }
}
