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
