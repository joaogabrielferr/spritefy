import { buildPath } from "./Helpers/BuildPath.js";

export const Eraser = (event, eventtype, isMousePressed, lastPixel, PIXEL_SIZE, DISPLAY_SIZE, pixels, c, penSize, panX, panY, currentScale, x, y) => {
  if (!isMousePressed) return;
  const bounding = canvas.getBoundingClientRect();

  // if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && (eventtype === "touchstart" || eventtype === "touchmove")) {
  //   x = event.touches[0].clientX - bounding.left;
  //   y = event.touches[0].clientY - bounding.top;
  // } else {
  //   x = event.clientX - bounding.left;
  //   y = event.clientY - bounding.top;
  // }

  x = parseInt((x - panX) / currentScale);
  y = parseInt((y - panY) / currentScale);

  if (x > PIXEL_SIZE * DISPLAY_SIZE || x < 0 || y > PIXEL_SIZE * DISPLAY_SIZE || y < 0) return;

  let pixel = null;
  let flag = false;
  let idxi, idxj;
  for (let i = 0; i < pixels.length; i++) {
    if (flag) break;
    for (let j = 0; j < pixels[i].length; j++) {
      if (x >= pixels[i][j].x1 && x < pixels[i][j].x2 && y >= pixels[i][j].y1 && y < pixels[i][j].y2) {
        pixel = pixels[i][j];
        idxi = i;
        idxj = j;
        flag = true;
        break;
      }
    }
  }

  if (pixel != null) {
    // c.clearRect(pixel.x1, pixel.y1, penSize, penSize);
    c.fillStyle = pixel.bgColor;
    c.fillRect(pixel.x1, pixel.y1, penSize, penSize);
    pixel.color = pixel.bgColor;

    if (lastPixel.value !== null && isMousePressed && lastPixel.value.id !== pixel.id && (eventtype === "mousemove" || eventtype === "touchmove")) {
      const path = buildPath(pixels, lastPixel, pixel, PIXEL_SIZE);
      for (let p of path) {
        // c.clearRect(p.x1, p.y1, penSize, penSize);
        c.fillStyle = pixel.bgColor;
        c.fillRect(pixel.x1, pixel.y1, penSize, penSize);
        pixel.color = pixel.bgColor;
        pixel.painted = false;
      }
    }
    lastPixel.value = pixel;
  }
};
