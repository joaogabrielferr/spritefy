import { Pen } from "./Functionalities/Pen.js";
import { Eraser } from "./Functionalities/Eraser.js";
import { PaintBucket } from "./Functionalities/PaintBucket.js";
import { undoStack } from "./Functionalities/UndoRedo.js";
import { undoLastDraw } from "./Functionalities/UndoRedo.js";
import { Stack } from "./Functionalities/Helpers/Stack.js";

//TODO: ADD NEIGHBORHOOD ERASING PIXEL*2 AND PIXEL*3 PEN SIZES
//TODO: DURING ERASING, IF PIXEL IS NOT PAINTED, DO NOT TO TRY TO CLEAR
//TODO: ADD CTRL Z UNDO TO PIXEL*2 AND PIXEL*3 PEN SIZES
//TODO: ADD TYPESCRIPT

let canvas;
let ctx; //canvas context
let pixels = [];
let lastPixel = {
  value: null, //last pixel painted in the screen
};

let currentDraw = {
  value: [], //current thing being painted in the canvas (the pixels painted using the pen, eraser of bucket)
};

let currentPixelsMousePressed = {
  value: new Map(), //current pixels painted while the user is moving the mouse with one of its buttons pressed
};

let currSize;

const colorSelectorElement = document.getElementById("colorSelector");

let selectedColor = {
  value: colorSelectorElement.value,
};

colorSelectorElement.addEventListener("change", (event) => {
  selectedColor.value = event.target.value;
});

const keyMap = new Map();

const DISPLAY_SIZE = 700; //has to be divisible by 100
const PIXEL_SIZE = DISPLAY_SIZE / 100;
const SCALE_FACTOR = 1;

currSize = DISPLAY_SIZE;

let currentScale = SCALE_FACTOR;
let panX = 0,
  panY = 0;

let isMousePressed = false;
let painting = true;
let erasing = false;
let bucket = false;

const defaultPenSize = PIXEL_SIZE;
let penSize = PIXEL_SIZE;

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

      if (painting) currentDraw.value.push(Pen(event, eventName, isMousePressed, lastPixel, PIXEL_SIZE, DISPLAY_SIZE, pixels, ctx, penSize, selectedColor, currentPixelsMousePressed, currSize));
      else if (erasing) Eraser(event, eventName, isMousePressed, lastPixel, PIXEL_SIZE, DISPLAY_SIZE, pixels, ctx, penSize);
      else if (bucket) currentDraw.value.push(PaintBucket(event, isMousePressed, selectedColor, PIXEL_SIZE, DISPLAY_SIZE, pixels, defaultPenSize, ctx));
    })
  );

  "mousemove touchmove".split(" ").forEach((eventName) =>
    canvas.addEventListener(eventName, (event) => {
      if (painting && isMousePressed) currentDraw.value.push(Pen(event, eventName, isMousePressed, lastPixel, PIXEL_SIZE, DISPLAY_SIZE, pixels, ctx, penSize, selectedColor, currentPixelsMousePressed, currSize));
      else if (erasing && isMousePressed) Eraser(event, eventName, isMousePressed, lastPixel, PIXEL_SIZE, DISPLAY_SIZE, pixels, ctx, penSize);
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
    if (e.deltaY < 0 && currentScale < 10) {
      currentScale += SCALE_FACTOR;
      console.log(currentScale);
      draw();
    } else if (e.deltaY > 0 && currentScale > 1) {
      currentScale -= SCALE_FACTOR;
      console.log(currentScale);
      draw();
    }
  });
});

const setUpCanvas = () => {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  canvas.width = DISPLAY_SIZE;
  canvas.height = DISPLAY_SIZE;

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
      const pixel = {
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        color: "#FF000000",
        painted: false,
        id: pixelID++,
        i: idxi,
        j: idxj,
        numOfPaints: 0,
        colorStack: new Stack(),
        bgColor: a ? "#b5b5b5" : "#777777",
      };
      pixel.colorStack.push("#FF000000");
      row.push(pixel);
      idxj++;
      a = a ? 0 : 1;
    }
    idxi++;
    idxj = 0;
    pixels.push(row);
  }
};

const draw = () => {
  //save context state
  //clear canvas
  //translate
  //scale
  //repaint canvas using pixel matrix
  //restore context state

  ctx.clearRect(0, 0, DISPLAY_SIZE, DISPLAY_SIZE);
  ctx.save();
  ctx.translate(panX, panY);
  ctx.scale(currentScale, currentScale);

  let a = 0;

  //redraw background
  for (let i = 0; i <= DISPLAY_SIZE; i += PIXEL_SIZE) {
    for (let j = 0; j <= DISPLAY_SIZE; j += PIXEL_SIZE) {
      //if(i < 0 || i > 500 || j < 0 || j > 500)
      //ctx.fillStyle = "#333";
      //else
      ctx.fillStyle = a ? "#b5b5b5" : "#777777";
      // console.log(pixels[i][j].bgColor);
      //ctx.fillStyle = pixels[i][j].bgColor;
      ctx.fillRect(i, j, PIXEL_SIZE, PIXEL_SIZE);
      a = a ? 0 : 1;
    }
  }

  //redraw pixel matrix
  for (let i = 0; i < pixels.length; i++) {
    for (let j = 0; j < pixels[i].length; j++) {
      if (pixels[i][j].numOfPaints > 0) {
        ctx.fillStyle = pixels[i][j].color;
        ctx.fillRect(pixels[i][j].x1, pixels[i][j].y1, PIXEL_SIZE, PIXEL_SIZE);
      }
    }
  }

  ctx.restore();
};
