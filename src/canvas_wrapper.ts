export class GraphDrawingWrapper {
  canvasEl: HTMLCanvasElement;

  constructor(canvasId : string) {
    this.canvasEl = (<HTMLCanvasElement>document.getElementById(canvasId));
    this.drawCircle = this.drawCircle.bind(this);
    this.canvasEl.addEventListener("click", this.drawCircle);
  }

  drawCircle(e : MouseEvent) {
    let context = this.canvasEl.getContext('2d');
    context.beginPath();
    context.arc(e.x, e.y, 20, 0, 2 * Math.PI);
    context.stroke();
  }
}
