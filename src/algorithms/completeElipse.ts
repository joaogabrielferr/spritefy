import Scene from '../scene/Frame';

//function to find all necessary points to draw an elipse given its middle point and the major and minor radius
export function completeElipse(
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
}
