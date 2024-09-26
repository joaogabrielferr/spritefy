import { bresenhamsAlgorithm } from '../algorithms/bresenhamsAlgorithm';
import Frame from '../Scene/Frame';
import Mouse from '../Scene/Mouse';
import { toRGB } from '../utils/colorConverters';

export function Dithering(
  frame: Frame,
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
    frame.pixels[index] = rgb[0];
    frame.pixels[index + 1] = rgb[1];
    frame.pixels[index + 2] = rgb[2];
    frame.pixels[index + 3] = 255;
  }

  paintNeighbors(index, frame, penSize, selectedColor, display_size);

  //build path from last pixel to current pixel
  if (frame.lastPixel != null) {
    let path = bresenhamsAlgorithm(frame.lastPixel!, { x: xs, y: ys }, pixel_size, display_size);
    for (let p of path) {
      const index = (p.x + display_size * p.y) * 4;
      //Uint8clampedArray index to canvas coordinate
      const x = Math.floor((index / 4) % display_size);
      const y = Math.floor(index / 4 / display_size);
      if (x % 2 === y % 2) {
        frame.pixels[index] = rgb[0];
        frame.pixels[index + 1] = rgb[1];
        frame.pixels[index + 2] = rgb[2];
        frame.pixels[index + 3] = 255;
      }

      paintNeighbors(index, frame, penSize, selectedColor, display_size);
    }
  }

  frame.lastPixel = { x: xs, y: ys };

  const imageData = new ImageData(frame.pixels, display_size, display_size);

  ctx.putImageData(imageData, 0, 0);

  frame.changed = true;
}

function paintNeighbors(index: number, frame: Frame, penSize: number, selectedColor: string, display_size: number) {
  let neighbors: number[] = frame.findNeighbors(index, penSize, display_size);
  for (let n of neighbors) {
    const rgb = toRGB(selectedColor);
    //Uint8clampedArray index to canvas coordinate
    const x = Math.floor((n / 4) % display_size);
    const y = Math.floor(n / 4 / display_size);
    if (x % 2 === y % 2) {
      frame.pixels[n] = rgb[0];
      frame.pixels[n + 1] = rgb[1];
      frame.pixels[n + 2] = rgb[2];
      frame.pixels[n + 3] = 255;
    }
  }
}
