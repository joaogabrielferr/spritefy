import Mouse from '../scene/Mouse';
import Scene from '../scene/Scene';
import { toHex, toRGB } from '../utils/colorConverters';

export function PaintBucket(
  scene: Scene,
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
  if (scene.pixels[index + 3]) {
    startColor = toHex([scene.pixels[index], scene.pixels[index + 1], scene.pixels[index + 2]]);
  }

  const numPixels = display_size * display_size + 1;
  // const visited: boolean[] = [];
  // for (let i = 0; i <= numPixels; i++) visited.push(false);
  const visited = new Array(numPixels).fill(false);
  bfs(scene, { x, y }, visited, selectedColor, startColor, display_size);

  const imageData = new ImageData(scene.pixels, display_size, display_size);
  ctx.putImageData(imageData, 0, 0);
  scene.changed = true;
}

//breadth first search
function bfs(
  scene: Scene,
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

    scene.pixels[index] = rgb[0];
    scene.pixels[index + 1] = rgb[1];
    scene.pixels[index + 2] = rgb[2];
    scene.pixels[index + 3] = 255;

    for (let a = -1; a <= 1; a++) {
      if (a === 0) continue;

      if (u.x + a >= 0 && u.x + a < display_size) {
        const neighborIndex = (u.x + a + display_size * u.y) * 4;
        if (neighborIndex <= display_size * display_size * 4 && canVisitNeighbor(neighborIndex, visited, startColor, scene)) {
          queue.push({ x: u.x + a, y: u.y });
          visited[neighborIndex / 4] = true;
        }
      }

      if (u.y + a >= 0 && u.y + a < display_size) {
        const neighborIndex = (u.x + display_size * (u.y + a)) * 4;
        if (neighborIndex <= display_size * display_size * 4 && canVisitNeighbor(neighborIndex, visited, startColor, scene)) {
          queue.push({ x: u.x, y: u.y + a });
          visited[neighborIndex / 4] = true;
        }
      }
    }
  }
}

function canVisitNeighbor(neighborIndex: number, visited: boolean[], startColor: string | undefined, scene: Scene) {
  //return visited[neighbor.id] === false && (neighbor.colorStack.top() === startColor || neighbor.colorStack.top() === ERASING || (BG_COLORS.includes(startColor) && neighbor.colorStack.isEmpty()) || (startColor === ERASING && neighbor.colorStack.isEmpty() ));

  const neighborColor = toHex([scene.pixels[neighborIndex], scene.pixels[neighborIndex + 1], scene.pixels[neighborIndex + 2]]);

  const notPainted = scene.pixels[neighborIndex + 3] === 0;
  return !visited[neighborIndex / 4] && ((neighborColor === startColor && !notPainted) || (!startColor && notPainted));

  return false;

  // return (
  //   !visited[neighbor.id] &&
  //   (neighbor.colorStack.top() === startColor ||
  //     (BG_COLORS.includes(startColor) &&
  //       (neighbor.colorStack.isEmpty() ||
  //         neighbor.colorStack.top() === ERASING ||
  //         (neighbor.colorStack.top() && BG_COLORS.includes(neighbor.colorStack.top()!)))) ||
  //     (startColor === ERASING &&
  //       (neighbor.colorStack.isEmpty() || (neighbor.colorStack.top() && BG_COLORS.includes(neighbor.colorStack.top()!)))))
  // );
}
