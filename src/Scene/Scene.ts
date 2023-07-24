import { BG_COLORS, BG_TILE_SIZE } from '../utils/constants';
import { Pixel } from '../types';
import { Stack } from '../utils/Stack';

export default class Scene {
  //pixels: Pixel[][]; //all operations are recorded in this matrix

  pixels: Uint8ClampedArray;

  currentDraw: Pixel[][]; //current draw in main canvas while mouse is pressed

  currentDrawTopCanvas: Pixel[][]; //current draw in top canvas while mouse is pressed;

  lastPixel: Pixel | null; //last pixel painted in the canvas

  lastPixelXMirror: { x: number; y: number } | null; //last pixel painted in the canvas

  lastPixelYMirror: { x: number; y: number } | null; //last pixel painted in the canvas

  lastPixelXYMirror: { x: number; y: number } | null; //last pixel painted in the canvas

  currentPixelsMousePressed: Map<number, boolean>; //current pixels painted while the user is moving the mouse with one of its buttons pressed (<pixel id, true>)

  previousPixelWhileMovingMouse: { x: number; y: number } | null;

  previousNeighborsWhileMovingMouse: { x: number; y: number }[];

  lineFirstPixel: Pixel | null; //start pixel for drawing a line, square or circle

  circleRadius: number;

  zoomAmount: number;

  keyMap: Map<string, boolean>;

  initialized: boolean;

  lastPixel2: { x: number; y: number } | null;

  constructor() {
    //this.pixels = [];
    this.pixels = new Uint8ClampedArray();
    this.currentDraw = [];
    this.currentDrawTopCanvas = [];
    this.lastPixel = null;
    this.lastPixelXMirror = null;
    this.lastPixelYMirror = null;
    this.lastPixelXYMirror = null;
    this.currentPixelsMousePressed = new Map();
    this.previousPixelWhileMovingMouse = null;
    this.previousNeighborsWhileMovingMouse = [];
    this.zoomAmount = 0;
    this.lineFirstPixel = null;
    this.circleRadius = 1;
    this.keyMap = new Map();
    this.initialized = false;
    this.lastPixel2 = null;
  }

  initializePixelMatrix(display_size: number, pixel_size: number) {
    this.pixels = new Uint8ClampedArray(display_size * display_size * 4);
    //TODO: i need to save current drawing on browser
    //problem: for big drawing sizes like 500x500 its impractical to save it on local storage, and even on indexedDB
    //possible solution: save canvas as png, store it on indexedDB, then after page load, get the image and parse it using some library and store info on this.pixels(lol)

    //BG_TILE_SIZE = size of background tile, define pixel bg color based on bg tile color
    // let rowCounter = 0;
    // let columnCounter = 0;

    // let currentBgColor = BG_COLORS[0];

    // let pixelID = 1;
    // let idxi = 0,
    //   idxj = 0;
    // let a = 0;
    // for (let i = 0; i < display_size; i += pixel_size) {
    //   const row: Pixel[] = [];
    //   if (columnCounter % BG_TILE_SIZE === 0) {
    //     currentBgColor = currentBgColor === BG_COLORS[0] ? BG_COLORS[1] : BG_COLORS[0];
    //     if (display_size <= BG_TILE_SIZE) {
    //       currentBgColor = BG_COLORS[1];
    //     }
    //   }
    //   columnCounter++;
    //   for (let j = 0; j < display_size; j += pixel_size) {
    //     let x1 = i;
    //     let y1 = j;
    //     const pixel = {
    //       bgColor: currentBgColor,
    //       x1: x1,
    //       y1: y1,
    //       i: idxi,
    //       j: idxj,
    //       id: pixelID++,
    //       colorStack: new Stack<string>()
    //     } as Pixel;
    //     row.push(pixel);
    //     idxj++;
    //     a = a ? 0 : 1;
    //     rowCounter++;
    //     if (rowCounter % BG_TILE_SIZE === 0) {
    //       currentBgColor = currentBgColor === BG_COLORS[0] ? BG_COLORS[1] : BG_COLORS[0];
    //       if (display_size <= BG_TILE_SIZE) {
    //         currentBgColor = BG_COLORS[1];
    //       }
    //     }
    //   }
    //   idxi++;
    //   idxj = 0;
    //   this.pixels.push(row);
    // }
    // this.initialized = true;
  }

  //find pixel based on mouse position - xs and ys are already transformed to world coordinates
  findPixel(xs: number, ys: number, pixel_size: number): Pixel | null {
    // if (this.pixels[Math.floor(xs)][Math.floor(ys)]) {
    //   return this.pixels[Math.floor(xs)][Math.floor(ys)];
    // }

    // return null;

    // let pixel: Pixel | null = null;

    // //first find row, then binary search the pixel in that row

    // const i = Math.floor(xs / pixel_size);

    // if (!this.pixels || !this.pixels[i]) return null;

    // let start = 0,
    //   end = this.pixels[i].length;
    // let mid = 0;

    // while (start <= end) {
    //   mid = Math.floor((start + end) / 2);
    //   if (!this.pixels[i][mid]) break;
    //   if (ys >= this.pixels[i][mid].y1 && ys < this.pixels[i][mid].y1 + pixel_size) {
    //     pixel = this.pixels[i][mid];
    //     break;
    //   }

    //   if (ys < this.pixels[i][mid].y1) end = mid - 1;
    //   else if (ys >= this.pixels[i][mid].y1 + pixel_size) start = mid + 1;
    // }
    // return pixel;
    return null;
  }

  //find neighbors in Uint8campledarray (canvas is represented as a array, not a matrix)
  findNeighbors(index: number, penSize: number, display_size: number) {
    const neighbors: number[] = [];

    const y = Math.floor(index / (display_size * 4));
    const x = Math.floor((index % (display_size * 4)) / 4);

    for (let i = -(penSize - 1); i <= penSize - 1; i++) {
      for (let j = -(penSize - 1); j <= penSize - 1; j++) {
        if (i == 0 && j == 0) continue;
        {
          if (x + i >= 0 && x + i < display_size && y + j >= 0 && y + j < display_size)
            neighbors.push((x + i + (y + j) * display_size) * 4);
        }
      }
    }

    return neighbors;
  }

  findNeighborsMatrix(x: number, y: number, penSize: number, display_size: number) {
    const neighbors: { x: number; y: number }[] = [];

    for (let i = -(penSize - 1); i <= penSize - 1; i++) {
      for (let j = -(penSize - 1); j <= penSize - 1; j++) {
        if (i == 0 && j == 0) continue;
        {
          if (x + i >= 0 && x + i < display_size && y + j >= 0 && y + j < display_size) neighbors.push({ x: x + i, y: y + j });
        }
      }
    }

    return neighbors;
  }

  copyPixelMatrix(pixels: Uint8ClampedArray) {
    this.pixels = new Uint8ClampedArray(pixels);

    // for (let i = 0; i < pixelMatrix.length; i++) {
    //   const row: Pixel[] = [];
    //   for (let j = 0; j < pixelMatrix[i].length; j++) {
    //     const pixel: Pixel = {
    //       i: pixelMatrix[i][j].i,
    //       j: pixelMatrix[i][j].j,
    //       x1: pixelMatrix[i][j].x1,
    //       y1: pixelMatrix[i][j].y1,
    //       id: pixelMatrix[i][j].id,
    //       bgColor: pixelMatrix[i][j].bgColor,
    //       colorStack: new Stack<string>(pixelMatrix[i][j].colorStack)
    //     };
    //     row.push(pixel);
    //   }
    //   this.pixels.push(row);
    // }
  }
}
