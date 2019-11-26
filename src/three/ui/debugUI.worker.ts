import * as Comlink from "comlink";

export default class CanvasWorker {
  private offScreen: OffscreenCanvas = null as any;

  init(offscreen: OffscreenCanvas) {
    this.offScreen = offscreen;
  }

  setString(s: string) {
    const canvas = this.offScreen;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    console.log({ s });

    ctx.fillStyle = "#002000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const fHeight = 20;
    ctx.font = fHeight.toString() + "px monospace";
    ctx.fillStyle = "#ffffff";

    const px = 8;
    let py = fHeight + 30;
    const arr = s.split("\n");
    arr.forEach(s => {
      ctx.fillText(s, px, fHeight + py);
      py += fHeight + 4;
    });
  }
}

Comlink.expose(CanvasWorker);
