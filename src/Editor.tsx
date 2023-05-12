import {Dispatch, SetStateAction, WheelEvent, useEffect, useRef } from 'react';
import './styles/editor.css';
import { 
CANVAS_SIZE,
CSS_CANVAS_SIZE,
SCALE_FACTOR,
MAX_ZOOM_AMOUNT,
BG_COLORS
}
 from './utils/constants';
import Mouse from './Scene/Mouse';
import Scene from './Scene/Scene';
import { Pencil } from './Tools/Pencil';
import { Eraser } from './Tools/Eraser';
import { undoLastDraw, undoStack } from './Tools/UndoRedo';
import { PaintBucket } from './Tools/PaintBucket';
import { Dropper } from './Tools/Dropper';


interface IEditor{
    selectedColor : string;
    selectedTool : string;
    onSetSelectedColor : Dispatch<SetStateAction<string>>
}

//i guess none  of this variables declared outside component need to be a state except penSize
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

export default function Editor(props : IEditor) : JSX.Element{
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const bgCanvasRef = useRef<HTMLCanvasElement>(null);

    const ctx = useRef<CanvasRenderingContext2D | null>(null);
    const BGctx = useRef<CanvasRenderingContext2D | null>(null);
    

    //i need to persist scene between re renders but i also dont want to trigger a re render every time i change it, i guess this works
    //this may be better than declaring it as a global variable
    const scene = useRef<Scene>(new Scene());
    

    useEffect(()=>{
        setUpVariables();
        //TODO: i need to save current drawing on browser
        //problem: for big drawing sizes like 500x500 its impractical to save it on local storage, and even on indexedDB
        //possible solution: save canvas as png, store it on indexedDB, then after page load, get the image and parse it using some library and store info on scene.current.pixels(lol)
        setUpCanvas();
        scene.current.initilializePixelMatrix(display_size,pixel_size,bgTileSize);
        draw();
        
    },[]);

    useEffect(()=>{

        //these event listeners have callback functions that use states
        function handleFirstClick(){
            mouse.isPressed = true;
            if (props.selectedTool === 'pencil'){
                console.log("before calling pencil:",props.selectedColor);
                scene.current.currentDraw.push(Pencil('mousedown', scene.current, mouse,pixel_size, display_size,ctx.current!, penSize, currentScale,props.selectedColor));
                //no need to call for draw in event listeners, when something like fillRect is called the canvas updates automatically
                //draw("mousedown");
            }else if (props.selectedTool === 'eraser')
            {
                Eraser('mousedown', mouse, scene.current, pixel_size, display_size, ctx.current!, penSize, currentScale);
            }else if (props.selectedTool === 'paintBucket')
            {
                scene.current.currentDraw.push(PaintBucket(scene.current,mouse,pixel_size,display_size,ctx.current!,currentScale,penSize,CANVAS_SIZE,props.selectedColor));
            }else if(props.selectedTool === 'dropper')
            {
                const color : string | undefined | null = Dropper(scene.current,mouse,currentScale,pixel_size);
                if(color)props.onSetSelectedColor(color);
            }
        }
        function handleFirstTouch(e : TouchEvent){
            //for mobile, first get the touched position (for desktop the position is updated in mousemove listener, this is not possible in mobile if first touched didnt happened yet), 
            //update mouse variabels, then call pencil

            const bounding = canvas.getBoundingClientRect();
            mouse.x = e.touches[0].clientX - bounding.left;
            mouse.y = e.touches[0].clientY - bounding.top;
            mouse.x = (display_size * mouse.x) / CSS_CANVAS_SIZE; //rule of three to adjust mouse position based on css size of canvas
            mouse.y = (display_size * mouse.y) / CSS_CANVAS_SIZE;

            mouse.isPressed = true;
            if (props.selectedTool === 'pencil'){
                scene.current.currentDraw.push(Pencil('touchstart', scene.current, mouse,pixel_size, display_size,ctx.current!, penSize, currentScale,props.selectedColor));
                //no need to call for draw in event listeners, when something like fillRect is called the canvas updates automatically
                //draw("mousedown");
            }else if (props.selectedTool === 'eraser')
            {
                Eraser('touchstart', mouse, scene.current, pixel_size, display_size, ctx.current!, penSize, currentScale);
            }else if (props.selectedTool === 'paintBucket')
            {
                scene.current.currentDraw.push(PaintBucket(scene.current,mouse,pixel_size,display_size,ctx.current!,currentScale,penSize,CANVAS_SIZE,props.selectedColor));
            }
        }

    
    function handleMouseMove(event : MouseEvent ){
        
        if(!canvas)return;
        //TODO: maybe decouple mouse listeners from these function calls, functions can be called a super high number of times depending on device config and mouse type i guess
        const bounding = canvas.getBoundingClientRect();
        mouse.x = event.clientX - bounding.left;
        mouse.y = event.clientY - bounding.top;
        mouse.x = (display_size * mouse.x) / CSS_CANVAS_SIZE;
        mouse.y = (display_size * mouse.y) / CSS_CANVAS_SIZE;
        if (props.selectedTool === 'pencil' && mouse.isPressed) {
            scene.current.currentDraw.push(Pencil("mousemove", scene.current, mouse,pixel_size, display_size,ctx.current!, penSize, currentScale,props.selectedColor));
        }else if(props.selectedTool === 'eraser' && mouse.isPressed)
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
        
    
        if (props.selectedTool === 'pencil' && mouse.isPressed) {
            scene.current.currentDraw.push(Pencil("touchmove", scene.current, mouse,pixel_size, display_size,ctx.current!, penSize, currentScale,props.selectedColor));
        }else if(props.selectedTool === 'eraser' && mouse.isPressed)
        {
            Eraser("touchmove", mouse, scene.current, pixel_size, display_size, ctx.current!, penSize, currentScale);
        }
            // currentDraw.value.push(Pen(event, eventName, isMousePressed, lastPixel, PIXEL_SIZE, DISPLAY_SIZE, pixels, ctx, penSize, selectedColor, currentPixelsMousePressed, currentScale, originX, originY, matrix, mousex, mousey));
        // } else if (erasing && isMousePressed) Eraser(event, eventName, isMousePressed, lastPixel, PIXEL_SIZE, DISPLAY_SIZE, pixels, ctx, penSize, originX, originY, currentScale, mousex, mousey);
    
        
    }

    function handleOptionKeyPressed(event : KeyboardEvent){
        checkKeys(event);
        checkKeyCombinations(event);
    }

    function checkKeys(event : KeyboardEvent){

        if(['p','P','1'].indexOf(event.key) > -1)
        {
            // props.selectedTool = 'pencil';
        }else if(['e','E','2'].indexOf(event.key) > -1)
        {
            // props.selectedTool = 'eraser';
        }else if(['b','B','3'].indexOf(event.key) > -1)
        {
            // props.selectedTool = 'paintBucket';
        }


    }


        document.addEventListener('keydown',handleOptionKeyPressed);
        document.addEventListener('mouseup',handleMouseUp);
        document.addEventListener('touchend',handleMouseUp);
        canvas.addEventListener('mousedown',handleFirstClick);
        canvas.addEventListener('touchstart',handleFirstTouch);
        canvas.addEventListener('touchmove',handleTouchMove);
        canvas.addEventListener('mousemove',handleMouseMove);
        
        return ()=>{
            document.removeEventListener('keydown',handleOptionKeyPressed);
            document.removeEventListener('mouseup',handleMouseUp);
            document.removeEventListener('touchend',handleMouseUp);
            canvas.removeEventListener('mousedown',handleFirstClick);
            canvas.removeEventListener('touchstart',handleFirstTouch);
            canvas.removeEventListener('touchmove',handleTouchMove);
            canvas.removeEventListener('mousemove',handleMouseMove);
        }


    },[props.selectedColor,props.selectedTool]);


    
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
    
    
    function setUpVariables(){
        //TODO: Refactor this shitty logic
        //canvas with sizes less than 50x50 look blurry without this
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
        display_size*=window.devicePixelRatio;
        pixel_size*=window.devicePixelRatio;
        

        //TODO: allow user to toggle the option to have a bg tile for every pixel (bgTileSize === 1)
        const factors = [];
        for(let i = 1;i<=CANVAS_SIZE;i++)
        {
            if(CANVAS_SIZE%i === 0)factors.push(i);
        }
        
        const mid = Math.floor(factors.length/2);

        bgTileSize = factors[mid];

        //if CANVAS_SIZE is a prime number
        if(bgTileSize === CANVAS_SIZE)
        bgTileSize = CANVAS_SIZE <= 100 ? 1 : 10;

        // bgTileSize = CANVAS_SIZE >= 100 ? 10 : 8;
        // bgTileSize = 10;
        

        penSize = pixel_size;
    }


    function handleZoom(e : WheelEvent){
                
        if (e.deltaY < 0 && scene.current.zoomAmount < MAX_ZOOM_AMOUNT ) {
            scene.current.zoomAmount++;
            currentScale *= SCALE_FACTOR;
            //calculate new origin from which the canvas will scale from
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
    

        
    
    function handleMouseUp(e : TouchEvent | MouseEvent){
        e.preventDefault();
        mouse.isPressed = false;
        scene.current.lastPixel = null;
        if (scene.current.currentDraw.length > 0) {
            undoStack.push(scene.current.currentDraw);
        }
    
        scene.current.currentDraw = [];
    
        scene.current.currentPixelsMousePressed = new Map();
    }
    
    function checkKeyCombinations(event : KeyboardEvent)
    {
        if(event.ctrlKey && event.code === 'KeyZ')
        {
            undoLastDraw(scene.current,penSize,ctx.current!);
        }
    }



    return <div className = "editor" style = {{height:CSS_CANVAS_SIZE}}>
        <canvas
        id="canvas" ref = {canvasRef}
        onWheel={handleZoom}
        > Your browser does not support canvas </canvas>
        <canvas id="BGcanvas" ref = {bgCanvasRef}> Your browser does not support canvas </canvas>
    </div>


}


