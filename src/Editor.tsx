import {KeyboardEvent, MouseEvent, TouchEvent, WheelEvent, useEffect, useRef } from 'react';
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


//i guess none  of this variables declared outside component need to be a state for except penSize
//TODO: set CANVAS_SIZE and pen size as state and globally available with context
//////////////////////////////////////////////////////////
let canvas : HTMLCanvasElement,bgCanvas : HTMLCanvasElement;
// let ctx : CanvasRenderingContext2D; 
// let BGctx : CanvasRenderingContext2D;


const mouse = new Mouse();

//canvas transformation matrix
let matrix = [1, 0, 0, 1, 0, 0];

let pixel_size : number;
let display_size : number;
let bgTileSize : number;


const keyMap = new Map<string,boolean>();

let currentScale = 1;
// const defaultPenSize = pixel_size;
let penSize : number;
//////////////////////////////////////////////////////////

export default function Editor({counter,onSetCounter} : {counter : number,onSetCounter : ()=>void}) : JSX.Element{
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const bgCanvasRef = useRef<HTMLCanvasElement>(null);

    const ctx = useRef<CanvasRenderingContext2D | null>(null);
    const BGctx = useRef<CanvasRenderingContext2D | null>(null);
    
    
    //i need to persist scene between re renders but i also dont want to trigger a re render every time i change it, i guess this works
    //this may be better than declaring it as a global variable
    const scene = useRef<Scene>(new Scene());
    

    useEffect(()=>{
        console.log("aqui");
        setUpVariables();
        //TODO: i need to save current drawing on browser
        //problem: for big drawing sizes like 500x500 its impractical to save it on local storage, and even on indexedDB
        //possible solution: save canvas as png, store it on indexedDB, then after page load, get the image and parse it using some library and store info on scene.current.pixels(lol)
        setUpCanvas();
        scene.current.initilializePixelMatrix(display_size,pixel_size,bgTileSize);
        draw();


        
    },[]);




    useEffect(()=>{
        console.log("current scene:",scene.current);
        console.log("current mouse:",mouse);
        //draw();
    },[counter]);
    

    function setUpCanvas(){
        canvas = canvasRef.current!;
        bgCanvas = bgCanvasRef.current!;
        ctx.current = canvas.getContext("2d")!;
        BGctx.current = canvas.getContext("2d")!;
        canvas.width = display_size;
        canvas.height = display_size;
        bgCanvas.width = display_size;
        bgCanvas.height = display_size;

        canvas.style.width = `${CSS_CANVAS_SIZE}px`;
        canvas.style.height = `${CSS_CANVAS_SIZE}px`;
        bgCanvas.style.width = `${CSS_CANVAS_SIZE}px`;
        bgCanvas.style.height = `${CSS_CANVAS_SIZE}px`;

    }

    function draw(){
        matrix[0] = currentScale;
        matrix[1] = 0;
        matrix[2] = 0;
        matrix[3] = currentScale;
        matrix[4] = mouse.originX;
        matrix[5] = mouse.originY;
    
        ctx.current!.clearRect(0, 0, display_size, display_size);
        BGctx.current!.clearRect(0, 0, display_size, display_size);
        ctx.current!.setTransform(1, 0, 0, 1, 0, 0);
        BGctx.current!.setTransform(1, 0, 0, 1, 0, 0);
    
        ctx.current!.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
        BGctx.current!.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
    
        let firstInRow = 1;
        let a = firstInRow;
    
        //draw background
        for (let i = 0; i <= display_size; i += pixel_size * bgTileSize) {
            if (firstInRow) a = 0;
            else a = 1;
            firstInRow = firstInRow ? 0 : 1;
            for (let j = 0; j <= display_size; j += pixel_size * bgTileSize) {
                BGctx.current!.fillStyle = a ? BG_COLORS[0] : BG_COLORS[1];
                BGctx.current!.fillRect(i, j, pixel_size * bgTileSize, pixel_size * bgTileSize);
                a = a ? 0 : 1;
            }
        }
    
    
        //draw pixel matrix
        for (let i = 0; i < scene.current.pixels.length; i++) {
            for (let j = 0; j < scene.current.pixels[i].length; j++) {
                if (!scene.current.pixels[i][j].colorStack.isEmpty()) {
                // ctx.current!.fillStyle = scene.current.pixels[i][j].color!;
                ctx.current!.fillStyle = scene.current.pixels[i][j].colorStack.top()!;
                ctx.current!.fillRect(scene.current.pixels[i][j].x1, scene.current.pixels[i][j].y1, pixel_size, pixel_size);
                }
            }
        }
    
    }

    
    
    function setUpVariables(){
        //TODO: right now if i dont do this, canvas with sizes less than 50x50 look blurry
        if (CANVAS_SIZE < 50) {
            display_size = CANVAS_SIZE * 10 * 10;
            pixel_size = 10 * 10;
          } else {
            display_size = CANVAS_SIZE * 10;
            pixel_size = 10;
            //TODO: On small devices, pixel size should be 1
            //also, maybe set max display size possible on mobile to be the width of the screen
            //or simply allow user to move the canvas
        }
        console.log("DPR:",window.devicePixelRatio);
        display_size*=window.devicePixelRatio;
        pixel_size*=window.devicePixelRatio;
        bgTileSize = CANVAS_SIZE >= 100 ? 10 : 1;
        penSize = pixel_size;
    }


    function handleZoom(e : WheelEvent){
                
        if (e.deltaY < 0 && scene.current.zoomAmount < MAX_ZOOM_AMOUNT ) {
            scene.current.zoomAmount++;
            currentScale *= SCALE_FACTOR;
            //calculate new origin from wich the canvas will scale from
            mouse.originX = Math.floor(mouse.x - (mouse.x - mouse.originX) * SCALE_FACTOR);
            mouse.originY = Math.floor(mouse.y - (mouse.y - mouse.originY) * SCALE_FACTOR);
            mouse.history.push({ x: mouse.x, y : mouse.y });
        } else if (e.deltaY > 0 && scene.current.zoomAmount > 0) {
            scene.current.zoomAmount--;
            currentScale *= 1 / SCALE_FACTOR;
            const m = mouse.history.pop();
            mouse.originX = Math.floor(m!.x - (m!.x - mouse.originX) * (1 / SCALE_FACTOR));
            mouse.originY = Math.floor(m!.y - (m!.y - mouse.originY) * (1 / SCALE_FACTOR));
    
            if (scene.current.zoomAmount == 0) {
            mouse.originX = 0;
            mouse.originY = 0;
            }
        }

        //setZoom(zoom + 1);
        //scale and draw pixel matrix
        draw();
    }
    
    // function handleFirstClick(eventName : string){
    //     //closure hehe
    //     return function(){
    //         mouse.isPressed = true;
    //         if (scene.current.selectedTool === 'pencil'){
    //             scene.current.currentDraw.push(Pencil(eventName, scene.current, mouse,pixel_size, display_size,ctx.current!, penSize, currentScale));
    //             //no need to call for draw in event listeners, when something like fillRect is called the canvas updates automatically
    //             //draw("mousedown");
    //         }else if (scene.current.selectedTool === 'eraser')
    //         {
    //             Eraser(eventName, mouse, scene.current, pixel_size, display_size, ctx.current!, penSize, currentScale);
    //         }else if (scene.current.selectedTool === 'paintBucket')
    //         {
    //             //currentDraw.value.push(PaintBucket(event, isMousePressed, selectedColor, PIXEL_SIZE, DISPLAY_SIZE, pixels, defaultPenSize, ctx, originX, originY, currentScale, CANVAS_SIZE));
    //         }
    //     }
    // }

        function handleFirstClick(eventName : string){
            mouse.isPressed = true;
            if (scene.current.selectedTool === 'pencil'){
                scene.current.currentDraw.push(Pencil(eventName, scene.current, mouse,pixel_size, display_size,ctx.current!, penSize, currentScale));
                //no need to call for draw in event listeners, when something like fillRect is called the canvas updates automatically
                //draw("mousedown");
            }else if (scene.current.selectedTool === 'eraser')
            {
                Eraser(eventName, mouse, scene.current, pixel_size, display_size, ctx.current!, penSize, currentScale);
            }else if (scene.current.selectedTool === 'paintBucket')
            {
                //currentDraw.value.push(PaintBucket(event, isMousePressed, selectedColor, PIXEL_SIZE, DISPLAY_SIZE, pixels, defaultPenSize, ctx, originX, originY, currentScale, CANVAS_SIZE));
            }
        }

    
    function handleMouseMove(event : MouseEvent ){
        
        if(!canvas)return;
        //TODO: Decouple mouse listeners from these function calls, functions can be called a super high number of times depending on device config and mouse type i guess
        const bounding = canvas.getBoundingClientRect();
        mouse.x = event.clientX - bounding.left;
        mouse.y = event.clientY - bounding.top;
        mouse.x = (display_size * mouse.x) / CSS_CANVAS_SIZE;
        mouse.y = (display_size * mouse.y) / CSS_CANVAS_SIZE;
        // console.log("here",mouse.isPressed);
        if (scene.current.selectedTool === 'pencil' && mouse.isPressed) {
            scene.current.currentDraw.push(Pencil("mousemove", scene.current, mouse,pixel_size, display_size,ctx.current!, penSize, currentScale));
        }else if(scene.current.selectedTool === 'eraser' && mouse.isPressed)
        {
            Eraser("mousemove", mouse, scene.current, pixel_size, display_size, ctx.current!, penSize, currentScale);
        }
            // currentDraw.value.push(Pen(event, eventName, isMousePressed, lastPixel, PIXEL_SIZE, DISPLAY_SIZE, pixels, ctx.current!, penSize, selectedColor, currentPixelsMousePressed, currentScale, originX, originY, matrix, mousex, mousey));
        // } else if (erasing && isMousePressed) Eraser(event, eventName, isMousePressed, lastPixel, PIXEL_SIZE, DISPLAY_SIZE, pixels, ctx.current!, penSize, originX, originY, currentScale, mousex, mousey);
    
    } 
    
    function handleTouchMove(event : TouchEvent){
        const bounding = canvas.getBoundingClientRect();
        mouse.x = event.touches[0].clientX - bounding.left;
        mouse.y = event.touches[0].clientY - bounding.top;
        mouse.x = (display_size * mouse.x) / CSS_CANVAS_SIZE; //rule of three to adjust mouse position based on css size of canvas
        mouse.y = (display_size * mouse.y) / CSS_CANVAS_SIZE;
        
    
        if (scene.current.selectedTool === 'pencil' && mouse.isPressed) {
            scene.current.currentDraw.push(Pencil("touchmove", scene.current, mouse,pixel_size, display_size,ctx.current!, penSize, currentScale));
        }else if(scene.current.selectedTool === 'eraser' && mouse.isPressed)
        {
            Eraser("touchmove", mouse, scene.current, pixel_size, display_size, ctx.current!, penSize, currentScale);
        }
            // currentDraw.value.push(Pen(event, eventName, isMousePressed, lastPixel, PIXEL_SIZE, DISPLAY_SIZE, pixels, ctx, penSize, selectedColor, currentPixelsMousePressed, currentScale, originX, originY, matrix, mousex, mousey));
        // } else if (erasing && isMousePressed) Eraser(event, eventName, isMousePressed, lastPixel, PIXEL_SIZE, DISPLAY_SIZE, pixels, ctx, penSize, originX, originY, currentScale, mousex, mousey);
    
        
    }
    
    function handleMouseUp(){
        mouse.isPressed = false;
        scene.current.lastPixel = null;
        if (scene.current.currentDraw.length > 0) {
            // undoStack.push(currentDraw.value);
        }
    
        scene.current.currentDraw = [];
    
        scene.current.currentPixelsMousePressed = new Map();
    }
    
    function handleOptionKeyPressed(event : KeyboardEvent){
        scene.current.checkKeys(event);
        keyMap.set(event.code,true);
        console.log("key pressed");
        // checkKeyCombinations(event);
    }
    
    // function addEventListeners(){
    //     //canvas.addEventListener("wheel",handleZoom);
    //     // "mousedown touchstart".split(" ").forEach((eventName) =>{
    //     //     canvas.addEventListener(eventName,handleFirstClick(eventName));
    //     // })
    //     canvas.addEventListener('mousemove',handleMouseMove);
    //     canvas.addEventListener('touchmove',handleTouchMove);
    //     "mouseup touchend".split(" ").forEach((eventName) =>
    //         document.addEventListener(eventName,handleMouseUp)
    //     );
    //     document.addEventListener("keydown", handleOptionKeyPressed);
    // }
    
    // function removeEventListeners(){
    //     //canvas.removeEventListener("wheel",handleZoom);
    //     // "mousedown touchstart".split(" ").forEach((eventName) =>{
    //     //     canvas.removeEventListener(eventName,handleFirstClick(eventName));
    //     // })
    //     canvas.removeEventListener('mousemove',handleMouseMove);
    //     canvas.removeEventListener('touchmove',handleTouchMove);
    //     "mouseup touchend".split(" ").forEach((eventName) =>
    //         document.removeEventListener(eventName,handleMouseUp)
    //     );
    //     document.removeEventListener("keydown", handleOptionKeyPressed);
    // }


    //TODO: try to add directly here and see ifs theres an impact, if there isnt, Brazil

    return <div className = "editor">
        <button onClick={onSetCounter} style={{width:'100px',height:'50px',zIndex:'10',position:'absolute',left:'50'}}>{counter}</button>
        <canvas
        id="canvas" ref = {canvasRef}
        onWheel={handleZoom}
        onMouseDown={()=>handleFirstClick('mousestart')}
        onTouchStart={()=>handleFirstClick('mousestart')}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleMouseUp}
        onKeyDown={handleOptionKeyPressed}
        > Your browser does not support canvas </canvas>
        <canvas id="BGcanvas" ref = {bgCanvasRef}> Your browser does not support canvas </canvas>
    </div>


}


