export class GraphDrawingWrapper {
  canvasEl: HTMLElement;

  constructor(canvasId : string) {
    this.canvasEl = document.getElementById(canvasId);
    this.canvasEl.addEventListener("click", console.log);
  }
}
