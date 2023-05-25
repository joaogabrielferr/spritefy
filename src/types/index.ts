import { Stack } from "../utils/Stack";

export type Pixel = {
    x1 : number;
    y1 : number;
    // x2 : number;
    // y2 : number;
    // painted : boolean;
    id : number;
    i : number;
    j : number;
    colorStack : Stack<string>;
    bgColor : string;
}

export type toolsType = 'pencil' | 'eraser' | 'paintBucket' | 'dropper' | 'line' | 'square' | 'circle';

export type ToolButton= {tool : toolsType, svg : JSX.Element,tooltip:string};

export type PaletteType = {name : string,colors: string[],id : number};