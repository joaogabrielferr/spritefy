import { BG_COLORS } from "../constants";
import { Pixel } from "../types";
import { Stack } from "../utils/Stack";


export default class Scene{

    pixels : Pixel[][]; //pixel matrix, all operations are recorded in this matrix

    //TODO: Take selectedTool and selectedColor out of here and make then available as global states
    selectedTool : 'pencil' | 'eraser' | 'paintBucket';

    currentDraw : Pixel[][];
    
    lastPixel : Pixel | null; //last pixel painted in the screen
    
    currentPixelsMousePressed : Map<number,boolean>; //current pixels painted while the user is moving the mouse with one of its buttons pressed (<pixel id, true>)

    zoomAmount : number;

    keyMap : Map<string,boolean>;


    constructor(){
        this.pixels = [];
        this.currentDraw = [];
        this.selectedTool = 'pencil';
        this.lastPixel = null;
        this.currentPixelsMousePressed = new Map();
        this.zoomAmount = 0;
        this.keyMap = new Map();
    }

    initilializePixelMatrix(display_size : number,pixel_size : number, bgTileSize : number){
        

        //TODO: i need to save current drawing on browser
        //problem: for big drawing sizes like 500x500 its impractical to save it on local storage, and even on indexedDB
        //possible solution: save canvas as png, store it on indexedDB, then after page load, get the image and parse it using some library and store info on this.pixels(lol)

        //bgTileSize = size of background tile, define pixel bg color based on bg tile color
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
                // let x2 = i + pixel_size;
                // let y2 = j + pixel_size;
                const pixel = {
                    bgColor : currentBgColor,
                    x1: x1,
                    y1: y1,
                    i: idxi,
                    j: idxj,
                    id : pixelID++,
                    colorStack: new Stack<string>(),
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

        
        // const pixelsStorage = [];
        // for (let i = 0; i < this.pixels.length; i++) {
        //     const row = [];
        //     for (let j = 0; j < this.pixels[i].length; j++) {

        //         row.push({x1:this.pixels[i][j].x1,y1:this.pixels[i][j].y1,color : this.pixels[i][j].colorStack.top() || "black"});

        //     }
        //     pixelsStorage.push(row);
        // }


        // console.info(new Blob([JSON.stringify(this.pixels)]).size);
        // console.info(new Blob([JSON.stringify(pixelsStorage)]).size);

    }

    //find pixel based on mouse position - xs and ys are already transformed to world coordinates
    //TODO:maybe refactor this to something more performatic than O(n^2), probably change to pixel array and use binary search, but only if it starts to affect performance
    findPixel(xs : number,ys : number,pixel_size : number) : Pixel | null{
        let pixel : Pixel | null = null;
        let flag = false;
      //   let idxi, idxj;
        for (let i = 0; i < this.pixels.length; i++) {
          if (flag) break;
          for (let j = 0; j < this.pixels[i].length; j++) {
            if (xs >= this.pixels[i][j].x1 && xs < this.pixels[i][j].x1 + pixel_size && ys >= this.pixels[i][j].y1 && ys < this.pixels[i][j].y1 + pixel_size) {
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
        }else if(['e','E','2'].indexOf(event.key) > -1)
        {
            this.selectedTool = 'eraser';
        }


    }




}