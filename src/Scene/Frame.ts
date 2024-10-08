import { Stack } from '../utils/Stack';

export default class Frame {
  pixels: Uint8ClampedArray;

  name: string;

  undoStack: Stack<Uint8ClampedArray>;

  redoStack: Stack<Uint8ClampedArray>;

  lastPixel: { x: number; y: number } | null; //last pixel painted in the canvas

  lastPixelXMirror: { x: number; y: number } | null; //last pixel painted in the canvas

  lastPixelYMirror: { x: number; y: number } | null; //last pixel painted in the canvas

  lastPixelXYMirror: { x: number; y: number } | null; //last pixel painted in the canvas

  currentPixelsMousePressed: Map<number, boolean>; //current pixels painted while the user is moving the mouse with one of its buttons pressed (<pixel id, true>)

  previousPixelWhileMovingMouse: { x: number; y: number } | null;

  previousNeighborsWhileMovingMouse: { x: number; y: number }[];

  lineFirstPixel: { x: number; y: number } | null; //start pixel for drawing a line, square or circle

  selectionFirstPixel: { x: number; y: number } | null; //start pixel selection

  selectionLastPixel: { x: number; y: number } | null; //last pixel when drawing a selection rectangle

  changed = false;

  circleRadius: number;

  zoomAmount: number;

  keyMap: Map<string, boolean>;

  initialized: boolean;

  constructor(name: string) {
    //this.pixels = [];
    this.pixels = new Uint8ClampedArray();
    this.name = name;
    this.undoStack = new Stack<Uint8ClampedArray>();
    this.redoStack = new Stack<Uint8ClampedArray>();
    this.lastPixel = null;
    this.lastPixelXMirror = null;
    this.lastPixelYMirror = null;
    this.lastPixelXYMirror = null;
    this.currentPixelsMousePressed = new Map();
    this.previousPixelWhileMovingMouse = null;
    this.previousNeighborsWhileMovingMouse = [];
    this.zoomAmount = 0;
    this.lineFirstPixel = null;
    this.selectionFirstPixel = null;
    this.selectionLastPixel = null;
    this.circleRadius = 1;
    this.keyMap = new Map();
    this.initialized = false;
  }

  initializePixelMatrix(display_size: number) {
    this.pixels = new Uint8ClampedArray(display_size * display_size * 4);
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
  }
}
