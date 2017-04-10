interface Face {
  incidentEdge: HalfEdge;
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

export class PlanarGraph {
  vertices: Array<Vertex>;
  edges: Array<HalfEdge>;
  faces: Array<Face>;

  constructor () {
    this.vertices = [];
    this.edges = [];
    this.faces = [];
  }

  addVertex (v: Vertex) {
    this.vertices.push(v);
  }

  addEdge(v1: Vertex, v2: Vertex) {
    return true;
  }
}
