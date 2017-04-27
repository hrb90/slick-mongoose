import { isClockwise, Coord } from './geom'
import { PlanarGraph, createEmptyPlanarGraph, addEdge } from './planar_graph';

const distance = (v1: Coord, v2: Coord) => {
  const s = (x : number) => x * x;
  return Math.sqrt(s(v1.x - v2.x) + s(v1.y - v2.y));
};

const unitVector = (v1: Coord, v2: Coord) => {
  const d = distance(v1, v2);
  return <Coord>{ x: (v1.x - v2.x) / d, y: (v1.y - v2.y) / d };
};

export class GraphDrawingWrapper {
  canvasEl: HTMLCanvasElement;
  graph: PlanarGraph;
  vertices: Array<Coord>;
  highlightedVertex: Coord | null;
  radius: number;

  constructor(canvasId : string, radius: number = 10) {
    this.radius = radius;
    this.vertices = [];
    this.canvasEl = (<HTMLCanvasElement>document.getElementById(canvasId));
    this.drawCircle = this.drawCircle.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.canvasEl.addEventListener("click", this.handleClick);
    this.graph = createEmptyPlanarGraph();
    window.graphLog = "";
    this.highlightedVertex = null;
  }

  clickVertex(v: Coord) {
    if (this.highlightedVertex) {
      if (v !== this.highlightedVertex) {
        this.drawEdge(v, this.highlightedVertex);
      }
      this.unhighlight();
    } else {
      this.highlight(v);
    }
  }

  doesAddEdge(v1: Coord, v2: Coord) {
    try {
      this.graph = addEdge(this.graph, v1, v2);
      return true;
    } catch (e) {
      return false;
    }
  }

  drawCircle(v: Coord, strokeColor: string = "black", fillColor: string | null = null) {
    this.vertices.push(v);
    let context = this.canvasEl.getContext('2d');
    context.strokeStyle = strokeColor;
    context.fillStyle = fillColor || "none";
    context.beginPath();
    context.arc(v.x, v.y, this.radius, 0, 2 * Math.PI);
    context.stroke();
    if (fillColor) context.fill();
  }

  drawEdge(v1: Coord, v2: Coord, strokeColor: string = "black") {
    if (this.doesAddEdge(v1, v2)) {
      window.graphLog = window.graphLog.concat(`${v1.x},${v1.y},${v2.x},${v2.y};`);
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
      let newVertex = <Coord>{ x : e.x, y : e.y, colors: [] }
      let clickedVertex: Coord | undefined;
      let overlappingVertex: Coord | undefined;
      this.vertices.forEach((v : Coord) => {
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

  highlight(v: Coord) {
    if (this.highlightedVertex) this.unhighlight();
    this.highlightedVertex = v;
    this.drawCircle(v, "red");
  }

  unhighlight() {
    this.drawCircle(this.highlightedVertex);
    this.highlightedVertex = null;
  }
}
