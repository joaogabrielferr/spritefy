import { bresenhamsAlgorithm } from '../algorithms/bresenhamsAlgorithm';
import Frame from '../scene/Frame';
import Mouse from '../scene/Mouse';
import { toRGB } from '../utils/colorConverters';

//ctx is the context of top canvas, drawing is made first on top canvas and after mouse up event the draw is translated to main canvas,
// since the line can be changed dinamically
export function Line(
  frame: Frame,
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
    const index = (p.x + display_size * p.y) * 4;

    data[index] = rgb[0];
    data[index + 1] = rgb[1];
    data[index + 2] = rgb[2];
    data[index + 3] = 255;

    paintNeighbors(index, frame, penSize, selectedColor, display_size, data);
  }

  const imageData = new ImageData(data, display_size, display_size);

  ctx.putImageData(imageData, 0, 0);

  frame.changed = true;
}

function paintNeighbors(
  index: number,
  frame: Frame,
  penSize: number,
  selectedColor: string,
  display_size: number,
  data: Uint8ClampedArray
) {
  let neighbors: number[] = frame.findNeighbors(index, penSize, display_size);
  for (let n of neighbors) {
    const rgb = toRGB(selectedColor);

    data[n] = rgb[0];
    data[n + 1] = rgb[1];
    data[n + 2] = rgb[2];
    data[n + 3] = 255;
  }
}
