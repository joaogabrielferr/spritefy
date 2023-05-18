import {Dispatch, SetStateAction, useEffect, useRef,WheelEvent,MouseEvent,TouchEvent } from 'react';
import './styles/editor.css';
import { 
CANVAS_SIZE,
MAX_ZOOM_AMOUNT,
BG_COLORS
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



interface IEditor{
    selectedColor : string;
    selectedTool : string;
    onSelectedColor : Dispatch<SetStateAction<string>>;
    cssCanvasSize : number;
}

//TODO: Add background canvas and change logic of erasing, etc (dont forget to scale bgCanvas with the other ones)
//TODO: Paint pixel that sits on where mouse pointer is and update on mouse move so user now precisely which pixel they're painting
//TODO: Add erasing to ctrl z logic
//TODO: Add square tool
//TODO: Add circle tool
//TODO: Improve style (try to make it definitive)
//TODO: Set the important variables as states (pen size, canvas size, etc)
//TODO: Add button to reset all canvas positions (back to the center of outer div)

//TODO: set CANVAS_SIZE and pen size as state and globally available with context
//////////////////////////////////////////////////////////
let canvas : HTMLCanvasElement,bgCanvas : HTMLCanvasElement,topCanvas : HTMLCanvasElement;
let outerDiv : HTMLDivElement;
// let ctx : CanvasRenderingContext2D; 
// let BGctx : CanvasRenderingContext2D;

const mouse = new Mouse();

//canvas transformation matrix
let matrix = [1, 0, 0, 1, 0, 0];

let pixel_size : number;
let display_size : number;
let bgTileSize : number;


//const keyMap = new Map<string,boolean>();

let currentScale = 1;
// const defaultPenSize = pixel_size;
let penSize : number;

let LineFirstPixel : Pixel | null = null;

let coordinatesElement : HTMLParagraphElement;

//////////////////////////////////////////////////////////

export default function Editor({selectedColor,selectedTool,onSelectedColor,cssCanvasSize} : IEditor) : JSX.Element{
    
    const canvasRef = useRef<HTMLCanvasElement>(null); //main canvas
    //const bgCanvasRef = useRef<HTMLCanvasElement>(null); //canvas for rendering the background tiles
    const topCanvasRef = useRef<HTMLCanvasElement>(null); //top canvas for temporary draws (like in line tool, square tool, circle tool, etc)
    const outerDivRef = useRef<HTMLDivElement>(null); //div that wraps all canvas

    const ctx = useRef<CanvasRenderingContext2D | null>(null);
    //const BGctx = useRef<CanvasRenderingContext2D | null>(null);
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
        //bgCanvas = bgCanvasRef.current!;
        topCanvas = topCanvasRef.current!;
        outerDiv = outerDivRef.current!;
        ctx.current = canvas.getContext("2d")!;
        //BGctx.current = canvas.getContext("2d")!;
        topCtx.current = topCanvas.getContext("2d")!;
        canvas.width = display_size;
        canvas.height = display_size;
        //bgCanvas.width = display_size;
        //bgCanvas.height = display_size;        
        topCanvas.width = display_size;
        topCanvas.height = display_size;

        ctx.current.scale(window.devicePixelRatio,window.devicePixelRatio);
        topCtx.current.scale(window.devicePixelRatio,window.devicePixelRatio);
        //BGctx.current.scale(window.devicePixelRatio,window.devicePixelRatio);
        

        canvas.style.width = `${cssCanvasSize - 50}px`;
        canvas.style.height = `${cssCanvasSize - 50}px`;
       // bgCanvas.style.width = `${cssCanvasSize - 50}px`;
        //bgCanvas.style.height = `${cssCanvasSize - 50}px`;
        topCanvas.style.width = `${cssCanvasSize - 50}px`;
        topCanvas.style.height = `${cssCanvasSize - 50}px`;

        if(!firstInit.current)
        {
            scene.current.initilializePixelMatrix(display_size,pixel_size,bgTileSize);
            firstInit.current = true;
        }draw();
        
        //originalSize = cssCanvasSize - 50;

        coordinatesElement = document.getElementById('coordinates') as HTMLParagraphElement;

    },[cssCanvasSize]);
    // },[]);

    function setUpVariables(){

        pixel_size = 1*window.devicePixelRatio;
        display_size = CANVAS_SIZE;
        display_size*=window.devicePixelRatio;
        
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

    function handleOptionKeyPressed(event : KeyboardEvent){
        checkKeys(event);
        checkKeyCombinations(event);
    }

    function checkKeys(event : KeyboardEvent){

        if(['p','P','1'].indexOf(event.key) > -1)
        {
            // selectedTool = 'pencil';
        }else if(['e','E','2'].indexOf(event.key) > -1)
        {
            // selectedTool = 'eraser';
        }else if(['b','B','3'].indexOf(event.key) > -1)
        {
            // selectedTool = 'paintBucket';
        }


    }

        document.addEventListener('keydown',handleOptionKeyPressed);
        
        return ()=>{
            document.removeEventListener('keydown',handleOptionKeyPressed);
        }

    },[]);




    
    function draw(){

        //old way of zooming whitout changing width and height. note to my future self: i moved away from this method because scaling wasnt smooth and
        //and i coudnt figure out how to make it smoother, plus i figured that most editors out there handle zooming by calculating the new css width, height,
        //top and left based on mouse position like im doing now, plus it looks better, although the old zooming was 100% precise),
        // matrix[0] = currentScale;
        // matrix[1] = 0;
        // matrix[2] = 0;
        // matrix[3] = currentScale;
        // matrix[4] = mouse.originX;
        // matrix[5] = mouse.originY;
    
        // ctx.current!.clearRect(0, 0, display_size, display_size);
        // BGctx.current!.clearRect(0, 0, display_size, display_size);
        // ctx.current!.setTransform(1, 0, 0, 1, 0, 0);
        // BGctx.current!.setTransform(1, 0, 0, 1, 0, 0);
    
        // ctx.current!.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
        // BGctx.current!.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
    
        let firstInRow = 1;
        let a = firstInRow;
    
        //TODO:draw this background on bgCanvas instead of main canvas
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

    function handleFirstClick(){
        mouse.isPressed = true;
        if (selectedTool === 'pencil'){
            scene.current.currentDraw.push(Pencil('mousedown', scene.current, mouse,pixel_size, display_size,ctx.current!, penSize,selectedColor));
        }else if (selectedTool === 'eraser')
        {
            Eraser('mousedown', mouse, scene.current, pixel_size, display_size, ctx.current!, penSize);
        }else if (selectedTool === 'paintBucket')
        {
            scene.current.currentDraw.push(PaintBucket(scene.current,mouse,pixel_size,display_size,ctx.current!,penSize,CANVAS_SIZE,selectedColor));
        }else if(selectedTool === 'dropper')
        {
            const color : string | undefined | null = Dropper(scene.current,mouse,pixel_size);
            if(color)onSelectedColor(color);
        }else if(selectedTool === 'line')
        {
            //const [x,y] = mouse.toWorldCoordinates(currentScale);
            LineFirstPixel = scene.current.findPixel(mouse.x,mouse.y,pixel_size);
        }
    }

    function handleMouseMove(event : MouseEvent ){

        if(!canvas)return;
        //TODO: maybe decouple mouse listeners from these function calls, functions can be called a super high number of times depending on device config and mouse type i guess
        const bounding = canvas.getBoundingClientRect();
        mouse.x = event.clientX - bounding.left;
        mouse.y = event.clientY - bounding.top;

        const canvasWidth = parseFloat(canvas.style.width); 
        const canvasHeight = parseFloat(canvas.style.height);

        const offsetX = (canvasWidth - canvas.offsetWidth) / 2; // Calculate the X-axis offset due to scaling
        const offsetY = (canvasHeight - canvas.offsetHeight) / 2; // Calculate the Y-axis offset due to scaling

        mouse.x = (mouse.x - offsetX) * (display_size / canvasWidth); // Transform the mouse X-coordinate to canvas coordinate system taking into consideration the zooming and panning
        mouse.y = (mouse.y - offsetY) * (display_size / canvasHeight); // Transform the mouse Y-coordinate to canvas coordinate system taking into consideration the zooming and panning

        coordinatesElement.innerHTML = `[${Math.floor(mouse.x) + 1}x${Math.floor(mouse.y) + 1}]`;

        // console.log(mouse.x,mouse.y);
        if (selectedTool === 'pencil' && mouse.isPressed) {
            scene.current.currentDraw.push(Pencil("mousemove", scene.current, mouse,pixel_size, display_size,ctx.current!, penSize,selectedColor));
        }else if(selectedTool === 'eraser' && mouse.isPressed)
        {
            Eraser("mousemove", mouse, scene.current, pixel_size, display_size, ctx.current!, penSize);
        }else if(selectedTool === 'line' && mouse.isPressed)
        {
            //remove draw from the top canvas
            removeDraw(topCtx.current!,cleanDraw(scene.current.currentDrawTopCanvas),pixel_size);
            scene.current.currentDrawTopCanvas = [];
            scene.current.currentDrawTopCanvas.push(Line(scene.current,topCtx.current!,mouse,pixel_size,LineFirstPixel!,selectedColor,pixel_size));
        }
     
    } 
    

    function handleFirstTouch(e : TouchEvent){
        //for mobile, first get the touched position (for desktop the position is updated in mousemove listener, this is not possible in mobile if first touch didnt happened yet), 
        //update mouse values, then call pencil

        if(e.cancelable)
        {
            e.preventDefault();
        }

        const bounding = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - bounding.left;
        mouse.y = e.touches[0].clientY - bounding.top;

        const canvasWidth = parseFloat(canvas.style.width); 
        const canvasHeight = parseFloat(canvas.style.height);

        const offsetX = (canvasWidth - canvas.offsetWidth) / 2; // Calculate the X-axis offset due to scaling
        const offsetY = (canvasHeight - canvas.offsetHeight) / 2; // Calculate the Y-axis offset due to scaling

        mouse.x = (mouse.x - offsetX) * (display_size / canvasWidth); // Transform the mouse X-coordinate to canvas coordinate system taking into consideration the zooming and panning
        mouse.y = (mouse.y - offsetY) * (display_size / canvasHeight); // Transform the mouse Y-coordinate to canvas 

        mouse.isPressed = true;
        if (selectedTool === 'pencil'){
            scene.current.currentDraw.push(Pencil('touchstart', scene.current, mouse,pixel_size, display_size,ctx.current!, penSize,selectedColor));
            //no need to call for draw in event listeners, when something like fillRect is called the canvas updates automatically
            //draw("mousedown");
        }else if (selectedTool === 'eraser')
        {
            Eraser('touchstart', mouse, scene.current, pixel_size, display_size, ctx.current!, penSize);
        }else if (selectedTool === 'paintBucket')
        {
            scene.current.currentDraw.push(PaintBucket(scene.current,mouse,pixel_size,display_size,ctx.current!,penSize,CANVAS_SIZE,selectedColor));
        }else if(selectedTool === 'line')
        {
            LineFirstPixel = scene.current.findPixel(mouse.x,mouse.y,pixel_size);
        }
    }



function handleTouchMove(event : TouchEvent){

    //TODO: Merge this function with handleMouseMove and call it something like handleMove, since the only diference is the event passed as arg
  
    if(!canvas)return;
    //TODO: maybe decouple mouse listeners from these function calls, functions can be called a super high number of times depending on device config and mouse type i guess
    const bounding = canvas.getBoundingClientRect();
    mouse.x = event.touches[0].clientX - bounding.left;
    mouse.y = event.touches[0].clientY - bounding.top;

    const canvasWidth = parseFloat(canvas.style.width); 
    const canvasHeight = parseFloat(canvas.style.height);

    const offsetX = (canvasWidth - canvas.offsetWidth) / 2; // Calculate the X-axis offset due to scaling
    const offsetY = (canvasHeight - canvas.offsetHeight) / 2; // Calculate the Y-axis offset due to scaling

    mouse.x = (mouse.x - offsetX) * (display_size / canvasWidth); // Transform the mouse X-coordinate to canvas coordinate system taking into consideration the zooming and panning
    mouse.y = (mouse.y - offsetY) * (display_size / canvasHeight); // Transform the mouse Y-coordinate to canvas coordinate system taking into consideration the zooming and panning

    coordinatesElement.innerHTML = `[${Math.floor(mouse.x) + 1}x${Math.floor(mouse.y) + 1}]`;

    if (selectedTool === 'pencil' && mouse.isPressed) {
        scene.current.currentDraw.push(Pencil("touchmove", scene.current, mouse,pixel_size, display_size,ctx.current!, penSize,selectedColor));
    }else if(selectedTool === 'eraser' && mouse.isPressed)
    {
        Eraser("touchmove", mouse, scene.current, pixel_size, display_size, ctx.current!, penSize);
    }else if(selectedTool === 'line' && mouse.isPressed)
    {
        removeDraw(topCtx.current!,cleanDraw(scene.current.currentDrawTopCanvas),pixel_size);
        scene.current.currentDraw.push(Line(scene.current,topCtx.current!,mouse,pixel_size,LineFirstPixel!,selectedColor,pixel_size));  
    }

}
    

    function handleZoom(e : WheelEvent){
        if(!outerDiv)return;
        
        //e.preventDefault();

        const rect = outerDiv.getBoundingClientRect();
        // Update the mouse position relative to the outer div
        const mouseX = e.clientX - rect.left; 
        const mouseY = e.clientY - rect.top;

        let scaleFactor = 0.15;
        const delta = Math.sign(e.deltaY);
    
        if (delta < 0 && scene.current.zoomAmount < MAX_ZOOM_AMOUNT) {
            // Zoom in
            scene.current.zoomAmount++;
            const dx = (mouseX - outerDiv.offsetWidth / 2) * scaleFactor;
            const dy = (mouseY - outerDiv.offsetHeight / 2) * scaleFactor;
      
            currentScale += scaleFactor;
            currentScale = Math.max(currentScale, 0.15); // Set a minimum scale value
      
            const scaleChangeFactor = currentScale / (currentScale - scaleFactor);
      
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

    }else if (delta > 0 && scene.current.zoomAmount > 0) {
      // Zoom out
    //   scaleFactor = 0.15;
        scene.current.zoomAmount--;
      if (mouse.history.length > 0) {
        const lastMousePos = mouse.history.pop()!;

        const dx = (lastMousePos.x - outerDiv.offsetWidth / 2) * scaleFactor;
        const dy = (lastMousePos.y - outerDiv.offsetHeight / 2) * scaleFactor;

        currentScale -= scaleFactor;
        currentScale = Math.max(currentScale, 0.1); // Set a minimum scale value

        const scaleChangeFactor = currentScale / (currentScale + scaleFactor);

        canvas.style.width = `${canvas.offsetWidth * scaleChangeFactor}px`;
        canvas.style.height = `${canvas.offsetHeight * scaleChangeFactor}px`;
        canvas.style.left = `${canvas.offsetLeft + dx}px`;
        canvas.style.top = `${canvas.offsetTop + dy}px`;
        topCanvas.style.width = `${topCanvas.offsetWidth * scaleChangeFactor}px`;
        topCanvas.style.height = `${topCanvas.offsetHeight * scaleChangeFactor}px`;
        topCanvas.style.left = `${topCanvas.offsetLeft + dx}px`;
        topCanvas.style.top = `${topCanvas.offsetTop + dy}px`;
      }
    }
    



        //old way of zooming
        // if (e.deltaY < 0 && scene.current.zoomAmount < MAX_ZOOM_AMOUNT ) {
        //     if(size > 2000)size+=500;
        //     else size+=100;
        //     console.log(scene.current.zoomAmount);
        //     scene.current.zoomAmount++;
        //     currentScale *= SCALE_FACTOR;
        //     //calculate new origin from which the canvas will scale from
        //     // mouse.originX = Math.floor(mouse.x - (mouse.x - mouse.originX) * SCALE_FACTOR);
        //     // mouse.originY = Math.floor(mouse.y - (mouse.y - mouse.originY) * SCALE_FACTOR);
        //     // mouse.history.push({ x: mouse.x, y : mouse.y });
        // } else if (e.deltaY > 0 && size > CANVAS_SIZE + 100) {
        //     if(size > 2000)size-=500;
        //     else size-=100;
        //     // canvas.style.top = `${Number(canvas.style.top) + 50}px`;
        //     console.log(canvas.style.top);
        //     //TODO: maybe allow use to zoom out of canvas by adjusting cssCanvasSize value (like decrease cssCanvasSize up to 30% of its original size)
        //     scene.current.zoomAmount--;
        //     currentScale *= 1 / SCALE_FACTOR;
        //     // const m = mouse.history.pop();
        //     // mouse.originX = Math.floor(m!.x - (m!.x - mouse.originX) * (1 / SCALE_FACTOR));
        //     // mouse.originY = Math.floor(m!.y - (m!.y - mouse.originY) * (1 / SCALE_FACTOR));
    
        //     // if (scene.current.zoomAmount == 0) {
        //     // mouse.originX = 0;
        //     // mouse.originY = 0;
        //     // }
        // }

        // canvas.style.width = `${size}px`;
        // canvas.style.height = `${size}px`;

        // //setZoom(zoom + 1);
        // //scale and draw pixel matrix
        // //draw();
    }
    

        
    
    function handleFinishDraw(e : TouchEvent | MouseEvent){
        e.preventDefault();
        mouse.isPressed = false;
        scene.current.lastPixel = null;
        if (scene.current.currentDraw.length > 0) {
            //TODO:add erased pixels to undoStack as well
            undoStack.push(scene.current.currentDraw);
        }

        if(scene.current.currentDrawTopCanvas.length > 0)
        {
            //translate draw made on top canvas to main canvas
            //paint all pixels on main canvas
            //add these pixels to undoStack
            const clean : Pixel[] = cleanDraw(scene.current.currentDrawTopCanvas);
            translateDrawToMainCanvas(clean,ctx.current!,pixel_size,selectedColor);
            undoStack.push(scene.current.currentDrawTopCanvas);
            
        }
    
        scene.current.currentDraw = [];
        removeDraw(topCtx.current!,cleanDraw(scene.current.currentDrawTopCanvas),pixel_size);
        scene.current.currentDrawTopCanvas = [];
    
        scene.current.currentPixelsMousePressed = new Map();
    }
    
    function checkKeyCombinations(event : KeyboardEvent)
    {
        if(event.ctrlKey && event.code === 'KeyZ')
        {
            undoLastDraw(scene.current,penSize,ctx.current!);
        }
    }



    return <div className = "editor" style = {{height:cssCanvasSize}} ref = {outerDivRef} onWheel={handleZoom}>
            <canvas id = "topCanvas"
                ref = {topCanvasRef}
                onMouseDown={handleFirstClick}
                onMouseMove={handleMouseMove}
                onMouseUp={handleFinishDraw}
                onTouchStart={handleFirstTouch}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleFinishDraw}
            ></canvas>
            <canvas id="canvas" ref = {canvasRef}> Your browser does not support canvas </canvas>
            {/* <canvas id="BGcanvas" ref = {bgCanvasRef}></canvas> */}
            
          </div>


}


