interface Face {
  incidentEdge: HalfEdge;
}

interface HalfEdge {
  origin: Vertex;
  twin: HalfEdge | undefined;
  next: HalfEdge | undefined;
  prev: HalfEdge | undefined;
  incidentFace: Face | undefined;
}

interface Vertex {
  x: number,
  y: number,
  colors: Array<string>,
  incidentEdge: HalfEdge | undefined;
}

const distance = (v1: Vertex, v2: Vertex) => {
  const s = (x : number) => x * x;
  return Math.sqrt(s(v1.x - v2.x) + s(v1.y - v2.y));
};

export class GraphDrawingWrapper {
  canvasEl: HTMLCanvasElement;
  vertices: Array<Vertex>;

  constructor(canvasId : string) {
    this.canvasEl = (<HTMLCanvasElement>document.getElementById(canvasId));
    this.drawCircle = this.drawCircle.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.canvasEl.addEventListener("click", this.handleClick);
    this.vertices = [];
  }

  clickVertex(v: Vertex) {
    console.log(v);
  }

  drawCircle(v: Vertex) {
    let context = this.canvasEl.getContext('2d');
    context.beginPath();
    context.arc(v.x, v.y, 20, 0, 2 * Math.PI);
    context.stroke();
    this.vertices.push(v);
  }

  handleClick(e : MouseEvent) {
    let newVertex = <Vertex>{ x : e.x, y : e.y, colors: [] }
    let clickedVertex: Vertex | undefined;
    let overlappingVertex: Vertex | undefined;
    this.vertices.forEach((v : Vertex) => {
      let dist = distance(v, newVertex);
      if (dist < 20) clickedVertex = v;
      if (dist < 40) overlappingVertex = v;
    });
    if (clickedVertex) {
      this.clickVertex(clickedVertex);
    } else if (!overlappingVertex) {
      this.drawCircle(newVertex);
    }
  }
}
