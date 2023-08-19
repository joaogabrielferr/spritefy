import Frame from '../scene/Frame';
import { ArrayIndexToCanvasCoordinates } from '../utils/indexConverters';

export function ClockwiseRotation(frame: Frame, ctx: CanvasRenderingContext2D, displaySize: number) {
  const newArray = new Uint8ClampedArray(frame.pixels);

  for (let i = 0; i < frame.pixels.length; i += 4) {
    const { x, y } = ArrayIndexToCanvasCoordinates(i, displaySize);

    const rotatedY = x;
    const rotatedX = displaySize - y - 1;
    const rotatedIndex = (rotatedY * displaySize + rotatedX) * 4;

    newArray[rotatedIndex] = frame.pixels[i];
    newArray[rotatedIndex + 1] = frame.pixels[i + 1];
    newArray[rotatedIndex + 2] = frame.pixels[i + 2];
    newArray[rotatedIndex + 3] = frame.pixels[i + 3];
  }

  const imageData = new ImageData(newArray, displaySize, displaySize);

  ctx.putImageData(imageData, 0, 0);

  frame.pixels = newArray;

  frame.undoStack.push(new Uint8ClampedArray(newArray));

  frame.changed = true;
}
