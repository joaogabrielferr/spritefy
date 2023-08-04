import Scene from '../scene/Scene';
import { completeElipse } from '../algorithms/completeElipse';
import { toRGB } from '../utils/colorConverters';

//ctx is the context of top canvas, drawing is made first on top canvas and after mouse up event the draw is translated to main canvas, since the draw change dinamically
export function Elipse(
  scene: Scene,
  ctx: CanvasRenderingContext2D,
  pixel_size: number,
  midPoint: { x: number; y: number },
  selectedColor: string,
  penSize: number,
  major: number,
  minor: number,
  display_size: number
) {
  if (midPoint.x > display_size || midPoint.x < 0 || midPoint.y > display_size || midPoint.y < 0) {
    return;
  }

  const rgb = toRGB(selectedColor);

  const data = ctx.getImageData(0, 0, display_size, display_size).data;

  const path: { x: number; y: number }[] = completeElipse(midPoint, major, minor, scene, pixel_size, display_size);
  for (let pixel of path) {
    const index = (pixel.x + display_size * pixel.y) * 4;
    data[index] = rgb[0];
    data[index + 1] = rgb[1];
    data[index + 2] = rgb[2];
    data[index + 3] = 255;

    paintNeighbors(index, scene, penSize, selectedColor, display_size, data);
  }

  const imageData = new ImageData(data, display_size, display_size);

  ctx.putImageData(imageData, 0, 0);
}

function paintNeighbors(
  index: number,
  scene: Scene,
  penSize: number,
  selectedColor: string,
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
