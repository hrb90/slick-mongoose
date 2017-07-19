import { GraphDrawingWrapper } from './canvas_wrapper';
import { Color } from './planar_graph';
import { filter, findIndex } from 'lodash';

export enum AnimationType {
  AddEdge,
  UpdateColors,
  RestrictGraph,
  HighlightEdge,
  Pause,
  Describe,
  DescribeChordlessOne,
  DescribeChordlessTwo,
  DescribeChordlessThree,
  DescribeChordlessFour,
  DescribeChorded,
  DescribePreColor,
  DescribeTriangle,
}

type Animation = {
  type: AnimationType,
  addButton: boolean,
  pause: number,
  data: any
}

const updateDescription = (text: string) => {
  document.getElementById("description").textContent = text;
};

const addContinueButton = (callback: () => void) => {
  var continueButton = document.createElement("button");
  continueButton.innerText = "Continue";
  continueButton.onclick = callback;
  document.getElementById("description").appendChild(continueButton);
}

let animationSteps: Animation[] = [];

// A controlled effectful function to use in the thomassen algorithms.
export const addStep = (type: AnimationType, pause: number, data: any) => {
  animationSteps.push({type, pause, data, addButton: false})
}

export const resetAnimation = (): void => {
  animationSteps = [];
}

export const postProcessAnimation = (): void => {
  [AnimationType.DescribeChorded, AnimationType.DescribeTriangle,
  AnimationType.DescribeChordlessOne, AnimationType.DescribeChordlessTwo,
  AnimationType.DescribeChordlessThree, AnimationType.DescribeChordlessFour,
  AnimationType.DescribePreColor].forEach(type => {
    let firstIndexOfType = findIndex(animationSteps, a => a.type === type)
    if (firstIndexOfType >= 0) {
      animationSteps[firstIndexOfType].addButton = true;
    }
  });
  console.log(animationSteps);
}

export const drawStep = (a: Animation, canvas: GraphDrawingWrapper): void => {
  switch (a.type) {
    case AnimationType.AddEdge:
      canvas.drawEdge(a.data[0], a.data[1], "blue");
      break;
    case AnimationType.UpdateColors:
      canvas.updateColors(a.data.vertex, a.data.colors);
      break;
    case AnimationType.RestrictGraph:
      canvas.highlightGraph(a.data.graph);
      canvas.redraw();
      break;
    case AnimationType.HighlightEdge:
      canvas.unsafeDrawEdge(a.data[0], a.data[1], "red");
      break;
    case AnimationType.Describe:
    case AnimationType.DescribeChorded:
    case AnimationType.DescribeTriangle:
    case AnimationType.DescribeChordlessOne:
    case AnimationType.DescribeChordlessTwo:
    case AnimationType.DescribeChordlessThree:
    case AnimationType.DescribeChordlessFour:
    case AnimationType.DescribePreColor:
      updateDescription(a.data);
      break;
    case AnimationType.Pause:
      break;
  }
}

export const animate = (canvas: GraphDrawingWrapper): void => {
  if (animationSteps.length > 0) {
    let step = animationSteps.shift();
    drawStep(step, canvas);
    if (step.addButton) {
      addContinueButton(() => animate(canvas));
    } else {
      setTimeout(() => animate(canvas), step.pause);
    }
  }
};
