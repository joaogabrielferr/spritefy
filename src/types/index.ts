import { Stack } from "../utils/Stack";

export type Pixel = {
    x1 : number;
    y1 : number;
    id : number;
    i : number;
    j : number;
    colorStack : Stack<string>;
    bgColor : string;
}

export type toolsType = 'pencil' | 'eraser' | 'paintBucket' | 'dropper' | 'line' | 'square' | 'circle' | 'undo' | 'redo';

export type ToolButton= {tool : toolsType, svg : JSX.Element,tooltip:string,tooltipDataHtml? : string[]};

export type PaletteType = {name : string,colors: string[],id : number};

export type Subscription = {
    unsubscribe: () => void;
}
  
export type Callback = {
[key: string]: <T>(a : T)=> void;
}

export type Subscriber = {
[key: string]: Callback;
}

export type IEventBus = {
publish<T>(event: string, arg?: T): void;
subscribe(event: string, callback: ()=> void) : Subscription;
}