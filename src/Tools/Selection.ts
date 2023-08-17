import { completeClosedRectangle } from '../algorithms/completeClosedRectangle';
import Frame from '../scene/Frame';
import Mouse from '../scene/Mouse';

export function Selection(
  frame: Frame,
  start: { x: number; y: number },
  end: { x: number; y: number },
  mouse: Mouse,
  ctx: CanvasRenderingContext2D,
  display_size: number,
  pixel_size: number,
  moving?: boolean,
  selectedDraw?: { offset: { x: number; y: number }; color: number[] }[]
) {
  // const x = Math.floor(mouse.x);
  // const y = Math.floor(mouse.y);

  // if (x > display_size || x < 0 || y > display_size || y < 0) {
  //   return;
  // }

  // if (!frame.selectionFirstPixel) return;

  const data = ctx.getImageData(0, 0, display_size, display_size).data;

  const path: { x: number; y: number }[] = completeClosedRectangle(start, end, pixel_size, display_size);

  for (let p of path) {
    const index = (p.x + display_size * p.y) * 4;
    data[index] = 0;
    data[index + 1] = 0;
    data[index + 2] = 255;
    data[index + 3] = 50;
  }

  if (selectedDraw) {
    for (let pixel of selectedDraw) {
      //pixel.x and pixel.y is the offset from selection top left
      const x = Math.floor(start.x + pixel.offset.x);
      const y = Math.floor(start.y + pixel.offset.y);

      if (x < 0 || y < 0 || x >= display_size || y >= display_size) continue;

      const index = (x + display_size * y) * 4;

      data[index] = 0;
      data[index + 1] = 0;
      data[index + 2] = 0;
      data[index + 3] = 150;
    }
  }

  const imageData = new ImageData(data, display_size, display_size);
  ctx.putImageData(imageData, 0, 0);

  if (!moving) {
    frame.selectionLastPixel = end;
  }
}

export function moveSelection() {
  //
}
