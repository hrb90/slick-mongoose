import { GraphDrawingWrapper } from './canvas_wrapper';

interface Animation {
  type: string,
  data: any
}

let animationSteps: Animation[] = [];

// A controlled effectful function to use in the thomassen algorithms.
export const addStep = (type: string, data: any) => {
  animationSteps.push({type, data})
}

export const animate = (canvas: GraphDrawingWrapper): void => {
  const PAUSE = 500;
  animationSteps.forEach(a => {
    if (a.type === "DRAW_EDGE") {
      canvas.drawEdge(a.data[0], a.data[1], "blue");
    }
  })
};
