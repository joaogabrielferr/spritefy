import { Pixel } from '../types';
import Scene from './Scene';

//set of algorithms to complete a path given a start and an end point

//algorithm for finding the necessary points to create a close approximation of a straight line between two points
//used in Line tool, also used to close gaps in Pencil tool and eraser tool(mousemove event handler doenst fire fast enough when moving the mouse to fast, leaving some gaps)
export function bresenhamsAlgorithm(
  start: { x: number; y: number },
  end: { x: number; y: number },
  pixel_size: number,
  display_size: number
) {
  if (!start || !end) return [];
  const path: { x: number; y: number }[] = [];
  const m = new Map<number, boolean>();

  let x0 = start.x;
  let y0 = start.y;
  let x = end.x;
  let y = end.y;

  let dx = Math.abs(x - x0);
  let dy = Math.abs(y - y0);
  let sx = x0 < x ? 1 : -1;
  let sy = y0 < y ? 1 : -1;
  let E = dx - dy;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    //const p = scene.findPixel(x0, y0, pixel_size);
    if (x0 < 0 || y0 < 0 || x0 >= display_size || y0 >= display_size) {
      break;
    }
    // if (!p) break;
    // if (!m.get(p.id)) {
    //   path.push(p);
    //   m.set(p.id, true);
    // }
    path.push({ x: x0, y: y0 });

    if (x0 == x && y0 == y) break;
    let e2 = 2 * E;

    if (e2 > -dy) {
      E -= dy;
      x0 += sx * pixel_size;
    }

    if (e2 < dx) {
      E += dx;
      y0 += sy * pixel_size;
    }
  }

  return path;
}

//given a start and a end pixel, find all necessary pixels to draw a ractangule box
export function completeSquare(
  start: { x: number; y: number },
  end: { x: number; y: number },
  pixel_size: number,
  display_size: number
) {
  const path: { x: number; y: number }[] = [];

  if (start.x <= end.x) {
    for (let i = start.x; i <= end.x; i += pixel_size) {
      findAndPush(i, start.y, pixel_size, path, display_size);
      findAndPush(i, end.y, pixel_size, path, display_size);
    }
  }

  if (start.x > end.x) {
    for (let i = end.x; i <= start.x; i += pixel_size) {
      findAndPush(i, start.y, pixel_size, path, display_size);
      findAndPush(i, end.y, pixel_size, path, display_size);
    }
  }

  if (start.y <= end.y) {
    for (let i = start.y; i <= end.y; i += pixel_size) {
      findAndPush(start.x, i, pixel_size, path, display_size);
      findAndPush(end.x, i, pixel_size, path, display_size);
    }
  }

  if (start.y > end.y) {
    for (let i = end.y; i <= start.y; i += pixel_size) {
      findAndPush(start.x, i, pixel_size, path, display_size);
      findAndPush(end.x, i, pixel_size, path, display_size);
    }
  }

  return path;
}

//function to find all necessary points to draw an elipse given its middle point and the major and minor radius
export function drawElipse(
  midPoint: { x: number; y: number },
  majorRadius: number,
  minorRadius: number,
  scene: Scene,
  pixel_size: number,
  display_size: number
) {
  const path: { x: number; y: number }[] = [];

  let rx = majorRadius;
  let ry = minorRadius;
  let xc = midPoint.x;
  let yc = midPoint.y;

  let dx, dy, d1, d2, x, y;

  x = 0;
  y = ry;

  d1 = ry * ry - rx * rx * ry + 0.25 * rx * rx;
  dx = 2 * ry * ry * x;
  dy = 2 * rx * rx * y;

  while (dx < dy) {
    // Print points based on 4-way symmetry
    findAndPush(x + xc, y + yc, pixel_size, path, display_size);
    findAndPush(-x + xc, y + yc, pixel_size, path, display_size);
    findAndPush(x + xc, -y + yc, pixel_size, path, display_size);
    findAndPush(-x + xc, -y + yc, pixel_size, path, display_size);

    if (d1 < 0) {
      x++;
      dx = dx + 2 * ry * ry;
      d1 = d1 + dx + ry * ry;
    } else {
      x++;
      y--;
      dx = dx + 2 * ry * ry;
      dy = dy - 2 * rx * rx;
      d1 = d1 + dx - dy + ry * ry;
    }
  }

  d2 = ry * ry * ((x + 0.5) * (x + 0.5)) + rx * rx * ((y - 1) * (y - 1)) - rx * rx * ry * ry;

  while (y >= 0) {
    // Print points based on 4-way symmetry
    findAndPush(x + xc, y + yc, pixel_size, path, display_size);
    findAndPush(-x + xc, y + yc, pixel_size, path, display_size);
    findAndPush(x + xc, -y + yc, pixel_size, path, display_size);
    findAndPush(-x + xc, -y + yc, pixel_size, path, display_size);

    if (d2 > 0) {
      y--;
      dy = dy - 2 * rx * rx;
      d2 = d2 + rx * rx - dy;
    } else {
      y--;
      x++;
      dx = dx + 2 * ry * ry;
      dy = dy - 2 * rx * rx;
      d2 = d2 + dx - dy + rx * rx;
    }
  }

  return path;
}

function findAndPush(a: number, b: number, pixel_size: number, path: { x: number; y: number }[], display_size: number) {
  if (a >= 0 && a < display_size && b >= 0 && b < display_size) {
    path.push({ x: Math.floor(a), y: Math.floor(b) });
  }

  // const pixel = scene.findPixel(a, b, pixel_size);
  // if (pixel) {
  //   path.push(pixel);
  // }
}

//given a start and a end pixel, find all necessary pixels to draw a ractangule box
export function completeClosedRectangle(
  start: { x: number; y: number },
  end: { x: number; y: number },
  pixel_size: number,
  display_size: number
) {
  const path: { x: number; y: number }[] = [];

  if (start.x <= end.x) {
    for (let i = start.x; i <= end.x; i += pixel_size) {
      for (let j = start.y; j <= end.y; j += pixel_size) {
        findAndPush(i, j, pixel_size, path, display_size);
      }
      // findAndPush(i, start.y, pixel_size, path, display_size);
      // findAndPush(i, end.y, pixel_size, path, display_size);
    }
  }

  if (start.x > end.x) {
    for (let i = end.x; i <= start.x; i += pixel_size) {
      for (let j = start.y; j <= end.y; j += pixel_size) {
        findAndPush(i, j, pixel_size, path, display_size);
      }
      // findAndPush(i, start.y, pixel_size, path, display_size);
      // findAndPush(i, end.y, pixel_size, path, display_size);
    }
  }

  if (start.y <= end.y) {
    for (let i = start.y; i <= end.y; i += pixel_size) {
      for (let j = start.x; j <= end.x; j += pixel_size) {
        findAndPush(j, i, pixel_size, path, display_size);
      }
      // findAndPush(start.x, i, pixel_size, path, display_size);
      // findAndPush(end.x, i, pixel_size, path, display_size);
    }
  }

  if (start.y > end.y) {
    for (let i = end.y; i <= start.y; i += pixel_size) {
      if (end.x > start.x) {
        for (let j = start.x; j <= end.x; j += pixel_size) {
          findAndPush(j, i, pixel_size, path, display_size);
        }
      } else {
        for (let j = end.x; j <= start.x; j += pixel_size) {
          findAndPush(j, i, pixel_size, path, display_size);
        }
      }
      // findAndPush(start.x, i, pixel_size, path, display_size);
      // findAndPush(end.x, i, pixel_size, path, display_size);
    }
  }

  return path;
}
