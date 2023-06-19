import { useCallback, useEffect, useRef, useState } from 'react';
import { BG_COLORS, CANVAS_SIZE, ERASING, UPDATE_PREVIEW_FRAMES } from '../utils/constants';
import './preview.css';
import { Frame, Pixel, drawOnSideBarCanvasType } from '../types';
import { EventBus } from '../EventBus';
import { StoreType, store } from '../store';

export function Preview(){

    const canvas = useRef<HTMLCanvasElement>(null);
    const previewInterval = useRef<number>(0);

    const [counter,setCounter] = useState(0);

    const frameRate = store((store : StoreType) => store.frameRate);
    const setFrameRate = store((store : StoreType) => store.setFrameRate);

    const frameDuration = 1000/frameRate;

    const currentIndex = useRef<number>(0);

    let bgTileSize = 1;

    //pixel matrices are passed by reference and are the same pixel matrices of editor
    const frames = useRef<Frame[]>(
        []
    );

    
    const startPreview = useCallback(()=>{
        counter;
        previewInterval.current = setInterval(()=>{
            redrawPreview();
            currentIndex.current++;
            if(currentIndex.current >= frames.current.length)
            {
                currentIndex.current = 0;
            }
        },frameDuration);
    },[frameDuration,counter]);

    function redrawPreview()
    {
        const ctx = canvas.current!.getContext('2d')!;
        
        ctx.clearRect(0,0,CANVAS_SIZE,CANVAS_SIZE);

        if(!frames.current[currentIndex.current])return;

        for (let i = 0; i < frames.current[currentIndex.current].scene.pixels.length; i++) {
            for (let j = 0; j < frames.current[currentIndex.current].scene.pixels[i].length; j++) {
                if (!frames.current[currentIndex.current].scene.pixels[i][j].colorStack.isEmpty()) {
                    const color = frames.current[currentIndex.current].scene.pixels[i][j].colorStack.top();
                    if(!color || color === ERASING)
                    {

                        ctx.fillStyle = frames.current[currentIndex.current].scene.pixels[i][j].bgColor;
                        ctx.fillRect(frames.current[currentIndex.current].scene.pixels[i][j].x1, frames.current[currentIndex.current].scene.pixels[i][j].y1, 1, 1);
                    
                    }else
                    {
                        ctx.fillStyle = color;
                        ctx.fillRect(frames.current[currentIndex.current].scene.pixels[i][j].x1, frames.current[currentIndex.current].scene.pixels[i][j].y1, 1, 1);
                    }
                }
            }
        }

    }

    function finishPreview()
    {
        clearInterval(previewInterval.current);
    }

    function calculateBgTileSize()
    {
        const factors = [];
        for(let i = 1;i<=CANVAS_SIZE;i++)//CANVAS_SIZE is at most 500
        {
            if(CANVAS_SIZE%i === 0)factors.push(i);
        }
            
        const mid = Math.floor(factors.length/2);
        bgTileSize = factors[mid];
    
        //if CANVAS_SIZE is a prime number
        if(bgTileSize === CANVAS_SIZE)
        bgTileSize = CANVAS_SIZE <= 100 ? 1 : 10;
    }

    calculateBgTileSize();

    const drawBackground = useCallback(()=>
    {
        const ctx = (document.getElementById("previewBG")as HTMLCanvasElement).getContext('2d')!;
        
        ctx.clearRect(0,0,CANVAS_SIZE,CANVAS_SIZE);

        let firstInRow = 1;
        let a = firstInRow;

         //draw background
         for (let i = 0; i <= CANVAS_SIZE; i += bgTileSize) {
            if (firstInRow) a = 0;
            else a = 1;
            firstInRow = firstInRow ? 0 : 1;
            for (let j = 0; j <= CANVAS_SIZE; j += bgTileSize) {
                ctx.fillStyle = a ? BG_COLORS[0] : BG_COLORS[1];
                ctx.fillRect(i, j, bgTileSize, bgTileSize);
                a = a ? 0 : 1;
            }
        }
    },[bgTileSize]);
    
    useEffect(()=>{
        
        drawBackground();
        
        EventBus.getInstance().subscribe(UPDATE_PREVIEW_FRAMES,updateFramesOnPreview);

        startPreview();

        return ()=>{
            finishPreview();
        }

    },[drawBackground, startPreview]);
    

    function updateFramesOnPreview(_frames : Frame[])
    {

        frames.current = _frames;
        setCounter(counter=>counter+1);


    }

    return <div className="Preview">
            <div className = "PreviewTitle">ANIMATION PREVIEW</div>
            <div className="PreviewCanvasWrapper">
                <canvas width={CANVAS_SIZE} ref = {canvas} height={CANVAS_SIZE} className = "canvasPreview" id = "previewTop" style = {{width:'180px',height:'180px',zIndex:1}}></canvas>
                <canvas width={CANVAS_SIZE} height={CANVAS_SIZE} className = "canvasPreview" id = "previewBG" style = {{width:'180px',height:'180px',zIndex:0}}></canvas>
            </div>
            <div>
            <div style = {{width:'180px',margin:'0 auto',display:'flex'}}>
                    <div style = {{color:'white',fontSize:'12px',width:'30%'}}>{frameRate} FPS</div>
                <div className = "SliderWrapper">
                    <div className ="SliderRange">
                        <input className = "Slider" type="range" min={1} max={12} value={frameRate} onChange={(e)=>setFrameRate(+e.target.value)} id="range" /> 
                    </div>
                </div>
            </div>
            </div>
    </div>
}