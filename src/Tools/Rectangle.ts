import { completeSquare } from '../scene/buildPath';
import Mouse from '../scene/Mouse';
import Scene from '../scene/Scene';
import { Pixel } from '../types';
import { toRGB } from '../utils/colorConverters';

//ctx is the context of top canvas, drawing is made first on top canvas and after mouse up event the draw is translated to main canvas, since the draw change dinamically
export function Rectangle(
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

  const path: { x: number; y: number }[] = completeSquare(start, { x, y }, pixel_size, display_size);

  //const map = new Map<number, boolean>();

  for (let pixel of path) {
    // if(!map.get(pixel.id))
    // {
    //map.set(pixel.id, true);
    // ctx.fillStyle = selectedColor;
    // ctx.fillRect(pixel.x1, pixel.y1, penSize, penSize);

    const index = (pixel.x + display_size * pixel.y) * 4;
    data[index] = rgb[0];
    data[index + 1] = rgb[1];
    data[index + 2] = rgb[2];
    data[index + 3] = 255;

    paintNeighbors(index, scene, ctx, penSize, selectedColor, pixel_size, display_size, data);

    // }
  }

  // return draw;

  const imageData = new ImageData(data, display_size, display_size);

  ctx.putImageData(imageData, 0, 0);
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
