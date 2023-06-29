import Scene from '../scene/Scene';
import { Stack } from '../utils/Stack';

export type Pixel = {
  x1: number;
  y1: number;
  id: number;
  i: number;
  j: number;
  colorStack: Stack<string>;
  bgColor: string;
};

export type toolsType =
  | 'pencil'
  | 'eraser'
  | 'paintBucket'
  | 'dropper'
  | 'line'
  | 'rectangle'
  | 'elipse'
  | 'undo'
  | 'redo';

export type ToolButtonType = {
  tool: toolsType;
  svg: JSX.Element;
  tooltip: string;
  tooltipDataHtml?: string[];
};

export type PaletteType = { name: string; colors: string[]; id: number };

//Event bus types////////////////////
export type Subscription = {
  unsubscribe: () => void;
};

export type Callback = {
  [key: string]: <T>(a: T) => void;
};

export type Subscriber = {
  [key: string]: Callback;
};

export type IEventBus = {
  publish<T>(event: string, arg?: T): void;
  subscribe(event: string, callback: () => void): Subscription;
};

///////////////////////////////////

export type drawOnSideBarCanvasType = {
  frame: string;
  pixelMatrix: Pixel[][];
  op?: 'add' | 'update' | 'delete';
};

export type Frame = {
  name: string;
  scene: Scene;
  undoStack: Stack<Pixel[][]>;
  redoStack: Stack<[Pixel, string | undefined][]>;
};

export type Layer = {
  canvas: string;
  visible: boolean;
  blocked: boolean;
};
