import Mouse from '../scene/Mouse';
import Scene from '../scene/Scene';
import { toHex } from '../utils/colorConverters';

//return the color of a pixel
export function Dropper(scene: Scene, mouse: Mouse, pixel_size: number, display_size: number) {
  const x = Math.floor(mouse.x);
  const y = Math.floor(mouse.y);

  if (x > display_size || x < 0 || y > display_size || y < 0) {
    return null;
  }

  const index = (x + display_size * y) * 4;

  if (scene.pixels[index + 3] === 0) return null;

  const rgb = [scene.pixels[index], scene.pixels[index + 1], scene.pixels[index + 2]];
  return toHex(rgb);
}
