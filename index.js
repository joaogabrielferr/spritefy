import { Pen } from "./Functionalities/Pen.js";
import { Eraser } from "./Functionalities/Eraser.js";
import { PaintBucket } from "./Functionalities/PaintBucket.js";
import { undoStack } from "./Functionalities/UndoRedo.js";
import { undoLastDraw } from "./Functionalities/UndoRedo.js";
import { Stack } from "./Functionalities/Helpers/Stack.js";
import AdjustDisplaySize from "./Functionalities/Helpers/adjustDisplaySize.js";

//TODO, WHEN SCALING SUPER SMALL CANVAS (LIKE 10X10(100X100), INCREASE PIXEL SIZE)

//TODO: ADD NEIGHBORHOOD ERASING PIXEL*2 AND PIXEL*3 PEN SIZES
//TODO: DURING ERASING, IF PIXEL IS NOT PAINTED, DO NOT TO TRY TO CLEAR
//TODO: ADD CTRL Z UNDO TO PIXEL*2 AND PIXEL*3 PEN SIZES
//TODO: ADD CRTL Z UNDO TO ERASING
//TODO: ADD TYPESCRIPT

let canvas;
let ctx; //canvas context
let pixels = [];
let lastPixel = {
  value: null, //last pixel painted in the screen
};

//canvas transformation matrix
let matrix = [1, 0, 0, 1, 0, 0];

let currentDraw = {
  value: [], //current thing being painted in the canvas (the pixels painted using the pen, eraser of bucket)
};

let currentPixelsMousePressed = {
  value: new Map(), //current pixels painted while the user is moving the mouse with one of its buttons pressed
};

const colorSelectorElement = document.getElementById("colorSelector");

let selectedColor = {
  value: colorSelectorElement.value,
};

let currentPaintedMousePosition = null;
let currentXYPaintedPosition = null;

colorSelectorElement.addEventListener("change", (event) => {
  selectedColor.value = event.target.value;
});

const keyMap = new Map();
// let DISPLAY_SIZE = screensize - screensize * 0.1 - ((screensize - screensize * 0.1) % 100); //has to be divisible by 100
// let DISPLAY_SIZE = AdjustDisplaySize(window.innerWidth);
// let DISPLAY_SIZE = 800; //has to be divisible by 100
// let PIXEL_SIZE = DISPLAY_SIZE / 100;
const CANVAS_SIZE = 200;

let DISPLAY_SIZE;
let PIXEL_SIZE;

if (CANVAS_SIZE < 50) {
  DISPLAY_SIZE = CANVAS_SIZE * 10 * 10;
  PIXEL_SIZE = 10 * 10;
} else {
  DISPLAY_SIZE = CANVAS_SIZE * 10;
  PIXEL_SIZE = 10;
}

const SCALE_FACTOR = 2;

let zoomAmount = 0;
let currentScale = 1;

//current mouse position on cavas
let originX = 0,
  originY = 0;

let isMousePressed = false;
let painting = true;
let erasing = false;
let bucket = false;

const defaultPenSize = PIXEL_SIZE;
let penSize = PIXEL_SIZE;

let mousex = 0,
  mousey = 0;

let mousehistory = [];

window.addEventListener("load", () => {
  setUpCanvas();
  setUpPixelMatrix();
  draw();

  //SETTING UP DOWNLOAD BUTTON

  const botao = document.getElementById("button");
  botao.addEventListener("click", () => {
    let downloadLink = document.createElement("a");
    downloadLink.setAttribute("download", "pixelart(not realy).png");
    let dataURL = canvas.toDataURL("image/png");
    let url = dataURL.replace(/^data:image\/png/, "data:application/octet-stream");
    downloadLink.setAttribute("href", url);
    downloadLink.click();
  });

  //EVENT LISTENERS

  "mousedown touchstart".split(" ").forEach((eventName) =>
    canvas.addEventListener(eventName, (event) => {
      isMousePressed = true;
      if (painting) currentDraw.value.push(Pen(event, eventName, isMousePressed, lastPixel, PIXEL_SIZE, DISPLAY_SIZE, pixels, ctx, penSize, selectedColor, currentPixelsMousePressed, currentScale, originX, originY, matrix, mousex, mousey));
      else if (erasing) Eraser(event, eventName, isMousePressed, lastPixel, PIXEL_SIZE, DISPLAY_SIZE, pixels, ctx, penSize, originX, originY, currentScale, mousex, mousey);
      else if (bucket) currentDraw.value.push(PaintBucket(event, isMousePressed, selectedColor, PIXEL_SIZE, DISPLAY_SIZE, pixels, defaultPenSize, ctx, originX, originY, currentScale, CANVAS_SIZE));
      draw();
    })
  );

  "mousemove touchmove".split(" ").forEach((eventName) =>
    canvas.addEventListener(eventName, (event) => {
      const bounding = canvas.getBoundingClientRect();
      if (eventName === "touchmove") {
        mousex = event.touches[0].clientX - bounding.left;
        mousey = event.touches[0].clientY - bounding.top;
        mousex = (DISPLAY_SIZE * mousex) / 1000;
        mousey = (DISPLAY_SIZE * mousey) / 1000;
      } else {
        mousex = event.clientX - bounding.left;
        mousey = event.clientY - bounding.top;
        mousex = (DISPLAY_SIZE * mousex) / 1000;
        mousey = (DISPLAY_SIZE * mousey) / 1000;
      }

      paintMousePosition();

      // mousexs = parseInt((mousex - panX) / currentScale);
      // mouseys = parseInt((mousey - panY) / currentScale);
      if (painting && isMousePressed) {
        currentDraw.value.push(Pen(event, eventName, isMousePressed, lastPixel, PIXEL_SIZE, DISPLAY_SIZE, pixels, ctx, penSize, selectedColor, currentPixelsMousePressed, currentScale, originX, originY, matrix, mousex, mousey));
      } else if (erasing && isMousePressed) Eraser(event, eventName, isMousePressed, lastPixel, PIXEL_SIZE, DISPLAY_SIZE, pixels, ctx, penSize, originX, originY, currentScale, mousex, mousey);
    })
  );

  "mouseup touchend".split(" ").forEach((eventName) =>
    document.addEventListener(eventName, (event) => {
      isMousePressed = false;
      lastPixel.value = null;
      if (currentDraw.value.length > 0) {
        undoStack.push(currentDraw.value);
      }
      currentDraw.value = [];

      currentPixelsMousePressed.value = new Map();
    })
  );

  const checkKeys = (event) => {
    switch (event.key) {
      case "e":
        painting = false;
        erasing = true;
        bucket = false;
        break;

      case "p":
        painting = true;
        erasing = false;
        bucket = false;
        break;

      case "b":
        painting = false;
        erasing = false;
        bucket = true;

        break;

      case "E":
        painting = false;
        erasing = true;
        bucket = false;
        break;

      case "P":
        painting = true;
        erasing = false;
        bucket = false;
        break;

      case "B":
        painting = false;
        erasing = false;
        bucket = true;
        break;

      case "1":
        penSize = PIXEL_SIZE;
        break;

      case "2":
        penSize = PIXEL_SIZE * 2;
        break;

      case "3":
        penSize = PIXEL_SIZE * 3;
        break;

      default:
        break;
    }
  };

  const checkKeyCombinations = (event) => {
    if (keyMap["ControlLeft"] && keyMap["KeyZ"]) {
      undoLastDraw(pixels, defaultPenSize, ctx);
    }
  };

  document.addEventListener("keydown", (event) => {
    let currentClassName;

    checkKeys(event);

    keyMap[event.code] = true;

    checkKeyCombinations(event);
  });

  document.addEventListener("keyup", (event) => {
    keyMap[event.code] = false;
  });

  function noscroll() {
    window.scrollTo(0, 0);
  }
  window.addEventListener("scroll", noscroll);

  //PREVENT BROWSER FROM OPEN RIGHT MOUSE POP UP MENU ON CANVAS
  canvas.oncontextmenu = () => {
    return false;
  };

  canvas.addEventListener("wheel", (e) => {
    if (e.deltaY < 0 && zoomAmount < 7) {
      zoomAmount++;
      currentScale *= SCALE_FACTOR;
      originX = parseInt(mousex - (mousex - originX) * SCALE_FACTOR);
      originY = parseInt(mousey - (mousey - originY) * SCALE_FACTOR);
      mousehistory.push({ mousex, mousey });
      draw(true);
    } else if (e.deltaY > 0 && zoomAmount > 0) {
      zoomAmount--;
      currentScale *= 1 / SCALE_FACTOR;
      const m = mousehistory.pop();
      originX = parseInt(m.mousex - (m.mousex - originX) * (1 / SCALE_FACTOR));
      originY = parseInt(m.mousey - (m.mousey - originY) * (1 / SCALE_FACTOR));

      if (zoomAmount == 0) {
        originX = 0;
        originY = 0;
      }

      draw();
    }
  });
});

const setUpCanvas = () => {
  canvas = document.getElementById("canvas");
  canvas.style.backgroundColor = "white";
  ctx = canvas.getContext("2d");

  canvas.width = DISPLAY_SIZE;
  canvas.height = DISPLAY_SIZE;

  canvas.style.width = "1000px";
  canvas.style.height = "1000px";

  ctx.willReadFrequently = true;
};

const setUpPixelMatrix = () => {
  let pixelID = 1;
  let idxi = 0,
    idxj = 0;
  let a = 0;
  for (let i = 0; i <= DISPLAY_SIZE; i += PIXEL_SIZE) {
    const row = [];
    for (let j = 0; j <= DISPLAY_SIZE; j += PIXEL_SIZE) {
      let x1 = i;
      let y1 = j;
      let x2 = i + PIXEL_SIZE;
      let y2 = j + PIXEL_SIZE;
      // let bgColor = a ? "#696969" : "#858585";
      let bgColor = "white";
      const pixel = {
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        painted: false,
        id: pixelID++,
        i: idxi,
        j: idxj,
        numOfPaints: 0,
        colorStack: new Stack(),
        bgColor: bgColor,
        color: bgColor,
      };
      pixel.colorStack.push(bgColor);
      row.push(pixel);
      idxj++;
      a = a ? 0 : 1;
    }
    idxi++;
    idxj = 0;
    pixels.push(row);
  }
  console.log(pixels.length, pixels[0].length);
};

const draw = () => {
  matrix[0] = currentScale;
  matrix[1] = 0;
  matrix[2] = 0;
  matrix[3] = currentScale;
  matrix[4] = originX;
  matrix[5] = originY;

  ctx.clearRect(0, 0, DISPLAY_SIZE, DISPLAY_SIZE);
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  ctx.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);

  let a = 0;

  //redraw background
  // for (let i = 0; i <= DISPLAY_SIZE; i += PIXEL_SIZE) {
  //   for (let j = 0; j <= DISPLAY_SIZE; j += PIXEL_SIZE) {
  //     ctx.fillStyle = a ? "#696969" : "#858585";
  //     ctx.fillRect(i, j, PIXEL_SIZE, PIXEL_SIZE);
  //     a = a ? 0 : 1;
  //   }
  // }

  //redraw pixel matrix
  for (let i = 0; i < pixels.length; i++) {
    for (let j = 0; j < pixels[i].length; j++) {
      if (pixels[i][j].numOfPaints > 0) {
        ctx.fillStyle = pixels[i][j].color;
        ctx.fillRect(pixels[i][j].x1, pixels[i][j].y1, PIXEL_SIZE, PIXEL_SIZE);
      }
    }
  }

  paintMousePosition(true);
};

const paintMousePosition = (force = null) => {
  //find pixel in pixel matrix
  //TODO: IF PARSING THE PIXEL MATRIX START TO SLOW DOWN PERFORMANCE, CHANGE IT TO ARRAY AND SORT PIXELS, THEN SEARCH FOR A PIXEL USING BINARY SEARCH

  if (isMousePressed) return;
  // if (!painting && !erasing) return;

  let xs = parseInt((mousex - originX) / currentScale);
  let ys = parseInt((mousey - originY) / currentScale);

  if (!force && currentXYPaintedPosition && xs >= currentXYPaintedPosition.x && xs < currentXYPaintedPosition.x + PIXEL_SIZE && ys >= currentXYPaintedPosition.y && ys < currentXYPaintedPosition.y + PIXEL_SIZE) {
    return;
  }

  if (xs > DISPLAY_SIZE || xs < 0 || ys > DISPLAY_SIZE || ys < 0) {
    return;
  }
  //   if (x > currSize || x < 0 || y > currSize || y < 0) return;
  let flag = false;
  let idxi, idxj;
  let aux;
  for (let i = 0; i < pixels.length; i++) {
    if (flag) break;
    for (let j = 0; j < pixels[i].length; j++) {
      if (xs >= pixels[i][j].x1 && xs < pixels[i][j].x2 && ys >= pixels[i][j].y1 && ys < pixels[i][j].y2) {
        aux = pixels[i][j];
        idxi = i;
        idxj = j;
        flag = true;
        break;
      }
    }
  }

  //TODO: ADJUST FOR BIGGER PEN SIZES
  // console.log(currentPaintedMousePosition);
  if (currentPaintedMousePosition) {
    ctx.fillStyle = currentPaintedMousePosition.color;
    ctx.fillRect(currentPaintedMousePosition.x1, currentPaintedMousePosition.y1, PIXEL_SIZE, PIXEL_SIZE);
  }

  currentPaintedMousePosition = aux;

  // ctx.fillStyle = "rgba(247, 255, 0, 0.41)";
  ctx.fillStyle = "yellow";
  ctx.fillRect(currentPaintedMousePosition.x1, currentPaintedMousePosition.y1, PIXEL_SIZE, PIXEL_SIZE);

  currentXYPaintedPosition = {
    x: xs,
    y: ys,
  };
};

// window.onresize = () => {
//   console.log("resizing window");
//   DISPLAY_SIZE = AdjustDisplaySize(window.innerWidth);
//   PIXEL_SIZE = DISPLAY_SIZE / 100;
//   console.log("display size:", DISPLAY_SIZE);
//   canvas.width = DISPLAY_SIZE;
//   canvas.height = DISPLAY_SIZE;
//   updatePixelMatrix();
//   draw();
// };
