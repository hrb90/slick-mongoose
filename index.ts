import { GraphDrawingWrapper } from "./src/canvas_wrapper";
import { fiveColor } from "./src/thomassen";
import { animate } from "./src/animation";

document.addEventListener("DOMContentLoaded", () => {
  let wrapper = new GraphDrawingWrapper("canvas", 10);

  document.getElementById("animate-button").addEventListener("click", () => {
    wrapper.unhighlightVertex();
    fiveColor(wrapper.graph);
    animate(wrapper);
  });
});
