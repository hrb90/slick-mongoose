import { GraphDrawingWrapper } from "./src/canvas_wrapper";
import { fiveColor } from "./src/thomassen";
import { animate } from "./src/animation";
import { bind } from "mousetrap";

document.addEventListener("DOMContentLoaded", () => {
  let wrapper = new GraphDrawingWrapper("canvas", 10);

  const runVisualization = () => {
    if (!wrapper.frozen) {
      wrapper.unhighlightVertex();
      fiveColor(wrapper.graph);
      animate(wrapper);
    }
  };

  bind("enter", runVisualization);
  document
    .getElementById("color-graph")
    .addEventListener("click", runVisualization);

  document.getElementById("clear-canvas").addEventListener("click", () => {
    if (!wrapper.frozen) {
      wrapper.clearGraph();
      wrapper.clear();
    }
  });
});
