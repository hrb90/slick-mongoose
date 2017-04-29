import { Coord, eq, angle, getConsecutiveCoordPairs, convexHull, pointSegmentDistance } from './geom';
import { Vertex, HalfEdge, Face, PlanarGraph,
  addEdge, safeAddEdge, removeEdge, removeVertex,
  getBoundaryEdgeKeys, getBoundaryVertexKeys, getOutgoingEdgeKeys, getSplitFaceKey } from './planar_graph';
import { GraphDrawingWrapper } from './canvas_wrapper';
import { values, forIn } from 'lodash';

const PAUSE = 500;

interface Animation {
  type: string,
  data: any
}

export const animate = (canvas: GraphDrawingWrapper): void => {
  let animations = makeAnimation(canvas.graph);
  animations.forEach(a => {
    if (a.type === "DRAW_EDGE") {
      canvas.drawEdge(a.data[0], a.data[1], "blue");
    }
  })
};

const minDist = (cList: Coord[], ep1: Coord, ep2: Coord): number => {
  let sansEndpoints = cList.filter(v => !(eq(v, ep1) && eq(v, ep2)));
  return Math.min(...sansEndpoints.map(v => pointSegmentDistance(v, ep1, ep2)));
}

const getBestSplittingEdge = (g: PlanarGraph, edgeKeys: string[], faceKey: string): Vertex[] => {
  let leastDist = Infinity;
  let bestPair = [] as Vertex[];
  let potentialEdges: string[][] = edgeKeys.map(eKey =>
    [g.edges[eKey].origin, g.edges[g.edges[g.edges[eKey].next].next].origin]);
  let faceVertices = edgeKeys.map(eKey => g.vertices[g.edges[eKey].origin])
  for (let i = 0; i < potentialEdges.length; i++) {
    let v1 = g.vertices[potentialEdges[i][0]];
    let v2 = g.vertices[potentialEdges[i][1]];
    if (getSplitFaceKey(g, v1, v2) === faceKey) {
      let dist = minDist(faceVertices, v1, v2);
      if (dist < leastDist) {
        leastDist = dist;
        bestPair = [v1, v2]
      }
    }
  }
  return bestPair;
}

const makeAnimation = (graph: PlanarGraph): any[] => {
  if (values(graph.vertices).length < 3) {
    alert("please connect more vertices");
  } else {
    let animations: Animation[] = [];

    const hullify = (g: PlanarGraph): PlanarGraph => {
      let hullVertices = convexHull(values(g.vertices));
      hullVertices.map(getConsecutiveCoordPairs).forEach((pair: Vertex[]) => {
        if (safeAddEdge(g, pair[0], pair[1])) {
          animations.push({
            type: "DRAW_EDGE",
            data: pair
          })
          g = addEdge(g, pair[0], pair[1]);
        }
      });
      return g;
    }

    const splitFace = (g: PlanarGraph, faceKey: string): PlanarGraph => {
      let edges = getBoundaryEdgeKeys(g, faceKey);
      if (edges.length > 3 && g.infiniteFace !== faceKey) {
        let e = getBestSplittingEdge(g, edges, faceKey);
        animations.push({
          type: "DRAW_EDGE",
          data: e
        })
        g = addEdge(g, e[0], e[1]);
      }
      return g;
    }

    const triangulate = (g: PlanarGraph): PlanarGraph => {
      while (!isTriangulated(g)) {
        forIn(g.faces, (f: Face, fKey: string) => {
          if (getBoundaryEdgeKeys(g, fKey).length > 3) {
            g = splitFace(g, fKey)
          }
        });
      }
      return g;
    }

    const color = (g: PlanarGraph): PlanarGraph => {
      let chord = findChordKey(g);
      if (chord) {

      } else {

      }
      return g;
    }

    window.graphLog = window.graphLog.concat("beginHullify;");
    graph = hullify(graph);
    window.graphLog = window.graphLog.concat("beginTriangulate;");
    graph = triangulate(graph);
    window.graphLog = window.graphLog.concat("endTrianguate;");
    graph = color(graph);
    return animations;
  }
}

const isTriangulated = (g: PlanarGraph): boolean => {
  return Object.keys(g.faces).every(fKey =>
    (g.infiniteFace === fKey || getBoundaryEdgeKeys(g, fKey).length === 3));
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
