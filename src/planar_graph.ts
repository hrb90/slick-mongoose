import { Vertex, HalfEdge, Face, eq, intersect, inInterior, isClockwise, angle } from './vertex';
import { intersection, uniq } from 'lodash';

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
    this.begin = this.begin.bind(this);
    this.commonFaces = this.commonFaces.bind(this);
    this.getBoundaryEdges = this.getBoundaryEdges.bind(this);
    this.getBoundaryVertices = this.getBoundaryVertices.bind(this);
    this.getBoundingFace = this.getBoundingFace.bind(this);
    this.getIncidentFaces = this.getIncidentFaces.bind(this);
    this.getOutgoingEdges = this.getOutgoingEdges.bind(this);
  }

  addEdge(v1: Vertex, v2: Vertex) {
    if (!v1.incidentEdge && !v2.incidentEdge) {
      if (this.vertices.length > 0) throw new Error("Only one connected component!");
      this.begin(v1, v2);
      return true;
    } else if (!v1.incidentEdge && v2.incidentEdge) {
      return this.connectNewVertex(v2, v1);
    } else if (!v2.incidentEdge && v1.incidentEdge) {
      return this.connectNewVertex(v1, v2);
    } else {
      return this.connectVertices(v1, v2);
    }
  }

  begin(v1: Vertex, v2: Vertex) {
    this.vertices = [v1, v2];
    let v1v2: HalfEdge = { origin: v1, incidentFace: this.infiniteFace };
    let v2v1: HalfEdge = { origin: v2, prev: v1v2, next: v1v2, twin: v1v2, incidentFace: this.infiniteFace};
    v1.incidentEdge = v1v2;
    v2.incidentEdge = v2v1;
    v1v2.twin = v2v1;
    v1v2.prev = v2v1;
    v1v2.next = v2v1;
    this.edges = [v1v2, v2v1];
    this.infiniteFace.incidentEdge = v1v2;
  }

  connectNewVertex(oldVertex: Vertex, newVertex: Vertex) {
    if (newVertex.incidentEdge) throw new Error("Can't connect this vertex!");
    let boundingFace: Face | null = this.getEdgeFace(oldVertex, newVertex);
    if (boundingFace) {
      this.vertices.push(newVertex);
      let oldOutEdge = this.getNextClockwiseEdge(oldVertex, angle(oldVertex, newVertex));
      let oldInEdge = oldOutEdge.prev;
      let oldNew: HalfEdge = { origin: oldVertex, prev: oldInEdge, incidentFace: boundingFace };
      let newOld: HalfEdge = { origin: newVertex, twin: oldNew, prev: oldNew, next: oldOutEdge, incidentFace: boundingFace };
      this.edges.push(oldNew);
      this.edges.push(newOld);
      oldNew.twin = newOld;
      oldNew.next = newOld;
      oldOutEdge.prev = newOld;
      oldInEdge.next = oldNew;
      newVertex.incidentEdge = newOld;
      return true;
    } else {
      return false;
    }
  }

  connectVertices(v1: Vertex, v2: Vertex) {
    let boundingFace: Face | null = this.getEdgeFace(v1, v2);
    if (boundingFace) {
      // 1. Fix the edge pointers to other edges
      let newEdge = this.cv_edgePointers(v1, v2, boundingFace);
      // 2. Split the face
      this.cv_makeNewFace(newEdge, boundingFace);
      return true;
    } else {
      return false;
    }
  }

  cv_makeNewFace(e: HalfEdge, f: Face) {
    let newFaceEdge: HalfEdge = e;
    if (f.infinite) {
      let vertices = [e.twin.origin];
      let currentEdge = e.twin.next;
      while (currentEdge !== e.twin) {
        vertices.push(currentEdge.origin);
        currentEdge = currentEdge.next;
      }
      if (!isClockwise(vertices)) {
        newFaceEdge = e.twin;
      }
    }
    f.incidentEdge = newFaceEdge.twin;
    let newFace: Face = { infinite: false, incidentEdge: newFaceEdge };
    this.faces.push(newFace);
    // Fix incidentFace pointers
    newFaceEdge.twin.incidentFace = f;
    newFaceEdge.incidentFace = newFace;
    let currentEdge = newFaceEdge.next;
    while (currentEdge !== newFaceEdge) {
      currentEdge.incidentFace = newFace;
      currentEdge = currentEdge.next;
    }
  }

  cv_edgePointers(v1: Vertex, v2: Vertex, boundingFace: Face) {
    let angle1 = angle(v1, v2);
    let angle2 = angle(v2, v1);
    let e1 = this.getNextClockwiseEdge(v1, angle1);
    let e2 = this.getNextClockwiseEdge(v2, angle2);
    let v1v2: HalfEdge = { origin: v1, next: e2, prev: e1.prev };
    let v2v1: HalfEdge = { origin: v2, next: e1, prev: e2.prev, twin: v1v2};
    v1v2.twin = v2v1;
    e1.prev.next = v1v2;
    e1.prev = v2v1;
    e2.prev.next = v2v1;
    e2.prev = v1v2;
    this.edges.push(v1v2);
    this.edges.push(v2v1);
    return v1v2;
  }

  getEdgeFace(v1: Vertex, v2: Vertex) {
    let midpoint = { x: (v1.x + v2.x)/2, y: (v1.y + v2.y)/2 };
    let possFace = this.getBoundingFace(midpoint);
    if (this.commonFaces(v1, v2).indexOf(possFace) > -1) {
      return this.getBoundaryEdges(possFace).every(e => (
        !intersect(v1, v2, e.origin, e.next.origin)
      )) ? possFace : null;
    } else {
      return null;
    }
  }

  commonFaces(v1: Vertex, v2: Vertex) {
    return intersection(...[v1, v2].map(this.getIncidentFaces));
  }

  getBoundaryEdges(f: Face) {
    let boundaryEdges = <Array<HalfEdge>>[];
    if (f.incidentEdge) {
      let currentEdge = f.incidentEdge;
      while (boundaryEdges.indexOf(currentEdge) === -1) {
        boundaryEdges.push(currentEdge);
        currentEdge = currentEdge.next;
      }
    }
    return boundaryEdges;
  }

  getBoundaryVertices(f: Face) {
    return this.getBoundaryEdges(f).map(e => e.origin);
  }

  getBoundingFace(v: Vertex) {
    let boundingFace = this.infiniteFace;
    this.faces.forEach((f: Face) => {
      if (!f.infinite &&
        inInterior(this.getBoundaryVertices(f), v)) {
          boundingFace = f;
        }
      });
    return boundingFace;
  }

  getIncidentFaces(v: Vertex) {
    return v.incidentEdge ?
      uniq(this.getOutgoingEdges(v).map((e: HalfEdge) => e.incidentFace)) :
      [this.getBoundingFace(v)];
  }

  getNextClockwiseEdge(v: Vertex, newAngle: number): HalfEdge {
    let highest: [HalfEdge | null, number] = [null, -Infinity];
    let nextAngle: [HalfEdge | null, number] = [null, -Infinity];
    this.getOutgoingEdges(v).forEach((e: HalfEdge) => {
      let currentAngle = angle(e.origin, e.next.origin);
      if ((currentAngle < newAngle) && (currentAngle > nextAngle[1])) {
        nextAngle = [e, currentAngle];
      }
      if (currentAngle > highest[1]) {
        highest = [e, currentAngle];
      }
    });
    if (nextAngle[0]) {
      return nextAngle[0];
    } else{
      return highest[0];
    }
  }

  getOutgoingEdges(v: Vertex) {
    let incidentEdges = <Array<HalfEdge>>[];
    if (v.incidentEdge) {
      let currentEdge = v.incidentEdge;
      while (incidentEdges.indexOf(currentEdge) === -1) {
        incidentEdges.push(currentEdge);
        currentEdge = currentEdge.twin.next;
      }
    }
    return incidentEdges;
  }

}
