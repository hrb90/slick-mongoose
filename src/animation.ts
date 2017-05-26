import { GraphDrawingWrapper } from './canvas_wrapper';
import { Color } from './planar_graph';

export enum AnimationType {
  DrawEdge,
  UpdateColors,
  RestrictGraph
}

interface Animation {
  type: AnimationType,
  data: any
}

const updateDescription = (text: string) => {
  document.getElementById("description").textContent = text;
};

let animationSteps: Animation[] = [];

// A controlled effectful function to use in the thomassen algorithms.
export const addStep = (type: AnimationType, data: any) => {
  animationSteps.push({type, data})
}

export const resetAnimation = (): void => {
  animationSteps = [];
}

export const drawStep = (canvas: GraphDrawingWrapper): void => {
  let a = animationSteps.shift();
  switch (a.type) {
    case AnimationType.DrawEdge:
      canvas.drawEdge(a.data[0], a.data[1], "blue");
      updateDescription("Adding edges to triangulate the graph");
      break;
    case AnimationType.UpdateColors:
      canvas.drawCircle(a.data.vertex, "none", a.data.colors)
      updateDescription(`Updating vertex at ${a.data.vertex.x}, ${a.data.vertex.y}`);
      break;
    case AnimationType.RestrictGraph:
      canvas.drawNewGraph(a.data.graph);
      updateDescription(`Restricting the graph`);
      break;
  }
}

export const animate = (canvas: GraphDrawingWrapper): void => {
  drawStep(canvas);
  if (animationSteps.length > 0) {
    setTimeout(() => animate(canvas), 1000);
  }
};
