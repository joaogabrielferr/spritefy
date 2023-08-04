//given a start and a end pixel, find all necessary pixels to draw a ractangule box
export function completeRectangle(
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

function findAndPush(a: number, b: number, pixel_size: number, path: { x: number; y: number }[], display_size: number) {
  if (a >= 0 && a < display_size && b >= 0 && b < display_size) {
    path.push({ x: Math.floor(a), y: Math.floor(b) });
  }
}
