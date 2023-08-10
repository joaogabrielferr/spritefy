import Mouse from '../scene/Mouse';
import Scene from '../scene/Scene';
import { bresenhamsAlgorithm } from '../algorithms/bresenhamsAlgorithm';

export function Eraser(
  eventName: string,
  mouse: Mouse,
  scene: Scene,
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

  scene.pixels[index] = 0;
  scene.pixels[index + 1] = 0;
  scene.pixels[index + 2] = 0;
  scene.pixels[index + 3] = 0;

  paintNeighbors(index, scene, penSize, display_size);

  //if there are gaps between the points, fill them with bresenham's algorithm (see scene/buildPath.ts)

  if (scene.lastPixel !== null) {
    //build path from last pixel to current pixel
    const path = bresenhamsAlgorithm(scene.lastPixel!, { x, y }, pixel_size, display_size);
    for (let p of path) {
      const index = (p.x + display_size * p.y) * 4;

      scene.pixels[index] = 0;
      scene.pixels[index + 1] = 0;
      scene.pixels[index + 2] = 0;
      scene.pixels[index + 3] = 0;

      paintNeighbors(index, scene, penSize, display_size);
    }
  }

  if (xMirror) {
    paintXMirror(x, y, scene, pixel_size, display_size, penSize);
  }

  if (yMirror) {
    paintYMirror(x, y, scene, pixel_size, display_size, penSize);
  }

  if (xMirror && yMirror) {
    paintXYMirror(x, y, scene, pixel_size, display_size, penSize);
  }

  scene.lastPixel = { x, y };
  //}

  const imageData = new ImageData(scene.pixels, display_size, display_size);

  ctx.putImageData(imageData, 0, 0);

  scene.changed = true;
}

function paintNeighbors(index: number, scene: Scene, penSize: number, display_size: number) {
  let neighbors: number[] = scene.findNeighbors(index, penSize, display_size);
  for (let n of neighbors) {
    scene.pixels[n] = 0;
    scene.pixels[n + 1] = 0;
    scene.pixels[n + 2] = 0;
    scene.pixels[n + 3] = 0;
  }
}

function paintXMirror(
  x: number,
  y: number,
  scene: Scene,
  pixel_size: number,
  display_size: number,

  penSize: number
) {
  const xMirrorIndex = (display_size / 2 + (display_size / 2 - x) + display_size * y) * 4;

  if (xMirrorIndex < 0 || xMirrorIndex + 3 > display_size * display_size * 4) {
    return;
  }

  scene.pixels[xMirrorIndex] = 0;
  scene.pixels[xMirrorIndex + 1] = 0;
  scene.pixels[xMirrorIndex + 2] = 0;
  scene.pixels[xMirrorIndex + 3] = 0;

  paintNeighbors(xMirrorIndex, scene, penSize, display_size);

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
      scene.pixels[index] = 0;
      scene.pixels[index + 1] = 0;
      scene.pixels[index + 2] = 0;
      scene.pixels[index + 3] = 0;

      paintNeighbors(index, scene, penSize, display_size);
    }
  }

  scene.lastPixelXMirror = { x: display_size / 2 + (display_size / 2 - x), y };
}

function paintYMirror(x: number, y: number, scene: Scene, pixel_size: number, display_size: number, penSize: number) {
  const yy = display_size / 2 + (display_size / 2 - y);

  const yMirrorIndex = (x + yy * display_size) * 4;

  if (yMirrorIndex < 0 || yMirrorIndex + 3 > display_size * display_size * 4) {
    return;
  }

  scene.pixels[yMirrorIndex] = 0;
  scene.pixels[yMirrorIndex + 1] = 0;
  scene.pixels[yMirrorIndex + 2] = 0;
  scene.pixels[yMirrorIndex + 3] = 0;

  paintNeighbors(yMirrorIndex, scene, penSize, display_size);

  //build path from last pixel to current pixel
  if (scene.lastPixelYMirror != null) {
    let path = bresenhamsAlgorithm(scene.lastPixelYMirror!, { x, y: yy }, pixel_size, display_size);
    for (let p of path) {
      const index = (p.x + display_size * p.y) * 4;
      scene.pixels[index] = 0;
      scene.pixels[index + 1] = 0;
      scene.pixels[index + 2] = 0;
      scene.pixels[index + 3] = 0;

      paintNeighbors(index, scene, penSize, display_size);
    }
  }

  scene.lastPixelYMirror = { x, y: yy };
}

function paintXYMirror(x: number, y: number, scene: Scene, pixel_size: number, display_size: number, penSize: number) {
  const xx = display_size / 2 + (display_size / 2 - x);
  const yy = display_size / 2 + (display_size / 2 - y);

  const xyMirrorIndex = (xx + yy * display_size) * 4;

  if (xyMirrorIndex < 0 || xyMirrorIndex + 3 > display_size * display_size * 4) {
    return;
  }

  scene.pixels[xyMirrorIndex] = 0;
  scene.pixels[xyMirrorIndex + 1] = 0;
  scene.pixels[xyMirrorIndex + 2] = 0;
  scene.pixels[xyMirrorIndex + 3] = 0;

  paintNeighbors(xyMirrorIndex, scene, penSize, display_size);

  //build path from last pixel to current pixel
  if (scene.lastPixelXYMirror != null) {
    let path = bresenhamsAlgorithm(scene.lastPixelXYMirror!, { x: xx, y: yy }, pixel_size, display_size);
    for (let p of path) {
      const index = (p.x + display_size * p.y) * 4;
      scene.pixels[index] = 0;
      scene.pixels[index + 1] = 0;
      scene.pixels[index + 2] = 0;
      scene.pixels[index + 3] = 0;

      paintNeighbors(index, scene, penSize, display_size);
    }
  }

  scene.lastPixelXYMirror = { x: xx, y: yy };
}
