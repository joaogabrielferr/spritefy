import Mouse from '../scene/Mouse';
import Scene from '../scene/Scene';
import { bresenhamsAlgorithm } from '../scene/buildPath';
import { Pixel } from '../types';
import { toRGB } from '../utils/colorConverters';

//ctx is the context of top canvas, drawing is made first on top canvas and after mouse up event the draw is translated to main canvas, since the draw change dinamically
export function Line(
  scene: Scene,
  ctx: CanvasRenderingContext2D,
  mouse: Mouse,
  pixel_size: number,
  start: { x: number; y: number },
  selectedColor: string,
  penSize: number,
  display_size: number
) {
  const x = Math.floor(mouse.x);
  const y = Math.floor(mouse.y);

  if (x > display_size || x < 0 || y > display_size || y < 0) {
    return;
  }

  const rgb = toRGB(selectedColor);

  const data = ctx.getImageData(0, 0, display_size, display_size).data;

  const path = bresenhamsAlgorithm(start, { x, y }, pixel_size, display_size);
  for (let p of path) {
    // if (!isPixelAlreadyPaintedInCurrentDraw(pixel, scene)) {
    const index = (p.x + display_size * p.y) * 4;

    data[index] = rgb[0];
    data[index + 1] = rgb[1];
    data[index + 2] = rgb[2];
    data[index + 3] = 255;

    // ctx.fillStyle = selectedColor;
    // ctx.fillRect(pixel.x, pixel.y, pixel_size, pixel_size);
    // draw.push(pixel);

    paintNeighbors(index, scene, ctx, penSize, selectedColor, pixel_size, display_size, data);
    // }
  }

  const imageData = new ImageData(data, display_size, display_size);

  ctx.putImageData(imageData, 0, 0);
}

function isPixelAlreadyPaintedInCurrentDraw(pixel: Pixel, scene: Scene) {
  return scene.currentPixelsMousePressed.get(pixel.id);
}

function paintNeighbors(
  index: number,
  scene: Scene,
  ctx: CanvasRenderingContext2D,
  penSize: number,
  selectedColor: string,
  pixel_size: number,
  display_size: number,
  data: Uint8ClampedArray
) {
  let neighbors: number[] = scene.findNeighbors(index, penSize, display_size);
  for (let n of neighbors) {
    const rgb = toRGB(selectedColor);

    data[n] = rgb[0];
    data[n + 1] = rgb[1];
    data[n + 2] = rgb[2];
    data[n + 3] = 255;
  }
}

// function paintNeighbors(
//   pixel: Pixel,
//   scene: Scene,
//   ctx: CanvasRenderingContext2D,
//   draw: Pixel[],
//   penSize: number,
//   pixel_size: number
// ) {
//   let neighbors: Pixel[] = scene.findNeighbors(pixel, penSize);

//   for (let n of neighbors) {
//     scene.currentPixelsMousePressed.set(n.id, true);
//     ctx.fillRect(n.x1, n.y1, pixel_size, pixel_size);
//     draw.push(n);
//   }
// }
