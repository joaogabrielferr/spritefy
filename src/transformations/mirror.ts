import Frame from '../Scene/Frame';
import { ArrayIndexToCanvasCoordinates } from '../utils/indexConverters';

//flip the canvas in the x axis
export function MirrorX(frame: Frame, display_size: number, ctx: CanvasRenderingContext2D) {
  const newArray = new Uint8ClampedArray(frame.pixels);

  for (let i = 0; i < frame.pixels.length; i += 4) {
    const { x, y } = ArrayIndexToCanvasCoordinates(i, display_size);
    const newIndex = (display_size / 2 + (display_size / 2 - x) + display_size * y) * 4;
    newArray[newIndex] = frame.pixels[i];
    newArray[newIndex + 1] = frame.pixels[i + 1];
    newArray[newIndex + 2] = frame.pixels[i + 2];
    newArray[newIndex + 3] = frame.pixels[i + 3];
  }

  const imageData = new ImageData(newArray, display_size, display_size);

  ctx.putImageData(imageData, 0, 0);

  frame.pixels = newArray;

  frame.undoStack.push(new Uint8ClampedArray(newArray));

  frame.changed = true;
}

//flip the canvas in the y axis
export function MirrorY(frame: Frame, display_size: number, ctx: CanvasRenderingContext2D) {
  const newArray = new Uint8ClampedArray(frame.pixels);

  for (let i = 0; i < frame.pixels.length; i += 4) {
    const { x, y } = ArrayIndexToCanvasCoordinates(i, display_size);

    const yy = display_size / 2 + (display_size / 2 - y);

    const newIndex = (x + yy * display_size) * 4;

    newArray[newIndex] = frame.pixels[i];
    newArray[newIndex + 1] = frame.pixels[i + 1];
    newArray[newIndex + 2] = frame.pixels[i + 2];
    newArray[newIndex + 3] = frame.pixels[i + 3];
  }

  const imageData = new ImageData(newArray, display_size, display_size);

  ctx.putImageData(imageData, 0, 0);

  frame.pixels = newArray;

  frame.undoStack.push(new Uint8ClampedArray(newArray));

  frame.changed = true;
}
