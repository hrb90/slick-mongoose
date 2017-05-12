import { Coord, eq, angle, getConsecutiveCoordPairs, convexHull, pointSegmentDistance } from './geom';
import { Vertex, HalfEdge, Face, PlanarGraph, Color, ALL_COLORS,
  addEdge, safeAddEdge, removeEdge, removeVertex,
  getBoundaryEdgeKeys, getBoundaryVertexKeys, getOutgoingEdgeKeys,
  getSplitFaceKey, getColors, setColors } from './planar_graph';
import { AnimationType, addStep } from './animation';
import { values, forIn, includes, difference } from 'lodash';

const minDist = (cList: Coord[], ep1: Coord, ep2: Coord): number => {
  let sansEndpoints = cList.filter(v => !(eq(v, ep1) || eq(v, ep2)));
  return Math.min(...sansEndpoints.map(v => pointSegmentDistance(v, ep1, ep2)));
}

const animAddEdge = (g: PlanarGraph, pair: Vertex[]) => {
  addStep(AnimationType.DrawEdge, pair);
  return addEdge(g, pair[0], pair[1]);
}

const hullify = (g: PlanarGraph): PlanarGraph => {
  let hullVertices = convexHull(values(g.vertices));
  hullVertices.map(getConsecutiveCoordPairs).forEach((pair: Vertex[]) => {
    if (safeAddEdge(g, pair[0], pair[1])) {
      g = animAddEdge(g, pair);
    }
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
    g = animAddEdge(g, e);
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

const preColor = (g: PlanarGraph): PlanarGraph => {
  const boundingVertices = getBoundaryVertexKeys(g, g.infiniteFace);
  g.mark1 = boundingVertices[0];
  g.mark2 = boundingVertices[1];
  g = updateColors(g, g.mark1, [Color.Red]);
  g = updateColors(g, g.mark2, [Color.Blue]);
  boundingVertices.slice(2).forEach(vKey =>
    g = updateColors(g, vKey, getColors(g, vKey).slice(0, 3)))
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

const updateColors = (g: PlanarGraph, vKey: string, colors: Color[]) => {
  addStep(AnimationType.UpdateColors, { vertex: g.vertices[vKey], colors });
  return setColors(g, vKey, colors);
}

const colorTriangle = (g: PlanarGraph): PlanarGraph => {
  let badColors = [getColors(g, g.mark1)[0], getColors(g, g.mark2)[0]]
  let thirdVertexKey = difference(Object.keys(g.vertices), [g.mark1, g.mark2])[0];
  let okayColor = difference(getColors(g, thirdVertexKey), badColors)[0];
  return updateColors(g, thirdVertexKey, [okayColor]);
}

const colorChordlessGraph = (g: PlanarGraph): PlanarGraph => {
  let boundaryVertices = getBoundaryVertexKeys(g, g.infiniteFace);

  return g;
}

const color = (g: PlanarGraph): PlanarGraph => {
  if (values(g.vertices).length == 3) {
    return colorTriangle(g);
  } else {
    let chord = findChordKey(g);
    if (chord) {
      return g;
    } else {
      return colorChordlessGraph(g);
    }
  }
}

export const fiveColor = (graph: PlanarGraph): PlanarGraph =>
  color(preColor(triangulate(hullify(graph))))
