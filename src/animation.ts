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

let animationSteps: Animation[] = [];

window.getAnimString = () => JSON.stringify(animationSteps);

// A controlled effectful function to use in the thomassen algorithms.
export const addStep = (type: AnimationType, data: any) => {
  animationSteps.push({type, data})
}

export const resetAnimation = (): void => {
  animationSteps = [];
}

export const animate = (canvas: GraphDrawingWrapper): void => {
  if (animationSteps.length > 0) {
    let a = animationSteps.shift();
    switch (a.type) {
      case AnimationType.DrawEdge:
        canvas.drawEdge(a.data[0], a.data[1], "blue");
        break;
      case AnimationType.UpdateColors:
        canvas.drawCircle(a.data.vertex, "none", a.data.colors)
        break;
      case AnimationType.RestrictGraph:
        canvas.drawNewGraph(a.data.graph);
        break;
    }
    setTimeout(() => animate(canvas), 1000);
  }
};
