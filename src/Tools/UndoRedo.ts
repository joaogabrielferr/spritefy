//the pixels drawn until I released the mouse are put in the undo stack
//if i press ctrl + z, select the pixels at the top of the undo stack, and remove then from the canvas
//after that, put theses pixels in the redo stack
//if i press ctrz + y, select the pixels at the top of the redo stack, and add then to the canvas
//after that, i put these pixels in the undo stack

import Frame from '../scene/Frame';

export function undoLastDraw(ctx: CanvasRenderingContext2D, frame: Frame, display_size: number) {
  if (frame.undoStack.isEmpty()) return;
  const mostRecentDraw = frame.undoStack.top();
  if (!mostRecentDraw) return;
  frame.undoStack.pop();

  frame.redoStack.push(mostRecentDraw);

  const drawToUse = frame.undoStack.top();

  if (drawToUse) {
    const imageData = new ImageData(new Uint8ClampedArray(drawToUse), display_size, display_size);
    ctx.putImageData(imageData, 0, 0);
    frame.pixels = ctx.getImageData(0, 0, display_size, display_size).data;
  } else {
    ctx.clearRect(0, 0, display_size, display_size);
    frame.pixels = ctx.getImageData(0, 0, display_size, display_size).data;
  }
}

export function redoLastDraw(ctx: CanvasRenderingContext2D, frame: Frame, display_size: number) {
  const mostRecentDraw = frame.redoStack.top();
  if (!mostRecentDraw) return;
  frame.redoStack.pop();

  const newArray = new Uint8ClampedArray(4 * display_size * display_size);

  for (let i = 0; i < mostRecentDraw.length; i++) {
    newArray[i] = mostRecentDraw[i];
  }

  const imageData = new ImageData(newArray, display_size, display_size);
  ctx.putImageData(imageData, 0, 0);
  frame.pixels = ctx.getImageData(0, 0, display_size, display_size).data;
  frame.undoStack.push(newArray);
}
