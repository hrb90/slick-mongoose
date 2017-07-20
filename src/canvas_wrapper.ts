import { Coord, isClockwise, distance, unitVector, eq } from "./geom";
import {
  PlanarGraph,
  Color,
  ALL_COLORS,
  createEmptyPlanarGraph,
  addEdge,
  setColors,
  getEndpoints,
  getVertexKey
} from "./planar_graph";
import { values, difference, includes } from "lodash";

const colorToString = (c: Color, faded: boolean) => {
  switch (c) {
    case Color.Red:
      return faded ? "#ff8080" : "red";
    case Color.Blue:
      return faded ? "#8080ff" : "blue";
    case Color.Green:
      return faded ? "#80ff80" : "green";
    case Color.Orange:
      return faded ? "#ffe080" : "orange";
    case Color.Yellow:
      return faded ? "#ffff80" : "yellow";
  }
};

export class GraphDrawingWrapper {
  canvasEl: HTMLCanvasElement;
  graph: PlanarGraph;
  vertices: Array<Coord>;
  highlightedVertex: Coord | null;
  highlightedGraph: PlanarGraph;
  radius: number;

  constructor(canvasId: string, radius: number = 15) {
    this.radius = radius;
    this.vertices = [];
    this.canvasEl = <HTMLCanvasElement>document.getElementById(canvasId);
    this.drawCircle = this.drawCircle.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.canvasEl.addEventListener("click", this.handleClick);
    this.graph = createEmptyPlanarGraph();
    this.highlightedGraph = this.graph;
    this.highlightedVertex = null;
  }

  clear() {
    let context = this.canvasEl.getContext("2d");
    context.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
  }

  clickVertex(v: Coord) {
    if (this.highlightedVertex) {
      if (v !== this.highlightedVertex) {
        this.drawEdge(v, this.highlightedVertex);
      }
      this.unhighlightVertex();
    } else {
      this.highlightVertex(v);
    }
  }

  doesAddEdge(v1: Coord, v2: Coord) {
    try {
      this.graph = addEdge(this.graph, v1, v2);
      this.highlightedGraph = this.graph;
      return true;
    } catch (e) {
      return false;
    }
  }

  drawCircle(
    v: Coord,
    faded: boolean = false,
    fillColors: Color[] = ALL_COLORS
  ) {
    this.vertices.push(v);
    let context = this.canvasEl.getContext("2d");
    context.strokeStyle =
      v === this.highlightedVertex ? "red" : faded ? "lightgrey" : "black";
    context.fillStyle = "none";
    context.beginPath();
    context.arc(v.x, v.y, this.radius, 0, 2 * Math.PI);
    context.stroke();
    if (fillColors.length > 0) {
      this.fillCircle(v, faded, fillColors);
    }
  }

  drawEdge(v1: Coord, v2: Coord, strokeColor: string = "black") {
    if (this.doesAddEdge(v1, v2)) this.unsafeDrawEdge(v1, v2, strokeColor);
  }

  fillCircle(v: Coord, faded: boolean, fillColors: Color[]) {
    let n = fillColors.length;
    fillColors.forEach((color, idx) => {
      let context = this.canvasEl.getContext("2d");
      context.fillStyle = colorToString(color, faded);
      context.beginPath();
      context.arc(
        v.x,
        v.y,
        this.radius,
        2 * idx * Math.PI / n,
        2 * (idx + 1) * Math.PI / n
      );
      context.lineTo(v.x, v.y);
      context.closePath();
      context.fill();
    });
  }

  handleClick(e: MouseEvent) {
    try {
      let newVertex = <Coord>{ x: e.x, y: e.y, colors: [] };
      let clickedVertex: Coord | undefined;
      let overlappingVertex: Coord | undefined;
      this.vertices.forEach(v => {
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

  highlightGraph(g: PlanarGraph) {
    this.highlightedGraph = g;
  }

  highlightVertex(v: Coord) {
    if (this.highlightedVertex) {
      this.unhighlightVertex();
    } else {
      this.highlightedVertex = v;
    }
  }

  redraw() {
    this.clear();
    let strongVertexKeys = Object.keys(this.highlightedGraph.vertices);
    let fadedVertexKeys = difference(
      Object.keys(this.graph.vertices),
      strongVertexKeys
    );
    let g = this.graph;
    strongVertexKeys.forEach(vKey => {
      let v = g.vertices[vKey];
      this.drawCircle(v, false, v.colors);
    });
    fadedVertexKeys.forEach(vKey => {
      let v = g.vertices[vKey];
      this.drawCircle(v, true, v.colors);
    });

    Object.keys(g.edges).forEach(e => {
      let [v1, v2] = getEndpoints(g, e);
      let edgeColor: string;
      edgeColor =
        includes(strongVertexKeys, v1) && includes(strongVertexKeys, v2)
          ? "black"
          : "lightgrey";
      this.unsafeDrawEdge(g.vertices[v1], g.vertices[v2], edgeColor);
    });
    this.graph = g;
  }

  unhighlightVertex() {
    this.highlightedVertex = null;
  }

  unsafeDrawEdge(v1: Coord, v2: Coord, strokeColor: string) {
    let context = this.canvasEl.getContext("2d");
    let unit = unitVector(v1, v2);
    context.strokeStyle = strokeColor;
    context.beginPath();
    context.moveTo(v1.x - this.radius * unit.x, v1.y - this.radius * unit.y);
    context.lineTo(v2.x + this.radius * unit.x, v2.y + this.radius * unit.y);
    context.stroke();
  }

  updateColors(v: Coord, colors: Color[]) {
    let vKey = getVertexKey(this.graph, v);
    this.graph = setColors(this.graph, vKey, colors);
    this.highlightVertex(v);
    this.redraw();
  }
}
