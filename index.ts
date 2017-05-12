import { GraphDrawingWrapper } from "./src/canvas_wrapper";
import { fiveColor } from './src/thomassen';
import { animate } from './src/animation';

document.addEventListener('DOMContentLoaded', () => {
  let wrapper = new GraphDrawingWrapper("canvas");

  document.getElementById('animate-button').addEventListener("click", () => {
    fiveColor(wrapper.graph);
    animate(wrapper);
  });
});
