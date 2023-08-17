import Mouse from '../scene/Mouse';
import Scene from '../scene/Frame';
import { toHex } from '../utils/colorConverters';
import Frame from '../scene/Frame';

//return the color of a pixel
export function Dropper(frame: Frame, mouse: Mouse, pixel_size: number, display_size: number) {
  const x = Math.floor(mouse.x);
  const y = Math.floor(mouse.y);

  if (x > display_size || x < 0 || y > display_size || y < 0) {
    return null;
  }

  const index = (x + display_size * y) * 4;

  if (frame.pixels[index + 3] === 0) return null;

  const rgb = [frame.pixels[index], frame.pixels[index + 1], frame.pixels[index + 2]];
  return toHex(rgb);
}
