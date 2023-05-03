import { BG_COLORS } from "../constants";
import { Pixel } from "../types/Types";
import { Stack } from "../utils/Stack";

export default class Scene{

    pixels : Pixel[][]; //pixel matrix, all operations are done in this matrix and then translated to canvas

    selectedTool : 'pencil' | 'eraser' | 'paintBucket';

    selectedColor : string;

    currentDraw : Pixel[][];
    
    lastPixel : Pixel | null; //last pixel painted in the screen
    
    currentPixelsMousePressed : Map<number,boolean>; //current pixels painted while the user is moving the mouse with one of its buttons pressed (<pixel id, true>)

    zoomAmount : number;


    constructor(){
        this.pixels = [];
        this.currentDraw = [];
        this.selectedTool = 'pencil';
        this.selectedColor = "black";
        this.lastPixel = null;
        this.currentPixelsMousePressed = new Map();
        this.zoomAmount = 0;
    }

    initilializePixelMatrix(display_size : number,pixel_size : number, bgTileSize : number){
        
        //TODO: Save pixel matrix to local storage after every operation, then retrieve it here

        //bgTileSize = size of background tile, define pixel bg color based on bg tile color
        console.log(bgTileSize);
        let rowCounter = 0;
        let columnCounter = 0;

        let currentBgColor = BG_COLORS[0];

        let pixelID = 1;
        let idxi = 0,
            idxj = 0;
        let a = 0;
        for (let i = 0; i < display_size; i += pixel_size) {
            const row : Pixel[] = [];
            if(columnCounter%bgTileSize === 0)
            {
                currentBgColor = currentBgColor === BG_COLORS[0] ? BG_COLORS[1] : BG_COLORS[0];
            }
            columnCounter++;
            for (let j = 0; j < display_size; j += pixel_size) {
                let x1 = i;
                let y1 = j;
                let x2 = i + pixel_size;
                let y2 = j + pixel_size;
                const pixel = {
                    bgColor : currentBgColor,
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
                    color: currentBgColor,
                } as Pixel;
                row.push(pixel);
                idxj++;
                a = a ? 0 : 1;
                rowCounter++;
                if(rowCounter%bgTileSize === 0)
                {
                    currentBgColor = currentBgColor === BG_COLORS[0] ? BG_COLORS[1] : BG_COLORS[0];
                }
            }
            idxi++;
            idxj = 0;
            this.pixels.push(row);
        }
    }

    //find pixel based on mouse position - xs and ys are already transformed to world coordinates
    //TODO:maybe refactor this to something more performatic than O(n^2), probably change to pixel array and use binary search, but only if it starts to affect performance
    findPixel(xs : number,ys : number) : Pixel | null{
        let pixel : Pixel | null = null;
        let flag = false;
      //   let idxi, idxj;
        for (let i = 0; i < this.pixels.length; i++) {
          if (flag) break;
          for (let j = 0; j < this.pixels[i].length; j++) {
            if (xs >= this.pixels[i][j].x1 && xs < this.pixels[i][j].x2 && ys >= this.pixels[i][j].y1 && ys < this.pixels[i][j].y2) {
              pixel = this.pixels[i][j];
              // idxi = i;
              // idxj = j;
              flag = true;
              break;
            }
          }
        }

        return pixel;
    }

    checkKeys(event : KeyboardEvent){

        if(['p','P','1'].indexOf(event.key) > -1)
        {
            this.selectedTool = 'pencil';
            console.log("selected pencil");
        }else if(['e','E','2'].indexOf(event.key) > -1)
        {
            this.selectedTool = 'eraser';
            console.log("selected eraser");
        }

    }



}