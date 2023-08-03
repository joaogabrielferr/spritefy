import Mouse from '../scene/Mouse';
import Scene from '../scene/Scene';
import { bresenhamsAlgorithm } from '../scene/buildPath';
import { Pixel } from '../types/index';
import { ERASING } from '../utils/constants';

export function Eraser(
  eventName: string,
  mouse: Mouse,
  scene: Scene,
  pixel_size: number,
  display_size: number,
  ctx: CanvasRenderingContext2D,
  penSize: number
) {
  // if(!mouse.isPressed)return [];

  const draw: Pixel[] = []; //pixels changed in this function are stored here

  const x = Math.floor(mouse.x);
  const y = Math.floor(mouse.y);

  if (x > display_size || x < 0 || y > display_size || y < 0) {
    return;
  }

  const index = (x + display_size * y) * 4;

  if (index < 0 || index + 3 > display_size * display_size * 4) {
    return;
  }

  scene.pixels[index] = 0;
  scene.pixels[index + 1] = 0;
  scene.pixels[index + 2] = 0;
  scene.pixels[index + 3] = 0;

  paintNeighbors(index, scene, ctx, penSize, pixel_size, display_size);

  //if there are gaps between the points, fill them with bresenham's algorithm (see scene/buildPath.ts)

  if (scene.lastPixel !== null) {
    //build path from last pixel to current pixel
    const path = bresenhamsAlgorithm(scene.lastPixel!, { x, y }, pixel_size, display_size);
    for (let p of path) {
      const index = (p.x + display_size * p.y) * 4;

      scene.pixels[index] = 0;
      scene.pixels[index + 1] = 0;
      scene.pixels[index + 2] = 0;
      scene.pixels[index + 3] = 0;

      paintNeighbors(index, scene, ctx, penSize, pixel_size, display_size);
    }
  }

  scene.lastPixel = { x, y };
  //}

  const imageData = new ImageData(scene.pixels, display_size, display_size);

  ctx.putImageData(imageData, 0, 0);
}

function paintNeighbors(
  index: number,
  scene: Scene,
  ctx: CanvasRenderingContext2D,
  penSize: number,
  pixel_size: number,
  display_size: number
) {
  let neighbors: number[] = scene.findNeighbors(index, penSize, display_size);
  for (let n of neighbors) {
    scene.pixels[n] = 0;
    scene.pixels[n + 1] = 0;
    scene.pixels[n + 2] = 0;
    scene.pixels[n + 3] = 0;
  }
}
