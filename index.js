
import { Pen } from "./Functionalities/Pen.js";
import {Eraser} from './Functionalities/Eraser.js';
import { PaintBucket } from "./Functionalities/PaintBucket.js";
import { undoStack } from "./Functionalities/UndoRedo.js";
import { undoLastDraw } from "./Functionalities/UndoRedo.js";

//TODO: ADD NEIGHBORHOOD ERASING FOR PEN SIZES NUMBER 2 AND 3
//TODO: DURING ERASING, IF PIXEL IS NOT PAINTED, DO NOT TO TRY TO CLEAR
//TODO: ADD CTRL Z UNDO TO PXEL*2 AND PIXEL*3 PEN SIZES
//TODO: ADD CTRL Z UNDO TO PAINT BUCKET
//TODO: ADD TYPESCRIPT

let canvas;
let bgcanvas;
let c; //canvas context
let pixels = [];
let lastPixel = {
    value: null //last pixel painted in the screen
};

let currentDraw = {
    value : [] //current thing being painted in the canvas (the pixels painted using the pen, eraser of bucket)
}


let currentPixelsMousePressed = {
    value : [] //current pixels painted while the user is moving the mouse with one of its buttons pressed
}


const colorSelectorElement = document.getElementById("colorSelector");

let selectedColor = {
    value : colorSelectorElement.value
};

colorSelectorElement.addEventListener("change",(event)=>{
    selectedColor.value = event.target.value;
})

const keyMap = new Map();


const PIXEL_SIZE = 10;
const DISPLAY_SIZE = 64; 
// const PIXEL_SIZE = 10;
// const DISPLAY_SIZE = 16; 

let isMousePressed = false;
let painting = true;
let erasing = false;
let bucket = false;

const defaultPenSize = PIXEL_SIZE;
let penSize = PIXEL_SIZE;


window.addEventListener("load",()=>{
    
     setUpCanvas();
     setUpPixelMatrix();
     

     //SETTING UP DOWNLOAD BUTTON

    const botao = document.getElementById("button");
    botao.addEventListener('click',()=>{
        let downloadLink = document.createElement('a');
        downloadLink.setAttribute('download', 'pixelart(not realy).png');
        let dataURL = canvas.toDataURL('image/png');
        let url = dataURL.replace(/^data:image\/png/,'data:application/octet-stream');
        downloadLink.setAttribute('href', url);
        downloadLink.click();
    });


    //EVENT LISTENERS

    canvas.addEventListener("mousedown",(event)=>{
        isMousePressed = true;

        if(painting)
            currentDraw.value.push(Pen(event,"mousedown",isMousePressed,lastPixel,PIXEL_SIZE,DISPLAY_SIZE,pixels,c,penSize,selectedColor,currentPixelsMousePressed));
        else if(erasing)
            Eraser(event,"mousedown",isMousePressed,lastPixel,PIXEL_SIZE,DISPLAY_SIZE,pixels,c,penSize);
        else if(bucket)
            PaintBucket(event,isMousePressed,selectedColor,PIXEL_SIZE,DISPLAY_SIZE,pixels,defaultPenSize,c);
        
    });

    document.addEventListener("mousemove",(event)=>{
        if(painting && isMousePressed)
            currentDraw.value.push(Pen(event,"mousemove",isMousePressed,lastPixel,PIXEL_SIZE,DISPLAY_SIZE,pixels,c,penSize,selectedColor,currentPixelsMousePressed));
        else if (erasing && isMousePressed)
            Eraser(event,"mousemove",isMousePressed,lastPixel,PIXEL_SIZE,DISPLAY_SIZE,pixels,c,penSize);   
    });


    document.addEventListener("mouseup",(event)=>{
        isMousePressed = false;
        lastPixel.value = null;
        if(currentDraw.value.length > 0){
            console.log("aqui");
            undoStack.push(currentDraw.value);
        }
        currentDraw.value = [];

        currentPixelsMousePressed.value = [];
    });


    const checkKeys = (event) =>{
        switch(event.key)
        {
            case 'e':
                painting = false;
                erasing = true;
                bucket = false;
                // currentClassName = canvas.className;
                // canvas.classList.replace(currentClassName,"eraser");
                // bgcanvas.classList.replace(currentClassName,"eraser");
                // currentClassName = canvas.className;
                
                break;
            
            case 'p':
                painting = true;
                erasing = false;
                bucket = false;
                // currentClassName = canvas.className;
                // canvas.classList.replace(currentClassName,"pen");
                // bgcanvas.classList.replace(currentClassName,"pen");

                break;

            case 'b':
                painting = false;
                erasing = false;
                bucket = true;
                // currentClassName = canvas.className;
                // canvas.classList.replace(currentClassName,"bucket");
                // bgcanvas.classList.replace(currentClassName,"bucket");
                // currentClassName = canvas.className;
                break;
            

            case 'E':
                painting = false;
                erasing = true;
                bucket = false;
                // currentClassName = canvas.className;
                // canvas.classList.replace(currentClassName,"eraser");
                // bgcanvas.classList.replace(currentClassName,"eraser");
                break;

            case 'P':
                painting = true;
                erasing = false;
                bucket = false;
                // currentClassName = canvas.className;
                // canvas.classList.replace(currentClassName,"pen");
                // bgcanvas.classList.replace(currentClassName,"pen");
                break;
            
            case 'B':
                painting = false;
                erasing = false;
                bucket = true;
                // currentClassName = canvas.className;
                // canvas.classList.replace(currentClassName,"bucket");
                // bgcanvas.classList.replace(currentClassName,"bucket");
                // currentClassName = canvas.className;
                break;
        


            case '1':
                penSize = PIXEL_SIZE;
                break;
            
            case '2':
                penSize = PIXEL_SIZE*2;
                break;
            
            case '3':
                penSize = PIXEL_SIZE*3;
                break;
            
            default:
                break;
         }
    }

    const checkKeyCombinations = (event) =>{
        
        if(keyMap["ControlLeft"] && keyMap["KeyZ"])
        {
            undoLastDraw(pixels,defaultPenSize,c);
        }

    }


    document.addEventListener("keydown",(event)=>{
        let currentClassName;

        checkKeys(event);

        keyMap[event.code] = true;

        checkKeyCombinations(event);
    });

    document.addEventListener("keyup",(event)=>{
        keyMap[event.code] = false;
    })

    //PREVENT BROWSER FROM OPEN RIGHT MOUSE POP UP MENU ON CANVAS
    canvas.oncontextmenu = ()=> {return false};

});

const setUpCanvas = () =>{

    canvas = document.getElementById("canvas");
     c = canvas.getContext("2d");
  
    canvas.width = DISPLAY_SIZE*PIXEL_SIZE;
    canvas.height = DISPLAY_SIZE*PIXEL_SIZE;

    bgcanvas = document.getElementById("bgcanvas");

    bgcanvas.width = DISPLAY_SIZE*PIXEL_SIZE;
    bgcanvas.height = DISPLAY_SIZE*PIXEL_SIZE;

    const bgc = bgcanvas.getContext("2d");

    var background = new Image();
    background.src = "./img/fakeBackground.PNG";

    background.onload = () =>{
        bgc.drawImage(background,0,0);
    };

    c.willReadFrequently = true;

}

const setUpPixelMatrix = () =>{

    let pixelID = 1;
    let idxi = 0,idxj = 0;
    for(let i = 0;i<=DISPLAY_SIZE*PIXEL_SIZE - PIXEL_SIZE;i+=PIXEL_SIZE)
    {
        const row = [];
        for(let j = 0;j<=DISPLAY_SIZE*PIXEL_SIZE - PIXEL_SIZE;j+=PIXEL_SIZE)
        {
            let x1 = i;
            let y1 = j;
            let x2 = i + PIXEL_SIZE;
            let y2 = j + PIXEL_SIZE;
            const pixel = {
                x1 : x1,
                y1 : y1,
                x2 : x2,
                y2 : y2,
                color : "#FF000000",
                painted : false,
                id : pixelID++,
                i : idxi,
                j : idxj,
                numOfPaints : 0
            }
            row.push(pixel);
            idxj++;
        }
        idxi++;
        idxj = 0;
        pixels.push(row);
    }

}