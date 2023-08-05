import Mouse from '../scene/Mouse';
import Scene from '../scene/Scene';
import { bresenhamsAlgorithm } from '../algorithms/bresenhamsAlgorithm';
import { toRGB } from '../utils/colorConverters';

export function Dithering(
  scene: Scene,
  mouse: Mouse,
  pixel_size: number,
  display_size: number,
  ctx: CanvasRenderingContext2D,
  penSize: number,
  selectedColor: string
) {
  if (!mouse.isPressed) return [];

  const xs = Math.floor(mouse.x);
  const ys = Math.floor(mouse.y);
  if (xs > display_size || xs < 0 || ys > display_size || ys < 0) {
    return;
  }

  const index = (xs + display_size * ys) * 4;

  if (index < 0 || index + 3 > display_size * display_size * 4) {
    return;
  }

  const rgb = toRGB(selectedColor);
  //Uint8clampedArray index to canvas coordinate
  const x = Math.floor((index / 4) % display_size);
  const y = Math.floor(index / 4 / display_size);
  if (x % 2 === y % 2) {
    scene.pixels[index] = rgb[0];
    scene.pixels[index + 1] = rgb[1];
    scene.pixels[index + 2] = rgb[2];
    scene.pixels[index + 3] = 255;
  }

  paintNeighbors(index, scene, penSize, selectedColor, display_size);

  //build path from last pixel to current pixel
  if (scene.lastPixel != null) {
    let path = bresenhamsAlgorithm(scene.lastPixel!, { x: xs, y: ys }, pixel_size, display_size);
    for (let p of path) {
      const index = (p.x + display_size * p.y) * 4;
      //Uint8clampedArray index to canvas coordinate
      const x = Math.floor((index / 4) % display_size);
      const y = Math.floor(index / 4 / display_size);
      if (x % 2 === y % 2) {
        scene.pixels[index] = rgb[0];
        scene.pixels[index + 1] = rgb[1];
        scene.pixels[index + 2] = rgb[2];
        scene.pixels[index + 3] = 255;
      }

      paintNeighbors(index, scene, penSize, selectedColor, display_size);
    }
  }

  scene.lastPixel = { x: xs, y: ys };

  const imageData = new ImageData(scene.pixels, display_size, display_size);

  ctx.putImageData(imageData, 0, 0);

  scene.changed = true;
}

function paintNeighbors(index: number, scene: Scene, penSize: number, selectedColor: string, display_size: number) {
  let neighbors: number[] = scene.findNeighbors(index, penSize, display_size);
  for (let n of neighbors) {
    const rgb = toRGB(selectedColor);
    //Uint8clampedArray index to canvas coordinate
    const x = Math.floor((n / 4) % display_size);
    const y = Math.floor(n / 4 / display_size);
    if (x % 2 === y % 2) {
      scene.pixels[n] = rgb[0];
      scene.pixels[n + 1] = rgb[1];
      scene.pixels[n + 2] = rgb[2];
      scene.pixels[n + 3] = 255;
    }
  }
}
