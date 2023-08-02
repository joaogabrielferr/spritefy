import Mouse from '../scene/Mouse';
import Scene from '../scene/Scene';
import { completeClosedRectangle } from '../scene/buildPath';

export function Selection(
  scene: Scene,
  start: { x: number; y: number },
  end: { x: number; y: number },
  mouse: Mouse,
  ctx: CanvasRenderingContext2D,
  display_size: number,
  pixel_size: number,
  moving?: boolean
) {
  // const x = Math.floor(mouse.x);
  // const y = Math.floor(mouse.y);

  // if (x > display_size || x < 0 || y > display_size || y < 0) {
  //   return;
  // }

  // if (!scene.selectionFirstPixel) return;

  const data = ctx.getImageData(0, 0, display_size, display_size).data;

  // ctx.fillRect(topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);

  // ctx.fillStyle = '#0000ff80';
  // ctx.fillRect(
  //   scene.selectionFirstPixel!.x,
  //   scene.selectionFirstPixel!.y,
  //   x - scene.selectionFirstPixel!.x,
  //   y - scene.selectionFirstPixel!.y
  // );

  const path: { x: number; y: number }[] = completeClosedRectangle(start, end, pixel_size, display_size);

  for (let p of path) {
    const index = (p.x + display_size * p.y) * 4;
    data[index] = 0;
    data[index + 1] = 0;
    data[index + 2] = 255;
    data[index + 3] = 100;
  }

  const imageData = new ImageData(data, display_size, display_size);
  ctx.putImageData(imageData, 0, 0);

  if (!moving) {
    scene.selectionLastPixel = end;
  }
}

export function moveSelection() {
  //
}
