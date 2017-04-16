import { isClockwise, Vertex } from './vertex'
import { PlanarGraph } from './planar_graph';

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
  graph: PlanarGraph;
  vertices: Array<Vertex>;
  highlightedVertex: Vertex | null;
  radius: number;

  constructor(canvasId : string, radius: number = 10) {
    this.radius = radius;
    this.vertices = [];
    this.canvasEl = (<HTMLCanvasElement>document.getElementById(canvasId));
    this.drawCircle = this.drawCircle.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.canvasEl.addEventListener("click", this.handleClick);
    this.graph = new PlanarGraph();
    this.highlightedVertex = null;
  }

  clickVertex(v: Vertex) {
    if (this.highlightedVertex) {
      if (v !== this.highlightedVertex) {
        this.drawEdge(v, this.highlightedVertex);
      }
      this.unhighlight();
    } else {
      this.highlight(v);
    }
  }

  drawCircle(v: Vertex, strokeColor: string = "black", fillColor: string | null = null) {
    this.vertices.push(v);
    let context = this.canvasEl.getContext('2d');
    context.strokeStyle = strokeColor;
    context.fillStyle = fillColor || "none";
    context.beginPath();
    context.arc(v.x, v.y, this.radius, 0, 2 * Math.PI);
    context.stroke();
    if (fillColor) context.fill();
  }

  drawEdge(v1: Vertex, v2: Vertex, strokeColor: string = "black") {
    if (this.graph.addEdge(v1, v2)) {
      let context = this.canvasEl.getContext('2d');
      let unit = unitVector(v1, v2);
      context.strokeStyle = strokeColor;
      context.beginPath();
      context.moveTo(v1.x - this.radius * unit.x, v1.y - this.radius * unit.y);
      context.lineTo(v2.x + this.radius * unit.x, v2.y + this.radius * unit.y);
      context.stroke();
    }
  }

  handleClick(e : MouseEvent) {
    try {
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
    } catch (err) {
      alert(err.message);
    }
  }

  highlight(v: Vertex) {
    if (this.highlightedVertex) this.unhighlight();
    this.highlightedVertex = v;
    this.drawCircle(v, "red");
  }

  unhighlight() {
    this.drawCircle(this.highlightedVertex);
    this.highlightedVertex = null;
  }
}
