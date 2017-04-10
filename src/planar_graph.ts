interface Face {
  infinite: boolean;
  incidentEdge?: HalfEdge;
}

interface HalfEdge {
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

// Do the line segments from v1-v2 and v3-v4 intersect?
const intersect = (v1: Vertex, v2: Vertex, v3: Vertex, v4: Vertex) => {
  return true;
}

// Is v in the interior of polygon?
const inInterior = (polygon: Array<Vertex>, v: Vertex) => {
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
  }

  addVertex (v: Vertex) {
    this.vertices.push(v);
  }

  addEdge(v1: Vertex, v2: Vertex) {
    return true;
  }

  checkEdge(v1: Vertex, v2: Vertex) {

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

  getIncidentFaces(v: Vertex) {
    let incidentFaces = <Array<Face>>[];
    if (v.incidentEdge) {
      let currentEdge = v.incidentEdge;
      while (!incidentFaces.indexOf(currentEdge.incidentFace)) {
        incidentFaces.push(currentEdge.incidentFace);
        currentEdge = currentEdge.twin.next;
      }
    } else {
      let boundingFace: Face | undefined;
      this.faces.forEach((f: Face) => {
        if (!f.infinite &&
          inInterior(this.getBoundaryEdges(f).map(e => e.origin), v)) {
            boundingFace = f;
          }
      });
      boundingFace = boundingFace || this.infiniteFace;
      incidentFaces.push(boundingFace);
    }
    return incidentFaces;
  }
}
