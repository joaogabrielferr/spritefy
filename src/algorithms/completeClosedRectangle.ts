//given a start and a end pixel, find all necessary pixels to draw a filled ractangle
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
    }
  }

  if (start.x > end.x) {
    for (let i = end.x; i <= start.x; i += pixel_size) {
      for (let j = start.y; j <= end.y; j += pixel_size) {
        findAndPush(i, j, pixel_size, path, display_size);
      }
    }
  }

  if (start.y <= end.y) {
    for (let i = start.y; i <= end.y; i += pixel_size) {
      for (let j = start.x; j <= end.x; j += pixel_size) {
        findAndPush(j, i, pixel_size, path, display_size);
      }
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
    }
  }

  return path;
}

function findAndPush(a: number, b: number, pixel_size: number, path: { x: number; y: number }[], display_size: number) {
  if (a >= 0 && a < display_size && b >= 0 && b < display_size) {
    path.push({ x: Math.floor(a), y: Math.floor(b) });
  }
}
