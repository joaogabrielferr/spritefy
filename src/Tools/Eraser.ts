import { bresenhamsAlgorithm } from '../algorithms/bresenhamsAlgorithm';
import Frame from '../scene/Frame';
import Mouse from '../scene/Mouse';

export function Eraser(
  mouse: Mouse,
  frame: Frame,
  pixel_size: number,
  display_size: number,
  ctx: CanvasRenderingContext2D,
  penSize: number,
  xMirror: boolean,
  yMirror: boolean
) {
  const x = Math.floor(mouse.x);
  const y = Math.floor(mouse.y);

  if (x > display_size || x < 0 || y > display_size || y < 0) {
    return;
  }

  const index = (x + display_size * y) * 4;

  if (index < 0 || index + 3 > display_size * display_size * 4) {
    return;
  }

  frame.pixels[index] = 0;
  frame.pixels[index + 1] = 0;
  frame.pixels[index + 2] = 0;
  frame.pixels[index + 3] = 0;

  paintNeighbors(index, frame, penSize, display_size);

  //if there are gaps between the points, fill them with bresenham's algorithm (see frame/buildPath.ts)

  if (frame.lastPixel !== null) {
    //build path from last pixel to current pixel
    const path = bresenhamsAlgorithm(frame.lastPixel!, { x, y }, pixel_size, display_size);
    for (let p of path) {
      const index = (p.x + display_size * p.y) * 4;

      frame.pixels[index] = 0;
      frame.pixels[index + 1] = 0;
      frame.pixels[index + 2] = 0;
      frame.pixels[index + 3] = 0;

      paintNeighbors(index, frame, penSize, display_size);
    }
  }

  if (xMirror) {
    paintXMirror(x, y, frame, pixel_size, display_size, penSize);
  }

  if (yMirror) {
    paintYMirror(x, y, frame, pixel_size, display_size, penSize);
  }

  if (xMirror && yMirror) {
    paintXYMirror(x, y, frame, pixel_size, display_size, penSize);
  }

  frame.lastPixel = { x, y };
  //}

  const imageData = new ImageData(frame.pixels, display_size, display_size);

  ctx.putImageData(imageData, 0, 0);

  frame.changed = true;
}

function paintNeighbors(index: number, frame: Frame, penSize: number, display_size: number) {
  let neighbors: number[] = frame.findNeighbors(index, penSize, display_size);
  for (let n of neighbors) {
    frame.pixels[n] = 0;
    frame.pixels[n + 1] = 0;
    frame.pixels[n + 2] = 0;
    frame.pixels[n + 3] = 0;
  }
}

function paintXMirror(
  x: number,
  y: number,
  frame: Frame,
  pixel_size: number,
  display_size: number,

  penSize: number
) {
  const xMirrorIndex = (display_size / 2 + (display_size / 2 - x) + display_size * y) * 4;

  if (xMirrorIndex < 0 || xMirrorIndex + 3 > display_size * display_size * 4) {
    return;
  }

  frame.pixels[xMirrorIndex] = 0;
  frame.pixels[xMirrorIndex + 1] = 0;
  frame.pixels[xMirrorIndex + 2] = 0;
  frame.pixels[xMirrorIndex + 3] = 0;

  paintNeighbors(xMirrorIndex, frame, penSize, display_size);

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
      frame.pixels[index] = 0;
      frame.pixels[index + 1] = 0;
      frame.pixels[index + 2] = 0;
      frame.pixels[index + 3] = 0;

      paintNeighbors(index, frame, penSize, display_size);
    }
  }

  frame.lastPixelXMirror = { x: display_size / 2 + (display_size / 2 - x), y };
}

function paintYMirror(x: number, y: number, frame: Frame, pixel_size: number, display_size: number, penSize: number) {
  const yy = display_size / 2 + (display_size / 2 - y);

  const yMirrorIndex = (x + yy * display_size) * 4;

  if (yMirrorIndex < 0 || yMirrorIndex + 3 > display_size * display_size * 4) {
    return;
  }

  frame.pixels[yMirrorIndex] = 0;
  frame.pixels[yMirrorIndex + 1] = 0;
  frame.pixels[yMirrorIndex + 2] = 0;
  frame.pixels[yMirrorIndex + 3] = 0;

  paintNeighbors(yMirrorIndex, frame, penSize, display_size);

  //build path from last pixel to current pixel
  if (frame.lastPixelYMirror != null) {
    let path = bresenhamsAlgorithm(frame.lastPixelYMirror!, { x, y: yy }, pixel_size, display_size);
    for (let p of path) {
      const index = (p.x + display_size * p.y) * 4;
      frame.pixels[index] = 0;
      frame.pixels[index + 1] = 0;
      frame.pixels[index + 2] = 0;
      frame.pixels[index + 3] = 0;

      paintNeighbors(index, frame, penSize, display_size);
    }
  }

  frame.lastPixelYMirror = { x, y: yy };
}

function paintXYMirror(x: number, y: number, frame: Frame, pixel_size: number, display_size: number, penSize: number) {
  const xx = display_size / 2 + (display_size / 2 - x);
  const yy = display_size / 2 + (display_size / 2 - y);

  const xyMirrorIndex = (xx + yy * display_size) * 4;

  if (xyMirrorIndex < 0 || xyMirrorIndex + 3 > display_size * display_size * 4) {
    return;
  }

  frame.pixels[xyMirrorIndex] = 0;
  frame.pixels[xyMirrorIndex + 1] = 0;
  frame.pixels[xyMirrorIndex + 2] = 0;
  frame.pixels[xyMirrorIndex + 3] = 0;

  paintNeighbors(xyMirrorIndex, frame, penSize, display_size);

  //build path from last pixel to current pixel
  if (frame.lastPixelXYMirror != null) {
    let path = bresenhamsAlgorithm(frame.lastPixelXYMirror!, { x: xx, y: yy }, pixel_size, display_size);
    for (let p of path) {
      const index = (p.x + display_size * p.y) * 4;
      frame.pixels[index] = 0;
      frame.pixels[index + 1] = 0;
      frame.pixels[index + 2] = 0;
      frame.pixels[index + 3] = 0;

      paintNeighbors(index, frame, penSize, display_size);
    }
  }

  frame.lastPixelXYMirror = { x: xx, y: yy };
}
