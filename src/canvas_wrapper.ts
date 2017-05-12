import { Coord, isClockwise, distance, unitVector } from './geom'
import { PlanarGraph, Color, ALL_COLORS, createEmptyPlanarGraph, addEdge } from './planar_graph';

const colorToString = (c: Color) => {
  switch(c) {
    case Color.Red:
      return "red"
    case Color.Blue:
      return "blue"
    case Color.Green:
      return "green"
    case Color.Orange:
      return "orange"
    case Color.Yellow:
      return "yellow"
  }
}

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

  drawCircle(v: Coord, strokeColor: string = "black", fillColors: Color[] = ALL_COLORS) {
    this.vertices.push(v);
    let context = this.canvasEl.getContext('2d');
    context.strokeStyle = strokeColor;
    context.fillStyle = "none";
    context.beginPath();
    context.arc(v.x, v.y, this.radius, 0, 2 * Math.PI);
    context.stroke();
    if (fillColors.length > 0) {
      this.fillCircle(v, fillColors);
    }
  }

  drawEdge(v1: Coord, v2: Coord, strokeColor: string = "black") {
    if (this.doesAddEdge(v1, v2)) {
      let context = this.canvasEl.getContext('2d');
      let unit = unitVector(v1, v2);
      context.strokeStyle = strokeColor;
      context.beginPath();
      context.moveTo(v1.x - this.radius * unit.x, v1.y - this.radius * unit.y);
      context.lineTo(v2.x + this.radius * unit.x, v2.y + this.radius * unit.y);
      context.stroke();
    }
  }

  fillCircle(v: Coord, fillColors: Color[]) {
    let n = fillColors.length;
    fillColors.forEach((color, idx) => {
      let context = this.canvasEl.getContext('2d');
      context.fillStyle = colorToString(color);
      context.beginPath();
      context.arc(v.x, v.y, this.radius, 2 * idx * Math.PI / n,
        2 * (idx + 1) * Math.PI / n);
      context.lineTo(v.x, v.y);
      context.closePath();
      context.fill();
    })
  }

  handleClick(e : MouseEvent) {
    try {
      let newVertex = <Coord>{ x : e.x, y : e.y, colors: [] }
      let clickedVertex: Coord | undefined;
      let overlappingVertex: Coord | undefined;
      this.vertices.forEach((v) => {
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
