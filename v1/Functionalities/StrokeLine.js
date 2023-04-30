import { buildPath } from "./Helpers/BuildPath";

export function StrokeLine(event, eventtype, isMousePressed, lastPixel, PIXEL_SIZE, DISPLAY_SIZE, pixels, c, penSize, selectedColor, currentPixelsMousePressed, currentScale, panX, panY, matrix, x, y, pivot) {
  const draw = [];

  //transforming mouse coordinates in world coordinates
  let xs = parseInt((x - panX) / currentScale);
  let ys = parseInt((y - panY) / currentScale);

  if (xs > DISPLAY_SIZE || xs < 0 || ys > DISPLAY_SIZE || ys < 0) return;
  //   if (x > currSize || x < 0 || y > currSize || y < 0) return;
  let pixel = null;
  let flag = false;
  let idxi, idxj;
  for (let i = 0; i < pixels.length; i++) {
    if (flag) break;
    for (let j = 0; j < pixels[i].length; j++) {
      if (xs >= pixels[i][j].x1 && xs < pixels[i][j].x2 && ys >= pixels[i][j].y1 && ys < pixels[i][j].y2) {
        pixel = pixels[i][j];
        idxi = i;
        idxj = j;
        flag = true;
        break;
      }
    }
  }

  const path = buildPath(pixels, pivot, pixel, PIXEL_SIZE);

  return [pivot, ...path];
}
