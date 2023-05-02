import { useEffect, useRef } from 'react';
import './editor.css';
import { 
CANVAS_SIZE,
CSS_CANVAS_SIZE,
SCALE_FACTOR,
MAX_ZOOM_AMOUNT
}
 from './constants';
import Mouse from './Scene/Mouse';
import Scene from './Scene/Scene';
import { Pencil } from './Tools/Pencil';


let canvas : HTMLCanvasElement,bgCanvas : HTMLCanvasElement;
let ctx : CanvasRenderingContext2D; 
let BGctx : CanvasRenderingContext2D;


//canvas transformation matrix
let matrix = [1, 0, 0, 1, 0, 0];

let pixel_size : number;
let display_size : number;

if (CANVAS_SIZE < 50) {
    display_size = CANVAS_SIZE * 10 * 10;
    pixel_size = 10 * 10;
  } else {
    display_size = CANVAS_SIZE * 10;
    pixel_size = 10;
}

const scene = new Scene(display_size,pixel_size);
const mouse = new Mouse();

let currentScale = 1;
const bgDrawingSize = CANVAS_SIZE >= 100 ? 10 : 1;
// const defaultPenSize = pixel_size;
let penSize = pixel_size;



export default function Editor() : JSX.Element{

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const bgCanvasRef = useRef<HTMLCanvasElement>(null);


    useEffect(()=>{

        setUpCanvas();
        addEventListeners();
        //TODO: save current drawing to local storage after every operation. Retrieve drawing here and put it in the pixel matrix before calling draw()
        draw();


        function addEventListeners(){

            //TODO: add pinch detection to zoom on mobile
            canvas.addEventListener("wheel", (e) => {
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
                });

            "mousedown touchstart".split(" ").forEach((eventName) =>
            canvas.addEventListener(eventName, () => {
                mouse.isPressed = true;
                //TODO: Decouple mouse listeners from these function calls, functions can be called a super high number of times depending on device config and mouse type i guess
                if (scene.selectedTool === 'pencil'){
                    scene.currentDraw.push(Pencil(eventName, scene, mouse,pixel_size, display_size,ctx, penSize, currentScale));
                    //no need to call for draw in event listeners, when something like fillRect is called the canvas updates automatically
                    //draw("mousedown");
                }else if (scene.selectedTool === 'eraser')
                {
                    // Eraser(event, eventName, isMousePressed, lastPixel, PIXEL_SIZE, DISPLAY_SIZE, pixels, ctx, penSize, originX, originY, currentScale, mousex, mousey);
                    console.log("erasing");
                }else if (scene.selectedTool === 'paintBucket')
                {
                    //currentDraw.value.push(PaintBucket(event, isMousePressed, selectedColor, PIXEL_SIZE, DISPLAY_SIZE, pixels, defaultPenSize, ctx, originX, originY, currentScale, CANVAS_SIZE));
                    console.log("paint bucketing");
                }
                })
            );
    
            "mousemove touchmove".split(" ").forEach((eventName) =>
                document.addEventListener(eventName, (event) => {
                const bounding = canvas.getBoundingClientRect();
                if (event instanceof TouchEvent) {
                    mouse.x = event.touches[0].clientX - bounding.left;
                    mouse.y = event.touches[0].clientY - bounding.top;
                    mouse.x = (display_size * mouse.x) / CSS_CANVAS_SIZE; //adjusting mouse position based on css size of canvas
                    mouse.y = (display_size * mouse.y) / CSS_CANVAS_SIZE;
                } else if(event instanceof MouseEvent) {
                    mouse.x = event.clientX - bounding.left;
                    mouse.y = event.clientY - bounding.top;
                    mouse.x = (display_size * mouse.x) / CSS_CANVAS_SIZE;
                    mouse.y = (display_size * mouse.y) / CSS_CANVAS_SIZE;
                }
    
                //paintMousePosition();
    
                // mousexs = parseInt((mousex - panX) / currentScale);
                // mouseys = parseInt((mousey - panY) / currentScale);
                if (scene.selectedTool === 'pencil' && mouse.isPressed) {
                    scene.currentDraw.push(Pencil(eventName, scene, mouse,pixel_size, display_size,ctx, penSize, currentScale));
                }
                    // currentDraw.value.push(Pen(event, eventName, isMousePressed, lastPixel, PIXEL_SIZE, DISPLAY_SIZE, pixels, ctx, penSize, selectedColor, currentPixelsMousePressed, currentScale, originX, originY, matrix, mousex, mousey));
                // } else if (erasing && isMousePressed) Eraser(event, eventName, isMousePressed, lastPixel, PIXEL_SIZE, DISPLAY_SIZE, pixels, ctx, penSize, originX, originY, currentScale, mousex, mousey);
                })
            );
    
            "mouseup touchend".split(" ").forEach((eventName) =>
                document.addEventListener(eventName, () => {
                mouse.isPressed = false;
                scene.lastPixel = null;
                if (scene.currentDraw.length > 0) {
                    // undoStack.push(currentDraw.value);
                }
                scene.currentDraw = [];
    
                scene.currentPixelsMousePressed = new Map();
                })
            );
                
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
        for (let i = 0; i <= display_size; i += pixel_size * bgDrawingSize) {
            if (firstInRow) a = 0;
            else a = 1;
            firstInRow = firstInRow ? 0 : 1;
            for (let j = 0; j <= display_size; j += pixel_size * bgDrawingSize) {
                BGctx.fillStyle = a ? "#696969" : "#858585";
                BGctx.fillRect(i, j, pixel_size * bgDrawingSize, pixel_size * bgDrawingSize);
                a = a ? 0 : 1;
            }
        }

        //draw pixel matrix
        for (let i = 0; i < scene.pixels.length; i++) {
            for (let j = 0; j < scene.pixels[i].length; j++) {
                if (scene.pixels[i][j].numOfPaints > 0) {
                ctx.fillStyle = scene.pixels[i][j].color!;
                ctx.fillRect(scene.pixels[i][j].x1, scene.pixels[i][j].y1, pixel_size, pixel_size);
                }
            }
        }

    }

    


    return <div className = "editor">
        <canvas id="canvas" ref = {canvasRef}> Your browser does not support canvas </canvas>
        <canvas id="BGcanvas" ref = {bgCanvasRef}> Your browser does not support canvas </canvas>
    </div>

}