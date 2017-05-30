import { GraphDrawingWrapper } from './canvas_wrapper';
import { Color } from './planar_graph';

export enum AnimationType {
  AddEdge,
  UpdateColors,
  RestrictGraph,
  HighlightEdge,
  Pause,
  Describe
}

type Animation = {
  type: AnimationType,
  pause: number,
  data: any
}

const updateDescription = (text: string) => {
  document.getElementById("description").textContent = text;
};

let animationSteps: Animation[] = [];

// A controlled effectful function to use in the thomassen algorithms.
export const addStep = (type: AnimationType, pause: number, data: any) => {
  animationSteps.push({type, pause, data})
}

export const resetAnimation = (): void => {
  animationSteps = [];
}

export const drawStep = (a: Animation, canvas: GraphDrawingWrapper): void => {
  switch (a.type) {
    case AnimationType.AddEdge:
      canvas.drawEdge(a.data[0], a.data[1], "blue");
      break;
    case AnimationType.UpdateColors:
      canvas.drawCircle(a.data.vertex, "none", a.data.colors)
      break;
    case AnimationType.RestrictGraph:
      canvas.drawNewGraph(a.data.graph);
      break;
    case AnimationType.HighlightEdge:
      canvas.unsafeDrawEdge(a.data[0], a.data[1], "red");
      break;
    case AnimationType.Describe:
      updateDescription(a.data);
    case AnimationType.Pause:
      break;
  }
}

export const animate = (canvas: GraphDrawingWrapper): void => {
  if (animationSteps.length > 0) {
    let step = animationSteps.shift();
    drawStep(step, canvas);
    setTimeout(() => animate(canvas), step.pause);
  }
};
