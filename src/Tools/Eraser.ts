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

  //if this pixel is in currentPixelsMousePressed, that means it was already painted in the current pen stroke, no need to paint it twice
  // if (pixel != null) {
  //   if (!isPixelAlreadyPaintedInCurrentDraw(pixel, scene) && !empty(pixel)) {
  //     pixel.colorStack.push(ERASING);
  //     scene.currentPixelsMousePressed.set(pixel.id, true);
  //     draw.push(pixel);
  //     //   ctx.fillStyle = pixel.bgColor;
  //     ctx.clearRect(pixel.x1, pixel.y1, pixel_size, pixel_size);
  //   }

  scene.pixels[index] = 0;
  scene.pixels[index + 1] = 0;
  scene.pixels[index + 2] = 0;
  scene.pixels[index + 3] = 0;

  paintNeighbors(index, scene, ctx, penSize, pixel_size, display_size);

  //if there are gaps between the points, fill them with bresenham's algorithm (see scene/buildPath.ts)
  // if (
  //   scene.lastPixel !== null &&
  //   mouse.isPressed &&
  //   scene.lastPixel.id !== pixel.id &&
  //   (eventName == 'mousemove' || 'touchmove')
  // ) {
  if (scene.lastPixel !== null) {
    //build path from last pixel to current pixel
    const path = bresenhamsAlgorithm(scene.lastPixel!, { x, y }, pixel_size, display_size);
    for (let p of path) {
      // if (!isPixelAlreadyPaintedInCurrentDraw(p, scene) && !empty(p)) {
      //   p.colorStack.push(ERASING);
      //   scene.currentPixelsMousePressed.set(p.id, true);
      //   draw.push(p);
      //   ctx.clearRect(p.x1, p.y1, pixel_size, pixel_size);
      // }
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

function isPixelAlreadyPaintedInCurrentDraw(pixel: Pixel, scene: Scene) {
  return scene.currentPixelsMousePressed.get(pixel.id);
}

//if pixel was never painted or it is already erased

function empty(pixel: Pixel) {
  const lastColor: string | undefined = pixel.colorStack.top();
  if (!lastColor || (lastColor && lastColor === pixel.bgColor)) return true;
  return false;
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
    // if (!isPixelAlreadyPaintedInCurrentDraw(n, scene)) {
    //   scene.currentPixelsMousePressed.set(n.id, true);
    //   draw.push(n);
    //   n.colorStack.push(selectedColor);
    // }

    scene.pixels[n] = 0;
    scene.pixels[n + 1] = 0;
    scene.pixels[n + 2] = 0;
    scene.pixels[n + 3] = 0;

    // scene.pixels[n] = 0;
    // scene.pixels[n + 1] = 0;
    // scene.pixels[n + 2] = 0;
    // scene.pixels[n + 3] = 255;
    // ctx.fillRect(n.x1, n.y1, pixel_size, pixel_size);
  }
}
