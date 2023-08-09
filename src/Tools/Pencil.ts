import Mouse from '../scene/Mouse';
import Scene from '../scene/Scene';
import { bresenhamsAlgorithm } from '../algorithms/bresenhamsAlgorithm';
import { toRGB } from '../utils/colorConverters';

export function Pencil(
  eventName: string,
  scene: Scene,
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

  scene.pixels[index] = rgb[0];
  scene.pixels[index + 1] = rgb[1];
  scene.pixels[index + 2] = rgb[2];
  scene.pixels[index + 3] = 255;

  paintNeighbors(index, scene, ctx, penSize, selectedColor, pixel_size, display_size);

  //build path from last pixel to current pixel
  if (scene.lastPixel != null) {
    let path = bresenhamsAlgorithm(scene.lastPixel!, { x: xs, y: ys }, pixel_size, display_size);
    for (let p of path) {
      const index = (p.x + display_size * p.y) * 4;
      scene.pixels[index] = rgb[0];
      scene.pixels[index + 1] = rgb[1];
      scene.pixels[index + 2] = rgb[2];
      scene.pixels[index + 3] = 255;

      paintNeighbors(index, scene, ctx, penSize, selectedColor, pixel_size, display_size);
    }
  }

  if (xMirror) {
    paintXMirror(xs, ys, scene, pixel_size, display_size, selectedColor, ctx, penSize);
  }

  if (yMirror) {
    paintYMirror(xs, ys, scene, pixel_size, display_size, selectedColor, ctx, penSize);
  }

  if (xMirror && yMirror) {
    paintXYMirror(xs, ys, scene, pixel_size, display_size, selectedColor, ctx, penSize);
  }

  scene.lastPixel = { x: xs, y: ys };

  const imageData = new ImageData(scene.pixels, display_size, display_size);

  ctx.putImageData(imageData, 0, 0);

  scene.changed = true;
}

function paintNeighbors(
  index: number,
  scene: Scene,
  ctx: CanvasRenderingContext2D,
  penSize: number,
  selectedColor: string,
  pixel_size: number,
  display_size: number
) {
  let neighbors: number[] = scene.findNeighbors(index, penSize, display_size);
  for (let n of neighbors) {
    const rgb = toRGB(selectedColor);

    scene.pixels[n] = rgb[0];
    scene.pixels[n + 1] = rgb[1];
    scene.pixels[n + 2] = rgb[2];
    scene.pixels[n + 3] = 255;
  }
}

function paintXMirror(
  x: number,
  y: number,
  scene: Scene,
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

  scene.pixels[xMirrorIndex] = rgb[0];
  scene.pixels[xMirrorIndex + 1] = rgb[1];
  scene.pixels[xMirrorIndex + 2] = rgb[2];
  scene.pixels[xMirrorIndex + 3] = 255;

  paintNeighbors(xMirrorIndex, scene, ctx, penSize, selectedColor, pixel_size, display_size);

  //build path from last pixel to current pixel
  if (scene.lastPixelXMirror != null) {
    let path = bresenhamsAlgorithm(
      scene.lastPixelXMirror!,
      { x: display_size / 2 + (display_size / 2 - x), y: y },
      pixel_size,
      display_size
    );
    for (let p of path) {
      const index = (p.x + display_size * p.y) * 4;
      scene.pixels[index] = rgb[0];
      scene.pixels[index + 1] = rgb[1];
      scene.pixels[index + 2] = rgb[2];
      scene.pixels[index + 3] = 255;

      paintNeighbors(index, scene, ctx, penSize, selectedColor, pixel_size, display_size);
    }
  }

  scene.lastPixelXMirror = { x: display_size / 2 + (display_size / 2 - x), y };
}

function paintYMirror(
  x: number,
  y: number,
  scene: Scene,
  pixel_size: number,
  display_size: number,
  selectedColor: string,
  ctx: CanvasRenderingContext2D,
  penSize: number
) {
  // const pixelYMirror: Pixel | null = scene.findPixel(xs, display_size / 2 + (display_size / 2 - ys), pixel_size);

  const yy = display_size / 2 + (display_size / 2 - y);

  const yMirrorIndex = (x + yy * display_size) * 4;

  if (yMirrorIndex < 0 || yMirrorIndex + 3 > display_size * display_size * 4) {
    return;
  }

  const rgb = toRGB(selectedColor);

  scene.pixels[yMirrorIndex] = rgb[0];
  scene.pixels[yMirrorIndex + 1] = rgb[1];
  scene.pixels[yMirrorIndex + 2] = rgb[2];
  scene.pixels[yMirrorIndex + 3] = 255;

  paintNeighbors(yMirrorIndex, scene, ctx, penSize, selectedColor, pixel_size, display_size);

  //build path from last pixel to current pixel
  if (scene.lastPixelYMirror != null) {
    let path = bresenhamsAlgorithm(scene.lastPixelYMirror!, { x, y: yy }, pixel_size, display_size);
    for (let p of path) {
      const index = (p.x + display_size * p.y) * 4;
      scene.pixels[index] = rgb[0];
      scene.pixels[index + 1] = rgb[1];
      scene.pixels[index + 2] = rgb[2];
      scene.pixels[index + 3] = 255;

      paintNeighbors(index, scene, ctx, penSize, selectedColor, pixel_size, display_size);
    }
  }

  scene.lastPixelYMirror = { x, y: yy };
}

function paintXYMirror(
  x: number,
  y: number,
  scene: Scene,
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

  scene.pixels[xyMirrorIndex] = rgb[0];
  scene.pixels[xyMirrorIndex + 1] = rgb[1];
  scene.pixels[xyMirrorIndex + 2] = rgb[2];
  scene.pixels[xyMirrorIndex + 3] = 255;

  paintNeighbors(xyMirrorIndex, scene, ctx, penSize, selectedColor, pixel_size, display_size);

  //build path from last pixel to current pixel
  if (scene.lastPixelXYMirror != null) {
    let path = bresenhamsAlgorithm(scene.lastPixelXYMirror!, { x: xx, y: yy }, pixel_size, display_size);
    for (let p of path) {
      const index = (p.x + display_size * p.y) * 4;
      scene.pixels[index] = rgb[0];
      scene.pixels[index + 1] = rgb[1];
      scene.pixels[index + 2] = rgb[2];
      scene.pixels[index + 3] = 255;

      paintNeighbors(index, scene, ctx, penSize, selectedColor, pixel_size, display_size);
    }
  }

  scene.lastPixelXYMirror = { x: xx, y: yy };
}
