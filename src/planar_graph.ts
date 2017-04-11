import _ from 'lodash';

export interface Face {
  infinite: boolean;
  incidentEdge?: HalfEdge;
}

export interface HalfEdge {
  origin: Vertex;
  twin?: HalfEdge;
  // next is the next half edge traveling along the face
  // prev is the previous half edge traveling along the face
  next?: HalfEdge;
  prev?: HalfEdge;
  incidentFace?: Face;
}

export interface Vertex {
  x: number,
  y: number,
  colors?: Array<string>,
  incidentEdge?: HalfEdge;
}

// coordinate equality
let eq = (a: Vertex, b: Vertex) => (a.x === b.x && a.y === b.y);

// 2-dimensional cross product
const xProd = (v1: Vertex, v2: Vertex) => (v1.x * v2.y - v1.y * v2.x);

// dot product
const dot = (v1: Vertex, v2: Vertex) => (v1.x * v2.x + v1.y + v2.y);

// Do the line segments from v1-v2 and v3-v4 intersect?
export const intersect = (v1: Vertex, v2: Vertex, v3: Vertex, v4: Vertex) => {
  let r = { x: v2.x - v1.x, y: v2.y - v1.y };
  let s = { x: v4.x - v3.x, y: v4.y - v3.y };
  let diff = { x: v3.x - v1.x, y: v3.y - v1.y };
  let det = xProd(r, s);
  if (det !== 0) {
    let t = xProd(diff, r)/det;
    let u = xProd(diff, s)/det;
    let interior = (x: number) => (0 < x && x < 1);
    let boundary = (x: number) => (x === 0 || x === 1);
    if (interior(t) && interior(u)) {
      // the segments intersect
      return true;
    } else if (boundary(t) || boundary(u)) {
      // three points are collinear
      return (interior(t) || interior(u));
    } else {
      return false;
    }
  } else {
    if (xProd(diff, r) !== 0) {
      // parallel, non-collinear
      return false;
    } else {
      // all 4 points collinear
      let t0 = dot(diff, r)/dot(r, r);
      let t1 = t0 + dot(s, r)/dot(r, r);
      return (Math.max(t0, t1) > 0 && Math.min(t0, t1) < 1);
    }
  }
}

// Is v in the interior of polygon?
export const inInterior = (polygon: Array<Vertex>, v: Vertex) => {
  return true;
}

export class PlanarGraph {
  vertices: Array<Vertex>;
  edges: Array<HalfEdge>;
  infiniteFace: Face;
  faces: Array<Face>;

  constructor () {
    this.vertices = [];
    this.edges = [];
    this.infiniteFace = { infinite: true };
    this.faces = [this.infiniteFace];
    // bind methods
    this.addEdge = this.addEdge.bind(this);
    this.addVertex = this.addVertex.bind(this);
    this.commonFaces = this.commonFaces.bind(this);
    this.getBoundaryEdges = this.getBoundaryEdges.bind(this);
    this.getBoundingFace = this.getBoundingFace.bind(this);
    this.getIncidentFaces = this.getIncidentFaces.bind(this);
    this.getOutgoingEdges = this.getOutgoingEdges.bind(this);
  }

  addVertex (v: Vertex) {
    this.vertices.push(v);
  }

  addEdge(v1: Vertex, v2: Vertex) {
    return true;
  }

  commonFaces(v1: Vertex, v2: Vertex) {
    return <Array<Face>>_.intersection([v1, v2].map(this.getIncidentFaces));
  }

  getBoundaryEdges(f: Face) {
    let boundaryEdges = <Array<HalfEdge>>[];
    if (f.incidentEdge) {
      let currentEdge = f.incidentEdge;
      while (!boundaryEdges.indexOf(currentEdge)) {
        boundaryEdges.push(currentEdge);
        currentEdge = currentEdge.next;
      }
    }
    return boundaryEdges;
  }

  getBoundingFace(v: Vertex) {
    let boundingFace = this.infiniteFace;
    this.faces.forEach((f: Face) => {
      if (!f.infinite &&
        inInterior(this.getBoundaryEdges(f).map(e => e.origin), v)) {
          boundingFace = f;
        }
      });
    return boundingFace;
  }

  getIncidentFaces(v: Vertex) {
    return v.incidentEdge ?
    this.getOutgoingEdges(v).map((e: HalfEdge) => e.incidentFace) :
    [this.getBoundingFace(v)];
  }

  getOutgoingEdges(v: Vertex) {
    let incidentEdges = <Array<HalfEdge>>[];
    if (v.incidentEdge) {
      let currentEdge = v.incidentEdge;
      while (!incidentEdges.indexOf(currentEdge)) {
        incidentEdges.push(currentEdge);
        currentEdge = currentEdge.twin.next;
      }
    }
    return incidentEdges;
  }

}
