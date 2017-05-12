import { Coord, eq, angle, getConsecutiveCoordPairs, convexHull, pointSegmentDistance } from './geom';
import { Vertex, HalfEdge, Face, PlanarGraph,
  addEdge, safeAddEdge, removeEdge, removeVertex,
  getBoundaryEdgeKeys, getBoundaryVertexKeys, getOutgoingEdgeKeys, getSplitFaceKey } from './planar_graph';
import { values, forIn, includes } from 'lodash';

const minDist = (cList: Coord[], ep1: Coord, ep2: Coord): number => {
  let sansEndpoints = cList.filter(v => !(eq(v, ep1) || eq(v, ep2)));
  return Math.min(...sansEndpoints.map(v => pointSegmentDistance(v, ep1, ep2)));
}

const hullify = (g: PlanarGraph): PlanarGraph => {
  let hullVertices = convexHull(values(g.vertices));
  hullVertices.map(getConsecutiveCoordPairs).forEach((pair: Vertex[]) => {
    g = addEdge(g, pair[0], pair[1]);
  });
  return g;
}

const getBestSplittingEdge = (g: PlanarGraph, edgeKeys: string[], faceKey: string): Vertex[] => {
  let mostDist = -1;
  let bestPair = [] as Vertex[];
  let potentialEdges: string[][] = edgeKeys.map(eKey =>
    [g.edges[eKey].origin, g.edges[g.edges[g.edges[eKey].next].next].origin]);
  let faceVertices = edgeKeys.map(eKey => g.vertices[g.edges[eKey].origin])
  for (let i = 0; i < potentialEdges.length; i++) {
    let v1 = g.vertices[potentialEdges[i][0]];
    let v2 = g.vertices[potentialEdges[i][1]];
    if (getSplitFaceKey(g, v1, v2) === faceKey) {
      let dist = minDist(faceVertices, v1, v2);
      if (dist > mostDist) {
        mostDist = dist;
        bestPair = [v1, v2]
      }
    }
  }
  return bestPair;
}

const splitFace = (g: PlanarGraph, faceKey: string): PlanarGraph => {
  let edges = getBoundaryEdgeKeys(g, faceKey);
  if (edges.length > 3 && g.infiniteFace !== faceKey) {
    let e = getBestSplittingEdge(g, edges, faceKey);
    g = addEdge(g, e[0], e[1]);
  }
  return g;
}

const isTriangulated = (g: PlanarGraph): boolean => {
  return Object.keys(g.faces).every(fKey =>
    (g.infiniteFace === fKey || getBoundaryEdgeKeys(g, fKey).length === 3));
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

const findChordKey = (graph: PlanarGraph): string | null => {
  let chordKey = null;
  let outerVertices = getBoundaryVertexKeys(graph, graph.infiniteFace);
  outerVertices.forEach(vKey => {
    let edgeKeys = getOutgoingEdgeKeys(graph, vKey);
    edgeKeys.forEach(eKey => {
      let e = graph.edges[eKey];
      if (includes(outerVertices, graph.edges[e.next].origin) && e.incidentFace != graph.infiniteFace) {
        chordKey = eKey;
      }
    });
  });
  return chordKey;
}

const color = (g: PlanarGraph): PlanarGraph => {
  let chord = findChordKey(g);
  if (chord) {

  } else {

  }
  return g;
}

export const fiveColor = (graph: PlanarGraph): PlanarGraph =>
  color(triangulate(hullify(graph)))
