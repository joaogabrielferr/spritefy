import {useEffect, useRef,WheelEvent,MouseEvent,TouchEvent,PointerEvent, useContext } from 'react';
import './styles/editor.css';
import { 
CANVAS_SIZE,
MAX_ZOOM_AMOUNT,
BG_COLORS,
SCALE_FACTOR,
CIRCLE_RADIUS_INCREASE_FACTOR
}
 from './utils/constants';
import Mouse from './scene/Mouse';
import Scene from './scene/Scene';
import { Pencil } from './Tools/Pencil';
import { Eraser } from './Tools/Eraser';
import {undoLastDraw, undoStack } from './Tools/UndoRedo';
import { PaintBucket } from './Tools/PaintBucket';
import { Dropper } from './Tools/Dropper';
import { Line } from './Tools/Line';
import { Pixel } from './types';
import { removeDraw } from './Tools/helpers/RemoveDraw';
import { cleanDraw } from './Tools/helpers/CleanDraw';
import { translateDrawToMainCanvas } from './Tools/helpers/TranslateDrawToMainCanvas';
import { Square } from './Tools/Square';
import { Circle } from './Tools/Circle';
import { selectedColorContext } from './contexts/selectedColor/selectedColorContext';
import { selectedToolContext } from './contexts/selectedTool/selectedToolContext';



interface IEditor{
    cssCanvasSize : number;
    isMobile : boolean
}


//////////////////////////////////////////////////////////

let canvas : HTMLCanvasElement,topCanvas : HTMLCanvasElement;
let outerDiv : HTMLDivElement;

const mouse = new Mouse();

let pixel_size : number;
let display_size : number;
let bgTileSize : number;


let currentScale = 1;
// const defaultPenSize = pixel_size;
let penSize : number;


let coordinatesElement : HTMLParagraphElement;

let originalCanvasWidth : number;


//////////////////////////////////////////////////////////

export default function Editor({cssCanvasSize,isMobile} : IEditor) : JSX.Element{
    

    const {selectedColor,setSelectedColor} = useContext(selectedColorContext);
    const {selectedTool} = useContext(selectedToolContext);

    const canvasRef = useRef<HTMLCanvasElement>(null); //main canvas
    const topCanvasRef = useRef<HTMLCanvasElement>(null); //top canvas for temporary draws (like in line tool, square tool, circle tool, etc)
    const outerDivRef = useRef<HTMLDivElement>(null); //div that wraps all canvas

    const ctx = useRef<CanvasRenderingContext2D | null>(null);
    const topCtx = useRef<CanvasRenderingContext2D | null>(null);

    const firstInit = useRef(false); //for development
    

    //i need to persist scene between re renders but i also dont want to trigger a re render every time i change it, i guess this works
    //this may be better than declaring it as a global variable
    const scene = useRef<Scene>(new Scene());
    

    useEffect(()=>{

        setUpVariables();
        //TODO: i need to save current drawing on browser
        //problem: for big drawing sizes like 500x500 its impractical to save it on local storage, and even on indexedDB
        //possible solution: save canvas as png, store it on indexedDB, then after page load, get the image and parse it using some library and store info on scene.current.pixels(lol)
        
        //setting up canvas
        canvas = canvasRef.current!;
        topCanvas = topCanvasRef.current!;
        outerDiv = outerDivRef.current!;

        ctx.current = canvas.getContext("2d")!;
        topCtx.current = topCanvas.getContext("2d")!;

        canvas.width = display_size;
        canvas.height = display_size;
      
        topCanvas.width = display_size;
        topCanvas.height = display_size;
        
        if(isMobile)
        {
            canvas.style.width = `${cssCanvasSize}px`;
            canvas.style.height = `${cssCanvasSize}px`;

            topCanvas.style.width = `${cssCanvasSize}px`;
            topCanvas.style.height = `${cssCanvasSize}px`;
            originalCanvasWidth = cssCanvasSize;
        }else
        {
            canvas.style.width = `${cssCanvasSize - 50}px`;
            canvas.style.height = `${cssCanvasSize - 50}px`;

            topCanvas.style.width = `${cssCanvasSize - 50}px`;
            topCanvas.style.height = `${cssCanvasSize - 50}px`;
            originalCanvasWidth = cssCanvasSize - 50;

        }


        if(!firstInit.current)
        {
            scene.current.initilializePixelMatrix(display_size,pixel_size,bgTileSize);
            firstInit.current = true;
        }
        
        draw();
        
        //originalSize = cssCanvasSize - 50;

        coordinatesElement = document.getElementById('coordinates') as HTMLParagraphElement;
        

    },[cssCanvasSize,isMobile]);
    // },[]);

    function setUpVariables(){


        pixel_size = 1;
        display_size = CANVAS_SIZE;

        
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
        

        penSize = pixel_size;
    }


    useEffect(()=>{

        document.addEventListener('keydown',checkKeyCombinations);
        
        return ()=>{
            document.removeEventListener('keydown',checkKeyCombinations);
        }

    },[]);




    
    function draw(){

    
        let firstInRow = 1;
        let a = firstInRow;
    
        //draw background
        for (let i = 0; i <= display_size; i += pixel_size * bgTileSize) {
            if (firstInRow) a = 0;
            else a = 1;
            firstInRow = firstInRow ? 0 : 1;
            for (let j = 0; j <= display_size; j += pixel_size * bgTileSize) {
                ctx.current!.fillStyle = a ? BG_COLORS[0] : BG_COLORS[1];
                ctx.current!.fillRect(i, j, pixel_size * bgTileSize, pixel_size * bgTileSize);
                a = a ? 0 : 1;
            }
        }
        
        
        //draw pixel matrix
        for (let i = 0; i < scene.current.pixels.length; i++) {
            for (let j = 0; j < scene.current.pixels[i].length; j++) {
                if (!scene.current.pixels[i][j].colorStack.isEmpty()) {
                    ctx.current!.fillStyle = scene.current.pixels[i][j].colorStack.top()!;
                    ctx.current!.fillRect(scene.current.pixels[i][j].x1, scene.current.pixels[i][j].y1, pixel_size, pixel_size);
                }
            }
        }
    
    }

    function handleFirstClick(e : PointerEvent){

        if(e.pointerType === 'touch' || e.pointerType === 'pen')
        {
            if(e.cancelable)
            {
                e.preventDefault();
            }

            const bounding = canvas.getBoundingClientRect();
            mouse.x = e.clientX - bounding.left;
            mouse.y = e.clientY - bounding.top;

            const canvasWidth = parseFloat(canvas.style.width); 
            const canvasHeight = parseFloat(canvas.style.height);

            const offsetX = (canvasWidth - canvas.offsetWidth) / 2; // Calculate the X-axis offset due to scaling
            const offsetY = (canvasHeight - canvas.offsetHeight) / 2; // Calculate the Y-axis offset due to scaling

            mouse.x = (mouse.x - offsetX) * (display_size / canvasWidth); // Transform the mouse X-coordinate to canvas coordinate system taking into consideration the zooming and panning
            mouse.y = (mouse.y - offsetY) * (display_size / canvasHeight); // Transform the mouse Y-coordinate to canvas 

        }



        mouse.isPressed = true;
        if (selectedTool === 'pencil'){
            scene.current.currentDraw.push(Pencil('mousedown', scene.current, mouse,pixel_size, display_size,ctx.current!, penSize,selectedColor));
        }else if (selectedTool === 'eraser')
        {
            scene.current.currentDraw.push(Eraser('mousedown', mouse, scene.current, pixel_size, display_size, ctx.current!, penSize));
        }else if (selectedTool === 'paintBucket')
        {
            scene.current.currentDraw.push(PaintBucket(scene.current,mouse,pixel_size,display_size,ctx.current!,penSize,CANVAS_SIZE,selectedColor));
        }else if(selectedTool === 'dropper')
        {
            const color : string | undefined | null = Dropper(scene.current,mouse,pixel_size);
            if(color)setSelectedColor(color);
        }else if(selectedTool === 'line' || selectedTool === 'square' || selectedTool === 'circle')
        {
            scene.current.lineFirstPixel = scene.current.findPixel(mouse.x,mouse.y,pixel_size);
        }
    }

    function handlePointerMove(event : PointerEvent ){

        if(!canvas)return;


        //TODO: maybe decouple mouse listeners from tool function calls, functions can be called a super high number of times depending on device config and mouse type i guess
        const bounding = canvas.getBoundingClientRect();
        mouse.x = event.clientX - bounding.left;
        mouse.y = event.clientY - bounding.top;

        const canvasWidth = parseFloat(canvas.style.width); 
        const canvasHeight = parseFloat(canvas.style.height);

        const offsetX = (canvasWidth - canvas.offsetWidth) / 2; // Calculate the X-axis offset due to scaling
        const offsetY = (canvasHeight - canvas.offsetHeight) / 2; // Calculate the Y-axis offset due to scaling

        mouse.x = (mouse.x - offsetX) * (display_size / canvasWidth); // Transform the mouse X-coordinate to canvas coordinate system taking into consideration the zooming and panning
        mouse.y = (mouse.y - offsetY) * (display_size / canvasHeight); // Transform the mouse Y-coordinate to canvas coordinate system taking into consideration the zooming and panning

        if(coordinatesElement && mouse.x >= 0 && mouse.x <= display_size && mouse.y >= 0 && mouse.y <= display_size)
        {
            coordinatesElement.innerHTML = `[X:${Math.floor(mouse.x) + 1},Y:${Math.floor(mouse.y) + 1}]`;
        }

        if (selectedTool === 'pencil' && mouse.isPressed) {
            scene.current.currentDraw.push(Pencil("mousemove", scene.current, mouse,pixel_size, display_size,ctx.current!, penSize,selectedColor));
        }else if(selectedTool === 'eraser' && mouse.isPressed)
        {
            scene.current.currentDraw.push(Eraser("mousemove", mouse, scene.current, pixel_size, display_size, ctx.current!, penSize));
        }else if(selectedTool === 'line' && mouse.isPressed)
        {
            //remove draw from the top canvas
            removeDraw(topCtx.current!,cleanDraw(scene.current.currentDrawTopCanvas),pixel_size);
            scene.current.currentDrawTopCanvas = [];
            scene.current.currentDrawTopCanvas.push(Line(scene.current,topCtx.current!,mouse,pixel_size,scene.current.lineFirstPixel!,selectedColor,pixel_size));
        }else if(selectedTool === 'square' && mouse.isPressed)
        {
            //remove draw from the top canvas
            removeDraw(topCtx.current!,cleanDraw(scene.current.currentDrawTopCanvas),pixel_size);
            scene.current.currentDrawTopCanvas = [];
            scene.current.currentDrawTopCanvas.push(Square(scene.current,topCtx.current!,mouse,pixel_size,scene.current.lineFirstPixel!,selectedColor,pixel_size));
        }else if(selectedTool === 'circle' && mouse.isPressed)
        {
            //remove draw from the top canvas
            removeDraw(topCtx.current!,cleanDraw(scene.current.currentDrawTopCanvas),pixel_size);
            scene.current.currentDrawTopCanvas = [];


            //increase or decrease circle radius based on mouse movement
            if(mouse.mouseMoveLastPos && scene.current.lineFirstPixel){
                if(
                    ((mouse.x > scene.current.lineFirstPixel.x1 && mouse.x > mouse.mouseMoveLastPos.x) ||
                    (mouse.y > scene.current.lineFirstPixel.y1 && mouse.y > mouse.mouseMoveLastPos.y)) ||
                ( (mouse.x < scene.current.lineFirstPixel.x1 && mouse.x < mouse.mouseMoveLastPos.x) ||
                (mouse.y < scene.current.lineFirstPixel.y1 && mouse.y < mouse.mouseMoveLastPos.y)))
                {
                    //mouse is going away from middle point (from left or right), increase radius
                    scene.current.circleRadius+=CIRCLE_RADIUS_INCREASE_FACTOR;
                }else
                {
                    //mouse is moving toward middle point, decrase radius
                    if(scene.current.circleRadius - CIRCLE_RADIUS_INCREASE_FACTOR <= 1)
                    {
                        scene.current.circleRadius = 1;
                    }else
                    {
                        scene.current.circleRadius-=CIRCLE_RADIUS_INCREASE_FACTOR;
                    }
                }

            }

            scene.current.currentDrawTopCanvas.push(Circle(scene.current,topCtx.current!,pixel_size,scene.current.lineFirstPixel!,selectedColor,pixel_size));
                        
        }

        //paint pixel in top canvas relative to mouse position

        if(event.pointerType === 'mouse')
        {

            if(mouse.x >= 0 && mouse.x <= display_size && mouse.y >= 0 && mouse.y <= display_size){
                if(!scene.current.previousPixelWhileMovingMouse || (scene.current.previousPixelWhileMovingMouse && !(mouse.x >= scene.current.previousPixelWhileMovingMouse.x1 && mouse.x < scene.current.previousPixelWhileMovingMouse.x1 + pixel_size && mouse.y >=scene.current.previousPixelWhileMovingMouse.y1 && mouse.y < scene.current.previousPixelWhileMovingMouse.y1 + pixel_size)))
                {
                    const newPixel = scene.current.findPixel(mouse.x,mouse.y,pixel_size);
                    if(newPixel)
                    {
                        // topCtx.current!.fillStyle = selectedColor;
                        topCtx.current!.fillStyle = 'rgb(196, 193, 206,0.5)';
                        topCtx.current!.fillRect(newPixel.x1,newPixel.y1,pixel_size,pixel_size);
                        
                        if(scene.current.previousPixelWhileMovingMouse)
                        {
                            removeDraw(topCtx.current!,[scene.current.previousPixelWhileMovingMouse],pixel_size);
                        }

                        scene.current.previousPixelWhileMovingMouse = newPixel;

                    }
                }
            }

        }

        mouse.mouseMoveLastPos = {x: mouse.x,y : mouse.y};


     
    } 
    


    function handleZoom(e : WheelEvent){
        
        if(!outerDiv)return;
        
        //e.preventDefault();

        const rect = outerDiv.getBoundingClientRect();

        // Update the mouse position relative to the outer div
        const mouseX = e.clientX - rect.left; 
        const mouseY = e.clientY - rect.top;

        const delta = Math.sign(e.deltaY);
    
        if (delta < 0 && scene.current.zoomAmount < MAX_ZOOM_AMOUNT) {
            // Zoom in
            if(parseFloat(canvas.style.width) < originalCanvasWidth)
            {
                currentScale += SCALE_FACTOR;
                const newSize = Math.min(parseFloat(canvas.style.width) + 100,originalCanvasWidth);
                canvas.style.width = `${newSize}px`;
                canvas.style.height = `${newSize}px`;
                topCanvas.style.width = `${newSize}px`;
                topCanvas.style.height = `${newSize}px`;
            }else if(scene.current.zoomAmount < MAX_ZOOM_AMOUNT){

                scene.current.zoomAmount++;
                
                //dx and dy determines the translation of the canvas based on the mouse position during zooming
                //subtracting outerDiv.offsetWidth / 2 from mouse.x determines the offset of the mouse position from the center of the outer div.
                //the resulting value is then multiplied by the SCALE_FACTOR to ensure the correct translation based on the current scale factor.

                // console.log("mouse.x:",mouseX);
                // console.log("offset:",outerDiv.offsetWidth/2);

                const dx = (mouseX - outerDiv.offsetWidth / 2) * SCALE_FACTOR;
                const dy = (mouseY - outerDiv.offsetHeight / 2) * SCALE_FACTOR;
        
                currentScale += SCALE_FACTOR;
                currentScale = Math.max(currentScale, 0.15); // Set a minimum scale value
        
                const scaleChangeFactor = currentScale / (currentScale - SCALE_FACTOR); //calculate current scale factor
        
                canvas.style.width = `${canvas.offsetWidth * scaleChangeFactor}px`;
                canvas.style.height = `${canvas.offsetHeight * scaleChangeFactor}px`;
                canvas.style.left = `${canvas.offsetLeft - dx}px`;
                canvas.style.top = `${canvas.offsetTop - dy}px`;
                topCanvas.style.width = `${topCanvas.offsetWidth * scaleChangeFactor}px`;
                topCanvas.style.height = `${topCanvas.offsetHeight * scaleChangeFactor}px`;
                topCanvas.style.left = `${topCanvas.offsetLeft - dx}px`;
                topCanvas.style.top = `${topCanvas.offsetTop - dy}px`;


                // Store the mouse position in the history
                mouse.history.push({ x: mouseX, y: mouseY });
        }

    }else if (delta > 0) {
      // Zoom out

        if(scene.current.zoomAmount > 0){

            scene.current.zoomAmount--;
            if (mouse.history.length > 0) {
                const lastMousePos = mouse.history.pop()!;

                const dx = (lastMousePos.x - outerDiv.offsetWidth / 2) * SCALE_FACTOR;
                const dy = (lastMousePos.y - outerDiv.offsetHeight / 2) * SCALE_FACTOR;

                currentScale -= SCALE_FACTOR;
                currentScale = Math.max(currentScale, 0.1); // Set a minimum scale value

                const scaleChangeFactor = currentScale / (currentScale + SCALE_FACTOR);


                canvas.style.width = `${canvas.offsetWidth * scaleChangeFactor}px`;
                canvas.style.height = `${canvas.offsetHeight * scaleChangeFactor}px`;
                canvas.style.left = `${canvas.offsetLeft + dx}px`;
                canvas.style.top = `${canvas.offsetTop + dy}px`;
                topCanvas.style.width = `${topCanvas.offsetWidth * scaleChangeFactor}px`;
                topCanvas.style.height = `${topCanvas.offsetHeight * scaleChangeFactor}px`;
                topCanvas.style.left = `${topCanvas.offsetLeft + dx}px`;
                topCanvas.style.top = `${topCanvas.offsetTop + dy}px`;

            }   
        }else if(parseFloat(canvas.style.width) > display_size)
        {
            const newSize = Math.max(parseFloat(canvas.style.width) - 100,display_size);
            canvas.style.width = `${newSize}px`;
            canvas.style.height = `${newSize}px`;
            topCanvas.style.width = `${newSize}px`;
            topCanvas.style.height = `${newSize}px`;
            currentScale -= SCALE_FACTOR;
        }

    }
    
    }
    

        
    
    function handleFinishDraw(e : TouchEvent | MouseEvent){
        e.preventDefault();
        mouse.isPressed = false;
        scene.current.lastPixel = null;
        if (scene.current.currentDraw.length > 0) {

            let empty = true;
            for(let a of scene.current.currentDraw)
            {
                if(a.length > 0)
                {
                    empty = false;
                    break;
                }
            }
            if(!empty)undoStack.push(scene.current.currentDraw);
        }

        //here the draws made with Line, Square or circle tool are put in main canvas
        if(scene.current.currentDrawTopCanvas.length > 0)
        {
            const clean : Pixel[] = cleanDraw(scene.current.currentDrawTopCanvas);
            translateDrawToMainCanvas(clean,ctx.current!,pixel_size,selectedColor);
            undoStack.push(scene.current.currentDrawTopCanvas);
            
        }
        
        scene.current.currentDraw = [];
        removeDraw(topCtx.current!,cleanDraw(scene.current.currentDrawTopCanvas),pixel_size);
        scene.current.currentDrawTopCanvas = [];
    
        scene.current.currentPixelsMousePressed = new Map();

        scene.current.circleRadius = 0;
    }
    

    function checkKeyCombinations(event : KeyboardEvent)
    {
        if(event.ctrlKey && event.code === 'KeyZ')
        {
            undoLastDraw(scene.current,penSize,ctx.current!);
        }
    }

    

    return <div className = "editor" 
            style = {!isMobile ? {height:cssCanvasSize, width:'100%'} : {width:'100%',height:cssCanvasSize}} 
            ref = {outerDivRef} 
            onWheel={handleZoom}
            onPointerDown={handleFirstClick}
            onPointerMove={handlePointerMove}
            onPointerUp={handleFinishDraw}
            >
            <canvas id = "topCanvas"
                ref = {topCanvasRef}
            ></canvas>
            <canvas id="canvas" ref = {canvasRef}> Your browser does not support canvas </canvas>            
          </div>


}


