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
  colors?: Array<string>,
  incidentEdge?: HalfEdge;
}

const distance = (v1: Vertex, v2: Vertex) => {
  const s = (x : number) => x * x;
  return Math.sqrt(s(v1.x - v2.x) + s(v1.y - v2.y));
};

const unitVector = (v1: Vertex, v2: Vertex) => {
  const d = distance(v1, v2);
  return <Vertex>{ x: (v1.x - v2.x) / d, y: (v1.y - v2.y) / d };
};

export class GraphDrawingWrapper {
  canvasEl: HTMLCanvasElement;
  vertices: Array<Vertex>;
  highlightedVertex: Vertex | null;
  radius: number;

  constructor(canvasId : string, radius: number = 20) {
    this.radius = radius;
    this.canvasEl = (<HTMLCanvasElement>document.getElementById(canvasId));
    this.drawCircle = this.drawCircle.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.canvasEl.addEventListener("click", this.handleClick);
    this.vertices = [];
    this.highlightedVertex = null;
  }

  clickVertex(v: Vertex) {
    if (this.highlightedVertex) {
      this.drawEdge(v, this.highlightedVertex);
      this.drawCircle(this.highlightedVertex);
      this.highlightedVertex = null;
    } else {
      this.highlightedVertex = v;
      this.drawCircle(v, "red");
    }
  }

  drawCircle(v: Vertex, strokeColor: string = "black", fillColor: string | null = null) {
    let context = this.canvasEl.getContext('2d');
    context.strokeStyle = strokeColor;
    context.fillStyle = fillColor || "none";
    context.beginPath();
    context.arc(v.x, v.y, this.radius, 0, 2 * Math.PI);
    context.stroke();
    if (fillColor) context.fill();
    this.vertices.push(v);
  }

  drawEdge(v1: Vertex, v2: Vertex, strokeColor: string = "black") {
    let context = this.canvasEl.getContext('2d');
    let unit = unitVector(v1, v2);
    context.strokeStyle = strokeColor;
    context.beginPath();
    context.moveTo(v1.x - this.radius * unit.x, v1.y - this.radius * unit.y);
    context.lineTo(v2.x + this.radius * unit.x, v2.y + this.radius * unit.y);
    context.stroke();
  }

  handleClick(e : MouseEvent) {
    let newVertex = <Vertex>{ x : e.x, y : e.y, colors: [] }
    let clickedVertex: Vertex | undefined;
    let overlappingVertex: Vertex | undefined;
    this.vertices.forEach((v : Vertex) => {
      let dist = distance(v, newVertex);
      if (dist <= this.radius) clickedVertex = v;
      if (dist <= 2 * this.radius) overlappingVertex = v;
    });
    if (clickedVertex) {
      this.clickVertex(clickedVertex);
    } else if (!overlappingVertex) {
      this.drawCircle(newVertex);
    }
  }
}
