import { buildPath } from "./Helpers/BuildPath.js";

export const Pen = (event, eventtype, isMousePressed, lastPixel, PIXEL_SIZE, DISPLAY_SIZE, pixels, c, penSize, selectedColor, currentPixelsMousePressed, currentScale, panX, panY, matrix, x, y) => {
  if (!isMousePressed) return;

  // console.log(currentPixelsMousePressed);
  // console.log(lastPixel);

  const draw = []; //pixels drawn in the screen here

  const bounding = canvas.getBoundingClientRect();

  // if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && (eventtype === "touchstart" || eventtype === "touchmove")) {
  //   x = event.touches[0].clientX - bounding.left;
  //   y = event.touches[0].clientY - bounding.top;
  // } else {
  //   x = event.clientX - bounding.left;
  //   y = event.clientY - bounding.top;
  // }

  //transforming mouse coordinates in world coordinates
  let xs = parseInt((x - panX) / currentScale);
  let ys = parseInt((y - panY) / currentScale);
  // console.log(matrix);
  // let xs = x * matrix[0] + y * matrix[2] + matrix[4];
  // let ys = x * matrix[1] + y * matrix[3] + matrix[4];

  console.log(x, y, xs, ys);

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

  //if this pixel is in currentPixels, that means it was already painted in the current stroke (user is moving the mouse after clicking one of its buttons and holding it)
  if (pixel != null && !isPixelAlreadyPaintedInCurrentDraw(pixel, currentPixelsMousePressed)) {
    pixel.color = selectedColor.value;
    pixel.painted = true;
    pixel.numOfPaints++;
    pixel.colorStack.push(selectedColor.value);

    // currentPixelsMousePressed.value.push(pixel);
    currentPixelsMousePressed.value.set(pixel.id, true);
    //console.log(pixel.x1, pixel.y1, penSize);

    c.fillStyle = selectedColor.value;
    c.fillRect(pixel.x1, pixel.y1, penSize, penSize);
    // c.fillRect(pixel.x1 * currentScale + panX, pixel.y1 * currentScale + panY, penSize * currentScale, penSize * currentScale);

    draw.push(pixel);

    //coloring neighbor fake pixels based on pen size
    if (penSize == PIXEL_SIZE * 2) {
      paintPixelSize2(pixel, pixels, DISPLAY_SIZE, currentPixelsMousePressed, selectedColor, draw);
    }

    if (penSize == PIXEL_SIZE * 3) {
      paintPixelsSize3(pixel, pixels, DISPLAY_SIZE, currentPixelsMousePressed, selectedColor, draw);
    }

    if (lastPixel.value !== null && isMousePressed && lastPixel.value.id !== pixel.id && (eventtype == "mousemove" || "touchmove")) {
      //build path from last pixel to current pixel
      const path = buildPath(pixels, lastPixel, pixel, PIXEL_SIZE);
      for (let p of path) {
        if (!isPixelAlreadyPaintedInCurrentDraw(p, currentPixelsMousePressed)) {
          c.fillStyle = selectedColor.value;
          c.fillRect(p.x1, p.y1, penSize, penSize);
          // c.fillRect(p.x1 * currentScale + panX, p.y1 * currentScale + panY, penSize * currentScale, penSize * currentScale);

          p.color = selectedColor.value;
          p.painted = true;
          p.numOfPaints++;
          p.colorStack.push(selectedColor.value);
          // currentPixelsMousePressed.value.push(p);
          currentPixelsMousePressed.value.set(p.id, true);
          draw.push(p);

          if (penSize == PIXEL_SIZE * 2) {
            paintPixelSize2(p, pixels, DISPLAY_SIZE, currentPixelsMousePressed, selectedColor, draw);
          }

          if (penSize == PIXEL_SIZE * 3) {
            paintPixelsSize3(p, pixels, DISPLAY_SIZE, currentPixelsMousePressed, selectedColor, draw);
          }
        }
      }
    }

    lastPixel.value = pixel;

    return draw;
  }
};

const isPixelAlreadyPaintedInCurrentDraw = (pixel, currentPixelsMousePressed) => {
  return currentPixelsMousePressed.value.get(pixel.id);
};

const paintPixelSize2 = (refPixel, pixels, DISPLAY_SIZE, currentPixelsMousePressed, selectedColor, draw) => {
  const jp1 = refPixel.j + 1 <= DISPLAY_SIZE && refPixel.j + 1 >= 0;
  const ip1 = refPixel.i + 1 <= DISPLAY_SIZE && refPixel.i + 1 >= 0;
  if (jp1 && !isPixelAlreadyPaintedInCurrentDraw(pixels[refPixel.i][refPixel.j + 1], currentPixelsMousePressed)) {
    pixels[refPixel.i][refPixel.j + 1].color = selectedColor.value;
    pixels[refPixel.i][refPixel.j + 1].painted = true;
    pixels[refPixel.i][refPixel.j + 1].numOfPaints++;
    pixels[refPixel.i][refPixel.j + 1].colorStack.push(selectedColor.value);
    draw.push(pixels[refPixel.i][refPixel.j + 1]);
    currentPixelsMousePressed.value.set(pixels[refPixel.i][refPixel.j + 1].id, true);
  }
  if (ip1 && !isPixelAlreadyPaintedInCurrentDraw(pixels[refPixel.i + 1][refPixel.j], currentPixelsMousePressed)) {
    pixels[refPixel.i + 1][refPixel.j].color = selectedColor.value;
    pixels[refPixel.i + 1][refPixel.j].painted = true;
    pixels[refPixel.i + 1][refPixel.j].numOfPaints++;
    pixels[refPixel.i + 1][refPixel.j].colorStack.push(selectedColor.value);
    draw.push(pixels[refPixel.i + 1][refPixel.j]);
    currentPixelsMousePressed.value.set(pixels[refPixel.i + 1][refPixel.j].id, true);
  }
  if (jp1 + ip1 && !isPixelAlreadyPaintedInCurrentDraw(pixels[refPixel.i + 1][refPixel.j + 1], currentPixelsMousePressed)) {
    pixels[refPixel.i + 1][refPixel.j + 1].color = selectedColor.value;
    pixels[refPixel.i + 1][refPixel.j + 1].painted = true;
    pixels[refPixel.i + 1][refPixel.j + 1].numOfPaints;
    pixels[refPixel.i + 1][refPixel.j + 1].colorStack.push(selectedColor.value);
    draw.push(pixels[refPixel.i + 1][refPixel.j + 1]);
    currentPixelsMousePressed.value.set(pixels[refPixel.i + 1][refPixel.j + 1].id, true);
  }
};

const paintPixelsSize3 = (refPixel, pixels, DISPLAY_SIZE, currentPixelsMousePressed, selectedColor, draw) => {
  for (let a = 0; a <= 2; a++) {
    for (let b = 0; b <= 2; b++) {
      if (a === 0 && b === 0) continue;
      if (refPixel.i + a <= DISPLAY_SIZE && refPixel.i + a >= 0 && refPixel.j + b <= DISPLAY_SIZE && refPixel.j + b >= 0 && !isPixelAlreadyPaintedInCurrentDraw(pixels[refPixel.i + a][refPixel.j + b], currentPixelsMousePressed)) {
        pixels[refPixel.i + a][refPixel.j + b].color = selectedColor.value;
        pixels[refPixel.i + a][refPixel.j + b].painted = true;
        pixels[refPixel.i + a][refPixel.j + b].numOfPaints++;
        pixels[refPixel.i + a][refPixel.j + b].colorStack.push(selectedColor.value);
        draw.push(pixels[refPixel.i + a][refPixel.j + b]);
        currentPixelsMousePressed.value.set(pixels[refPixel.i + a][refPixel.j + b].id, true);
      }
    }
  }
};
