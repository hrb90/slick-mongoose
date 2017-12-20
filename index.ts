import { GraphDrawingWrapper } from "./src/canvas_wrapper";
import { fiveColor } from "./src/thomassen";
import { animate } from "./src/animation";
import { bind } from "mousetrap";

document.addEventListener("DOMContentLoaded", () => {
  let wrapper = new GraphDrawingWrapper("canvas", 10);

  bind("enter", () => {
    if (!wrapper.frozen) {
      wrapper.unhighlightVertex();
      fiveColor(wrapper.graph);
      animate(wrapper);
    }
  });
});
