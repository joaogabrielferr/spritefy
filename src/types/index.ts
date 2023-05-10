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
    // numOfPaints : number;
    colorStack : Stack<string>;
    bgColor : string;
    // color : string;

}
