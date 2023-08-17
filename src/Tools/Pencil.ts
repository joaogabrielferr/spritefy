import { bresenhamsAlgorithm } from '../algorithms/bresenhamsAlgorithm';
import Frame from '../scene/Frame';
import Mouse from '../scene/Mouse';
import { toRGB } from '../utils/colorConverters';

export function Pencil(
  frame: Frame,
  mouse: Mouse,
  pixel_size: number,
  display_size: number,
  ctx: CanvasRenderingContext2D,
  penSize: number,
  selectedColor: string,
  xMirror: boolean,
  yMirror: boolean
) {
  if (!mouse.isPressed) return;

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

  frame.pixels[index] = rgb[0];
  frame.pixels[index + 1] = rgb[1];
  frame.pixels[index + 2] = rgb[2];
  frame.pixels[index + 3] = 255;

  paintNeighbors(index, frame, ctx, penSize, selectedColor, pixel_size, display_size);

  //build path from last pixel to current pixel
  if (frame.lastPixel != null) {
    let path = bresenhamsAlgorithm(frame.lastPixel!, { x: xs, y: ys }, pixel_size, display_size);
    for (let p of path) {
      const index = (p.x + display_size * p.y) * 4;
      frame.pixels[index] = rgb[0];
      frame.pixels[index + 1] = rgb[1];
      frame.pixels[index + 2] = rgb[2];
      frame.pixels[index + 3] = 255;

      paintNeighbors(index, frame, ctx, penSize, selectedColor, pixel_size, display_size);
    }
  }

  if (xMirror) {
    paintXMirror(xs, ys, frame, pixel_size, display_size, selectedColor, ctx, penSize);
  }

  if (yMirror) {
    paintYMirror(xs, ys, frame, pixel_size, display_size, selectedColor, ctx, penSize);
  }

  if (xMirror && yMirror) {
    paintXYMirror(xs, ys, frame, pixel_size, display_size, selectedColor, ctx, penSize);
  }

  frame.lastPixel = { x: xs, y: ys };

  const imageData = new ImageData(frame.pixels, display_size, display_size);

  ctx.putImageData(imageData, 0, 0);

  frame.changed = true;
}

function paintNeighbors(
  index: number,
  frame: Frame,
  ctx: CanvasRenderingContext2D,
  penSize: number,
  selectedColor: string,
  pixel_size: number,
  display_size: number
) {
  let neighbors: number[] = frame.findNeighbors(index, penSize, display_size);
  for (let n of neighbors) {
    const rgb = toRGB(selectedColor);

    frame.pixels[n] = rgb[0];
    frame.pixels[n + 1] = rgb[1];
    frame.pixels[n + 2] = rgb[2];
    frame.pixels[n + 3] = 255;
  }
}

function paintXMirror(
  x: number,
  y: number,
  frame: Frame,
  pixel_size: number,
  display_size: number,
  selectedColor: string,
  ctx: CanvasRenderingContext2D,
  penSize: number
) {
  const xMirrorIndex = (display_size / 2 + (display_size / 2 - x) + display_size * y) * 4;

  if (xMirrorIndex < 0 || xMirrorIndex + 3 > display_size * display_size * 4) {
    return;
  }

  const rgb = toRGB(selectedColor);

  frame.pixels[xMirrorIndex] = rgb[0];
  frame.pixels[xMirrorIndex + 1] = rgb[1];
  frame.pixels[xMirrorIndex + 2] = rgb[2];
  frame.pixels[xMirrorIndex + 3] = 255;

  paintNeighbors(xMirrorIndex, frame, ctx, penSize, selectedColor, pixel_size, display_size);

  //build path from last pixel to current pixel
  if (frame.lastPixelXMirror != null) {
    let path = bresenhamsAlgorithm(
      frame.lastPixelXMirror!,
      { x: display_size / 2 + (display_size / 2 - x), y: y },
      pixel_size,
      display_size
    );
    for (let p of path) {
      const index = (p.x + display_size * p.y) * 4;
      frame.pixels[index] = rgb[0];
      frame.pixels[index + 1] = rgb[1];
      frame.pixels[index + 2] = rgb[2];
      frame.pixels[index + 3] = 255;

      paintNeighbors(index, frame, ctx, penSize, selectedColor, pixel_size, display_size);
    }
  }

  frame.lastPixelXMirror = { x: display_size / 2 + (display_size / 2 - x), y };
}

function paintYMirror(
  x: number,
  y: number,
  frame: Frame,
  pixel_size: number,
  display_size: number,
  selectedColor: string,
  ctx: CanvasRenderingContext2D,
  penSize: number
) {
  // const pixelYMirror: Pixel | null = frame.findPixel(xs, display_size / 2 + (display_size / 2 - ys), pixel_size);

  const yy = display_size / 2 + (display_size / 2 - y);

  const yMirrorIndex = (x + yy * display_size) * 4;

  if (yMirrorIndex < 0 || yMirrorIndex + 3 > display_size * display_size * 4) {
    return;
  }

  const rgb = toRGB(selectedColor);

  frame.pixels[yMirrorIndex] = rgb[0];
  frame.pixels[yMirrorIndex + 1] = rgb[1];
  frame.pixels[yMirrorIndex + 2] = rgb[2];
  frame.pixels[yMirrorIndex + 3] = 255;

  paintNeighbors(yMirrorIndex, frame, ctx, penSize, selectedColor, pixel_size, display_size);

  //build path from last pixel to current pixel
  if (frame.lastPixelYMirror != null) {
    let path = bresenhamsAlgorithm(frame.lastPixelYMirror!, { x, y: yy }, pixel_size, display_size);
    for (let p of path) {
      const index = (p.x + display_size * p.y) * 4;
      frame.pixels[index] = rgb[0];
      frame.pixels[index + 1] = rgb[1];
      frame.pixels[index + 2] = rgb[2];
      frame.pixels[index + 3] = 255;

      paintNeighbors(index, frame, ctx, penSize, selectedColor, pixel_size, display_size);
    }
  }

  frame.lastPixelYMirror = { x, y: yy };
}

function paintXYMirror(
  x: number,
  y: number,
  frame: Frame,
  pixel_size: number,
  display_size: number,
  selectedColor: string,
  ctx: CanvasRenderingContext2D,
  penSize: number
) {
  const xx = display_size / 2 + (display_size / 2 - x);
  const yy = display_size / 2 + (display_size / 2 - y);

  const xyMirrorIndex = (xx + yy * display_size) * 4;

  if (xyMirrorIndex < 0 || xyMirrorIndex + 3 > display_size * display_size * 4) {
    return;
  }

  const rgb = toRGB(selectedColor);

  frame.pixels[xyMirrorIndex] = rgb[0];
  frame.pixels[xyMirrorIndex + 1] = rgb[1];
  frame.pixels[xyMirrorIndex + 2] = rgb[2];
  frame.pixels[xyMirrorIndex + 3] = 255;

  paintNeighbors(xyMirrorIndex, frame, ctx, penSize, selectedColor, pixel_size, display_size);

  //build path from last pixel to current pixel
  if (frame.lastPixelXYMirror != null) {
    let path = bresenhamsAlgorithm(frame.lastPixelXYMirror!, { x: xx, y: yy }, pixel_size, display_size);
    for (let p of path) {
      const index = (p.x + display_size * p.y) * 4;
      frame.pixels[index] = rgb[0];
      frame.pixels[index + 1] = rgb[1];
      frame.pixels[index + 2] = rgb[2];
      frame.pixels[index + 3] = 255;

      paintNeighbors(index, frame, ctx, penSize, selectedColor, pixel_size, display_size);
    }
  }

  frame.lastPixelXYMirror = { x: xx, y: yy };
}
