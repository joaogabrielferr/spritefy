import { completeSquare } from '../scene/buildPath';
import Mouse from '../scene/Mouse';
import Scene from '../scene/Scene';
import { Pixel } from '../types';

//ctx is the context of top canvas, drawing is made first on top canvas and after mouse up event the draw is translated to main canvas, since the draw change dinamically
export function Rectangle(
  scene: Scene,
  ctx: CanvasRenderingContext2D,
  mouse: Mouse,
  pixel_size: number,
  start: Pixel,
  selectedColor: string,
  penSize: number
) {
  const draw: Pixel[] = [];

  const end: Pixel | null = scene.findPixel(mouse.x, mouse.y, pixel_size);

  if (!end || !start) return draw;

  const path: Pixel[] = completeSquare(scene, start, end, pixel_size);

  const map = new Map<number, boolean>();

  for (let pixel of path) {
    // if(!map.get(pixel.id))
    // {
    map.set(pixel.id, true);
    ctx.fillStyle = selectedColor;
    ctx.fillRect(pixel.x1, pixel.y1, penSize, penSize);
    draw.push(pixel);

    paintNeighbors(pixel, scene, ctx, draw, penSize, pixel_size);

    // }
  }

  return draw;
}

function paintNeighbors(
  pixel: Pixel,
  scene: Scene,
  ctx: CanvasRenderingContext2D,
  draw: Pixel[],
  penSize: number,
  pixel_size: number
) {
  let neighbors: Pixel[] = scene.findNeighbors(pixel, penSize, display_size);

  for (let n of neighbors) {
    scene.currentPixelsMousePressed.set(n.id, true);
    ctx.fillRect(n.x1, n.y1, pixel_size, pixel_size);
    draw.push(n);
  }
}
