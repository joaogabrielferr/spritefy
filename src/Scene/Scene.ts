import { Pixel } from "../types/Types";
import { Stack } from "../utils/Stack";

export default class Scene{

    pixels : Pixel[][]; //pixel matrix, all operations are done in this matrix and then translated to canvas

    selectedTool : 'pencil' | 'eraser' | 'paintBucket';

    selectedColor : string;

    currentDraw : Pixel[];
    
    lastPixel : Pixel | null; //last pixel painted in the screen
    
    currentPixelsMousePressed : Map<number,boolean>; //current pixels painted while the user is moving the mouse with one of its buttons pressed (<pixel id, true>)

    constructor(display_size : number,pixel_size : number){
        this.pixels = [];
        this.currentDraw = [];
        this.selectedTool = 'pencil';
        this.selectedColor = "black";
        this.lastPixel = null;
        this.currentPixelsMousePressed = new Map();
        this.initilializePixelMatrix(display_size,pixel_size);
    }

    initilializePixelMatrix(display_size : number,pixel_size : number){
        let pixelID = 1;
        let idxi = 0,
            idxj = 0;
        let a = 0;
        for (let i = 0; i <= display_size; i += pixel_size) {
            const row : Pixel[] = [];
            for (let j = 0; j <= display_size; j += pixel_size) {
            let x1 = i;
            let y1 = j;
            let x2 = i + pixel_size;
            let y2 = j + pixel_size;
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
                colorStack: new Stack<string>(),
                color: null,
            } as Pixel;
            row.push(pixel);
            idxj++;
            a = a ? 0 : 1;
            }
            idxi++;
            idxj = 0;
            this.pixels.push(row);
        }
    }



}