export function getPixelOnMousePosition(pixels, x, y, currentScale, panX, panY, DISPLAY_SIZE) {
  let xs = parseInt((x - panX) / currentScale);
  let ys = parseInt((y - panY) / currentScale);
  // console.log(matrix);
  // let xs = x * matrix[0] + y * matrix[2] + matrix[4];
  // let ys = x * matrix[1] + y * matrix[3] + matrix[4];

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

  return pixel;
}
