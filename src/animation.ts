import { GraphDrawingWrapper } from "./canvas_wrapper";
import { findIndex } from "./util";
import { bind, unbind } from "mousetrap";

// Refactor this to just have a "describe" type and a "describew"

export enum AnimationType {
  AddEdge,
  Begin,
  End,
  UpdateColors,
  RestrictGraph,
  HighlightEdge,
  UnhighlightEdge,
  Pause,
  Describe,
  DescribeAddEdges,
  DescribeChordlessOne,
  DescribeChordlessTwo,
  DescribeChordlessThree,
  DescribeChordlessFour,
  DescribeChorded,
  DescribePreColor,
  DescribeTriangle
}

type Animation = {
  type: AnimationType;
  addButton: boolean;
  pause: number;
  data: any;
};

const updateDescription = (text: string) => {
  document.getElementById("description").textContent = text;
};

const addContinueButton = (callback: () => void) => {
  var continueButton = document.createElement("strong");
  continueButton.id = "continueButton";
  continueButton.innerText = "Press spacebar to continue";
  bind("space", () => {
    unbind("space");
    callback();
  });
  document.getElementById("sidebar").appendChild(continueButton);
};

const removeElementById = (id: string): void => {
  document.getElementById(id).remove();
};

let animationSteps: Animation[] = [];

// A controlled effectful function to use in the thomassen algorithms.
export const addStep = (type: AnimationType, pause: number, data: any) => {
  animationSteps.push({ type, pause, data, addButton: false });
};

export const resetAnimation = (): void => {
  animationSteps = [];
};

export const postProcessAnimation = (): void => {
  [
    AnimationType.DescribeAddEdges,
    AnimationType.DescribeChorded,
    AnimationType.DescribeTriangle,
    AnimationType.DescribeChordlessOne,
    AnimationType.DescribeChordlessTwo,
    AnimationType.DescribeChordlessThree,
    AnimationType.DescribeChordlessFour,
    AnimationType.DescribePreColor
  ].forEach(type => {
    let firstIndexOfType = findIndex(animationSteps, a => a.type === type);
    if (firstIndexOfType >= 0) {
      animationSteps[firstIndexOfType].addButton = true;
    }
  });
};

export const drawStep = (a: Animation, canvas: GraphDrawingWrapper): void => {
  switch (a.type) {
    case AnimationType.AddEdge:
      canvas.drawEdge(a.data[0], a.data[1], "blue");
      break;
    case AnimationType.Begin:
      canvas.freeze();
      break;
    case AnimationType.End:
      canvas.unfreeze();
      break;
    case AnimationType.UpdateColors:
      canvas.updateColors(a.data.vertex, a.data.colors);
      break;
    case AnimationType.RestrictGraph:
      canvas.highlightGraph(a.data.graph);
      canvas.redraw();
      break;
    case AnimationType.HighlightEdge:
      canvas.highlightEdge(a.data[0], a.data[1]);
      canvas.redraw();
      break;
    case AnimationType.UnhighlightEdge:
      canvas.unhighlightEdge();
      canvas.redraw();
    case AnimationType.Describe:
    case AnimationType.DescribeAddEdges:
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
};

export const animate = (canvas: GraphDrawingWrapper): void => {
  if (animationSteps.length > 0) {
    let step = animationSteps.shift();
    drawStep(step, canvas);
    if (step.addButton) {
      canvas.darken();
      addContinueButton(() => {
        canvas.lighten();
        animate(canvas);
        removeElementById("continueButton");
      });
    } else {
      setTimeout(() => animate(canvas), step.pause);
    }
  }
};
