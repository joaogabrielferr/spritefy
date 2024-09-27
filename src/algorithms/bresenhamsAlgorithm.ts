//algorithm for finding which pixels to color in order to create a straight line between two points
//used in Line tool, also used to close gaps in Pencil tool and eraser tool(mousemove event handler doenst fire fast enough when moving the mouse to fast, leaving some gaps)

export function bresenhamsAlgorithm(
  start: { x: number; y: number },
  end: { x: number; y: number },
  pixel_size: number,
  display_size: number
) {
  if (!start || !end) return [];
  const path: { x: number; y: number }[] = [];

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
    if (x0 < 0 || y0 < 0 || x0 >= display_size || y0 >= display_size) {
      break;
    }

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
