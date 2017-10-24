import { Coord, distance, unitVector, eq } from "./geom";
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
import { difference } from "./util";

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
  highlightedEdge: [Coord, Coord] | null;
  highlightedGraph: PlanarGraph;
  radius: number;
  frozen: boolean;

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
    this.highlightedEdge = null;
    this.frozen = false;
  }

  clear() {
    let context = this.canvasEl.getContext("2d");
    context.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
  }

  darken() {
    this.canvasEl.className = "greyer-canvas";
  }

  clickVertex(v: Coord) {
    if (this.highlightedVertex) {
      if (v !== this.highlightedVertex) {
        this.drawEdge(v, this.highlightedVertex);
      }
      let highlit = this.highlightedVertex;
      this.unhighlightVertex();
      this.drawCircle(highlit);
    } else {
      this.highlightVertex(v);
    }
    this.drawCircle(v);
  }

  doesAddEdge(v1: Coord, v2: Coord) {
    try {
      this.graph = addEdge(this.graph, v1, v2);
      this.highlightedGraph = this.graph;
      return true;
    } catch (e) {
      if (e === "KeepGraphConnected") {
        alert("Please keep the graph connected");
      }
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
    context.strokeStyle = faded ? "lightgrey" : "black";
    context.lineWidth = 2;
    if (this.highlightedVertex && eq(v, this.highlightedVertex)) {
      context.strokeStyle = "red";
    }
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

  freeze() {
    this.frozen = true;
  }

  handleClick(e: MouseEvent) {
    if (!this.frozen) {
      try {
        let newVertex = this.translateEventToCoord(e);
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
  }

  highlightEdge(v1: Coord, v2: Coord) {
    this.highlightedEdge = [v1, v2];
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

  isHighlightedEdge(v1: Coord, v2: Coord) {
    if (this.highlightedEdge === null) return false;
    const h1 = this.highlightedEdge[0];
    const h2 = this.highlightedEdge[1];
    console.log("checking for highlight", h1, v1, h2, v2);
    return (eq(h1, v1) && eq(h2, v2)) || (eq(h1, v2) && eq(h2, v1));
  }

  lighten() {
    this.canvasEl.className = "";
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
        strongVertexKeys.includes(v1) && strongVertexKeys.includes(v2)
          ? "black"
          : "lightgrey";
      if (this.isHighlightedEdge(g.vertices[v1], g.vertices[v2])) {
        console.log("found highlighted edge");
        edgeColor = "red";
      }
      this.unsafeDrawEdge(g.vertices[v1], g.vertices[v2], edgeColor);
    });
    this.graph = g;
  }

  translateEventToCoord(e: MouseEvent): Coord {
    console.log(this.canvasEl.offsetTop);
    console.log(this.canvasEl.offsetLeft);
    return {
      x: e.x - this.canvasEl.offsetLeft,
      y: e.y - this.canvasEl.offsetTop,
      colors: []
    } as Coord;
  }

  unfreeze() {
    this.frozen = false;
  }

  unhighlightEdge() {
    this.highlightedEdge = null;
  }

  unhighlightVertex() {
    this.highlightedVertex = null;
  }

  unsafeDrawEdge(v1: Coord, v2: Coord, strokeColor: string) {
    let context = this.canvasEl.getContext("2d");
    let unit = unitVector(v1, v2);
    context.strokeStyle = strokeColor;
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(v1.x - this.radius * unit.x, v1.y - this.radius * unit.y);
    context.lineTo(v2.x + this.radius * unit.x, v2.y + this.radius * unit.y);
    context.stroke();
  }

  updateColors(v: Coord, colors: Color[]) {
    let vKey = getVertexKey(this.graph, v);
    this.graph = setColors(this.graph, vKey, colors);
    this.redraw();
  }
}
