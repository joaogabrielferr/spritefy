import Frame from '../scene/Frame';
import Scene from '../scene/Frame';
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
  | 'redo'
  | 'selection'
  | 'dithering';

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
  pixelArray: Uint8ClampedArray;
  op?: 'add' | 'update' | 'delete';
};

// export type IFrame = {
//   name: string;
//   scene: Frame;
//   undoStack: Stack<Uint8ClampedArray>;
//   redoStack: Stack<Uint8ClampedArray>;
// };

// export type Layer = {
//   canvas: string;
//   visible: boolean;
//   blocked: boolean;
// };
