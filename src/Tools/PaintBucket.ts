import Frame from '../Scene/Frame';
import Mouse from '../Scene/Mouse';
import { toHex, toRGB } from '../utils/colorConverters';

export function PaintBucket(
  frame: Frame,
  mouse: Mouse,
  pixel_size: number,
  display_size: number,
  ctx: CanvasRenderingContext2D,
  selectedColor: string
) {
  if (!mouse.isPressed) return;

  // const [x,y] = mouse.toWorldCoordinates(currentScale);
  const x = Math.floor(mouse.x);
  const y = Math.floor(mouse.y);

  if (x > pixel_size * display_size || x < 0 || y > pixel_size * display_size || y < 0) return [];

  const index = (x + display_size * y) * 4;

  let startColor = undefined;
  if (frame.pixels[index + 3]) {
    startColor = toHex([frame.pixels[index], frame.pixels[index + 1], frame.pixels[index + 2]]);
  }

  const numPixels = display_size * display_size + 1;
  // const visited: boolean[] = [];
  // for (let i = 0; i <= numPixels; i++) visited.push(false);
  const visited = new Array(numPixels).fill(false);
  bfs(frame, { x, y }, visited, selectedColor, startColor, display_size);

  const imageData = new ImageData(frame.pixels, display_size, display_size);
  ctx.putImageData(imageData, 0, 0);
  frame.changed = true;
}

//breadth first search
function bfs(
  frame: Frame,
  u: { x: number; y: number },
  visited: boolean[],
  selectedColor: string,
  startColor: string | undefined,
  display_size: number
) {
  //visited have only one position per pixel, no need to multiply by 4
  const visitedIndex = u.x + display_size * u.y;
  visited[visitedIndex] = true;

  const rgb = toRGB(selectedColor);

  const queue: { x: number; y: number }[] = [];
  queue.push(u);
  while (queue.length > 0) {
    u = queue.shift()!;
    const index = (u.x + display_size * u.y) * 4;

    frame.pixels[index] = rgb[0];
    frame.pixels[index + 1] = rgb[1];
    frame.pixels[index + 2] = rgb[2];
    frame.pixels[index + 3] = 255;

    for (let a = -1; a <= 1; a++) {
      if (a === 0) continue;

      if (u.x + a >= 0 && u.x + a < display_size) {
        const neighborIndex = (u.x + a + display_size * u.y) * 4;
        if (neighborIndex <= display_size * display_size * 4 && canVisitNeighbor(neighborIndex, visited, startColor, frame)) {
          queue.push({ x: u.x + a, y: u.y });
          visited[neighborIndex / 4] = true;
        }
      }

      if (u.y + a >= 0 && u.y + a < display_size) {
        const neighborIndex = (u.x + display_size * (u.y + a)) * 4;
        if (neighborIndex <= display_size * display_size * 4 && canVisitNeighbor(neighborIndex, visited, startColor, frame)) {
          queue.push({ x: u.x, y: u.y + a });
          visited[neighborIndex / 4] = true;
        }
      }
    }
  }
}

function canVisitNeighbor(neighborIndex: number, visited: boolean[], startColor: string | undefined, frame: Frame) {
  const neighborColor = toHex([frame.pixels[neighborIndex], frame.pixels[neighborIndex + 1], frame.pixels[neighborIndex + 2]]);

  const notPainted = frame.pixels[neighborIndex + 3] === 0;
  return !visited[neighborIndex / 4] && ((neighborColor === startColor && !notPainted) || (!startColor && notPainted));
}
