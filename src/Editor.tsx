import {useEffect, useRef } from 'react';
import './editor.css';
import { 
CANVAS_SIZE,
CSS_CANVAS_SIZE,
SCALE_FACTOR,
MAX_ZOOM_AMOUNT,
BG_COLORS
}
 from './constants';
import Mouse from './Scene/Mouse';
import Scene from './Scene/Scene';
import { Pencil } from './Tools/Pencil';
import { Eraser } from './Tools/Eraser';


//i guess none  of this variables declared outside component need to be a state
//////////////////////////////////////////////////////////
let canvas : HTMLCanvasElement,bgCanvas : HTMLCanvasElement;
let ctx : CanvasRenderingContext2D; 
let BGctx : CanvasRenderingContext2D;


//canvas transformation matrix
let matrix = [1, 0, 0, 1, 0, 0];

let pixel_size : number;
let display_size : number;
let bgTileSize : number;

const scene = new Scene();
const mouse = new Mouse();

const keyMap = new Map<string,boolean>();

let currentScale = 1;
// const defaultPenSize = pixel_size;
let penSize : number;
//////////////////////////////////////////////////////////

export default function Editor() : JSX.Element{

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const bgCanvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(()=>{
        setUpVariables();
        //TODO: i need to save current drawing on browser
        //problem: for big drawing sizes like 500x500 its impractical to save it on local storage, and even on indexedDB
        //possible solution: save canvas as png, store it on indexedDB, then after page load, get the image and parse it using some library and store info on scene.pixels(lol)      draw();
        setUpCanvas();
        scene.initilializePixelMatrix(display_size,pixel_size,bgTileSize);
        addEventListeners();

        draw();

        return ()=>{
            removeEventListeners();
        }


    },[]);


    function setUpCanvas(){
        canvas = canvasRef.current!;
        bgCanvas = bgCanvasRef.current!;
        ctx = canvas.getContext("2d")!;
        BGctx = canvas.getContext("2d")!;
        canvas.width = display_size;
        canvas.height = display_size;
        bgCanvas.width = display_size;
        bgCanvas.height = display_size;

        canvas.style.width = `${CSS_CANVAS_SIZE}px`;
        canvas.style.height = `${CSS_CANVAS_SIZE}px`;
        bgCanvas.style.width = `${CSS_CANVAS_SIZE}px`;
        bgCanvas.style.height = `${CSS_CANVAS_SIZE}px`;

    }


    return <div className = "editor">
        <canvas id="canvas" ref = {canvasRef}> Your browser does not support canvas </canvas>
        <canvas id="BGcanvas" ref = {bgCanvasRef}> Your browser does not support canvas </canvas>
    </div>


}


function draw(){
    matrix[0] = currentScale;
    matrix[1] = 0;
    matrix[2] = 0;
    matrix[3] = currentScale;
    matrix[4] = mouse.originX;
    matrix[5] = mouse.originY;

    ctx.clearRect(0, 0, display_size, display_size);
    BGctx.clearRect(0, 0, display_size, display_size);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    BGctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
    BGctx.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);

    let firstInRow = 1;
    let a = firstInRow;

    //draw background
    for (let i = 0; i <= display_size; i += pixel_size * bgTileSize) {
        if (firstInRow) a = 0;
        else a = 1;
        firstInRow = firstInRow ? 0 : 1;
        for (let j = 0; j <= display_size; j += pixel_size * bgTileSize) {
            BGctx.fillStyle = a ? BG_COLORS[0] : BG_COLORS[1];
            BGctx.fillRect(i, j, pixel_size * bgTileSize, pixel_size * bgTileSize);
            a = a ? 0 : 1;
        }
    }


    //draw pixel matrix
    for (let i = 0; i < scene.pixels.length; i++) {
        for (let j = 0; j < scene.pixels[i].length; j++) {
            if (!scene.pixels[i][j].colorStack.isEmpty()) {
            // ctx.fillStyle = scene.pixels[i][j].color!;
            ctx.fillStyle = scene.pixels[i][j].colorStack.top()!;
            ctx.fillRect(scene.pixels[i][j].x1, scene.pixels[i][j].y1, pixel_size, pixel_size);
            }
        }
    }

}
function handleZoom(e : WheelEvent){
        
    if (e.deltaY < 0 && scene.zoomAmount < MAX_ZOOM_AMOUNT ) {
        scene.zoomAmount++;
        currentScale *= SCALE_FACTOR;
        //calculate new origin from wich the canvas will scale from
        mouse.originX = Math.floor(mouse.x - (mouse.x - mouse.originX) * SCALE_FACTOR);
        mouse.originY = Math.floor(mouse.y - (mouse.y - mouse.originY) * SCALE_FACTOR);
        mouse.history.push({ x: mouse.x, y : mouse.y });
    } else if (e.deltaY > 0 && scene.zoomAmount > 0) {
        scene.zoomAmount--;
        currentScale *= 1 / SCALE_FACTOR;
        const m = mouse.history.pop();
        mouse.originX = Math.floor(m!.x - (m!.x - mouse.originX) * (1 / SCALE_FACTOR));
        mouse.originY = Math.floor(m!.y - (m!.y - mouse.originY) * (1 / SCALE_FACTOR));

        if (scene.zoomAmount == 0) {
        mouse.originX = 0;
        mouse.originY = 0;
        }
    }
    //scale and draw pixel matrix
    draw();
}

function setUpVariables(){
    if (CANVAS_SIZE < 50) {
        display_size = CANVAS_SIZE * 10 * 10;
        pixel_size = 10 * 10;
      } else {
        display_size = CANVAS_SIZE * 10;
        pixel_size = 10;
    }
    bgTileSize = CANVAS_SIZE >= 100 ? 10 : 1;
    penSize = pixel_size;
}


function handleFirstClick(eventName : string){
    //closure hehe
    return function(){
        mouse.isPressed = true;
        //TODO: Decouple mouse listeners from these function calls, functions can be called a super high number of times depending on device config and mouse type i guess
        if (scene.selectedTool === 'pencil'){
            scene.currentDraw.push(Pencil(eventName, scene, mouse,pixel_size, display_size,ctx, penSize, currentScale));
            //no need to call for draw in event listeners, when something like fillRect is called the canvas updates automatically
            //draw("mousedown");
        }else if (scene.selectedTool === 'eraser')
        {
            Eraser(eventName, mouse, scene, pixel_size, display_size, ctx, penSize, currentScale);
        }else if (scene.selectedTool === 'paintBucket')
        {
            //currentDraw.value.push(PaintBucket(event, isMousePressed, selectedColor, PIXEL_SIZE, DISPLAY_SIZE, pixels, defaultPenSize, ctx, originX, originY, currentScale, CANVAS_SIZE));
        }
    }
}

function handleMouseMove(event : MouseEvent ){
    const bounding = canvas.getBoundingClientRect();

    mouse.x = event.clientX - bounding.left;
    mouse.y = event.clientY - bounding.top;
    mouse.x = (display_size * mouse.x) / CSS_CANVAS_SIZE;
    mouse.y = (display_size * mouse.y) / CSS_CANVAS_SIZE;
    // console.log("here",mouse.isPressed);
    if (scene.selectedTool === 'pencil' && mouse.isPressed) {
        scene.currentDraw.push(Pencil("mousemove", scene, mouse,pixel_size, display_size,ctx, penSize, currentScale));
    }else if(scene.selectedTool === 'eraser' && mouse.isPressed)
    {
        Eraser("mousemove", mouse, scene, pixel_size, display_size, ctx, penSize, currentScale);
    }
        // currentDraw.value.push(Pen(event, eventName, isMousePressed, lastPixel, PIXEL_SIZE, DISPLAY_SIZE, pixels, ctx, penSize, selectedColor, currentPixelsMousePressed, currentScale, originX, originY, matrix, mousex, mousey));
    // } else if (erasing && isMousePressed) Eraser(event, eventName, isMousePressed, lastPixel, PIXEL_SIZE, DISPLAY_SIZE, pixels, ctx, penSize, originX, originY, currentScale, mousex, mousey);

} 

function handleTouchMove(event : TouchEvent){
    const bounding = canvas.getBoundingClientRect();
    mouse.x = event.touches[0].clientX - bounding.left;
    mouse.y = event.touches[0].clientY - bounding.top;
    mouse.x = (display_size * mouse.x) / CSS_CANVAS_SIZE; //rule of three to adjust mouse position based on css size of canvas
    mouse.y = (display_size * mouse.y) / CSS_CANVAS_SIZE;
    

    if (scene.selectedTool === 'pencil' && mouse.isPressed) {
        scene.currentDraw.push(Pencil("touchmove", scene, mouse,pixel_size, display_size,ctx, penSize, currentScale));
    }else if(scene.selectedTool === 'eraser' && mouse.isPressed)
    {
        Eraser("touchmove", mouse, scene, pixel_size, display_size, ctx, penSize, currentScale);
    }
        // currentDraw.value.push(Pen(event, eventName, isMousePressed, lastPixel, PIXEL_SIZE, DISPLAY_SIZE, pixels, ctx, penSize, selectedColor, currentPixelsMousePressed, currentScale, originX, originY, matrix, mousex, mousey));
    // } else if (erasing && isMousePressed) Eraser(event, eventName, isMousePressed, lastPixel, PIXEL_SIZE, DISPLAY_SIZE, pixels, ctx, penSize, originX, originY, currentScale, mousex, mousey);

    
}

function handleMouseUp(){
    mouse.isPressed = false;
    scene.lastPixel = null;
    if (scene.currentDraw.length > 0) {
        // undoStack.push(currentDraw.value);
    }

    scene.currentDraw = [];

    scene.currentPixelsMousePressed = new Map();
}

function handleOptionKeyPressed(event : KeyboardEvent){
    scene.checkKeys(event);
    keyMap.set(event.code,true);

    // checkKeyCombinations(event);
}

function addEventListeners(){
    canvas.addEventListener("wheel",handleZoom);
    "mousedown touchstart".split(" ").forEach((eventName) =>{
        canvas.addEventListener(eventName,handleFirstClick(eventName));
    })
    canvas.addEventListener('mousemove',handleMouseMove);
    canvas.addEventListener('touchmove',handleTouchMove);
    "mouseup touchend".split(" ").forEach((eventName) =>
        document.addEventListener(eventName,handleMouseUp)
    );
    document.addEventListener("keydown", handleOptionKeyPressed);
}

function removeEventListeners(){
    canvas.removeEventListener("wheel",handleZoom);
    "mousedown touchstart".split(" ").forEach((eventName) =>{
        canvas.removeEventListener(eventName,handleFirstClick(eventName));
    })
    canvas.removeEventListener('mousemove',handleMouseMove);
    canvas.removeEventListener('touchmove',handleTouchMove);
    "mouseup touchend".split(" ").forEach((eventName) =>
        document.removeEventListener(eventName,handleMouseUp)
    );
    document.removeEventListener("keydown", handleOptionKeyPressed);
}