import { useEffect, useRef } from 'react';
import { BG_COLORS, CANVAS_SIZE, ERASING, UPDATE_PREVIEW_FRAMES } from '../utils/constants';
import './preview.css';
import { Frame, Pixel, drawOnSideBarCanvasType } from '../types';
import { EventBus } from '../EventBus';

export function Preview(){

    const canvas = useRef<HTMLCanvasElement>(null);
    const previewInterval = useRef<number>(0);
    const frameRate = 10;
    const frameDuration = 1000/frameRate;

    let currentIndex = 0;

    let bgTileSize = 1;

    const frames = useRef<{frame : string,pixelMatrix : Pixel[][]}[]>(
        [{
            frame:'frame1',
            pixelMatrix : []
        }]
    );

    
    function startPreview(){
        previewInterval.current = setInterval(()=>{
            redrawPreview();
            currentIndex++;
            if(currentIndex >= frames.current.length)
            {
                currentIndex = 0;
            }
        },frameDuration);
    }

    //this is probably inefficient ¯\_(ツ)_/¯
    function redrawPreview()
    {
        const ctx = canvas.current!.getContext('2d')!;
        
        ctx.clearRect(0,0,CANVAS_SIZE,CANVAS_SIZE);

        for (let i = 0; i < frames.current[currentIndex].pixelMatrix.length; i++) {
            for (let j = 0; j < frames.current[currentIndex].pixelMatrix[i].length; j++) {
                if (!frames.current[currentIndex].pixelMatrix[i][j].colorStack.isEmpty()) {
                    const color = frames.current[currentIndex].pixelMatrix[i][j].colorStack.top();
                    if(!color || color === ERASING)
                    {

                        ctx.fillStyle = frames.current[currentIndex].pixelMatrix[i][j].bgColor;
                        ctx.fillRect(frames.current[currentIndex].pixelMatrix[i][j].x1, frames.current[currentIndex].pixelMatrix[i][j].y1, 1, 1);
                    
                    }else
                    {
                        ctx.fillStyle = color;
                        ctx.fillRect(frames.current[currentIndex].pixelMatrix[i][j].x1, frames.current[currentIndex].pixelMatrix[i][j].y1, 1, 1);
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
        for(let i = 1;i<=CANVAS_SIZE;i++)
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
    
    useEffect(()=>{
        
        drawBackground()
        
        EventBus.getInstance().subscribe(UPDATE_PREVIEW_FRAMES,updateFramesOnPreview);

        startPreview();

        return ()=>{
            finishPreview();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    
    function drawBackground()
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
    }

    function updateFramesOnPreview(args : drawOnSideBarCanvasType)
    {
        const {frame,pixelMatrix} = args;

        const index = frames.current.findIndex((_frame) => _frame.frame === frame);
        if(index >= 0)
            frames.current[index].pixelMatrix = pixelMatrix;
        else
            frames.current.push({frame : frame,pixelMatrix: pixelMatrix});    
    }

    return <div className="Preview">
            <div className="sectionTitle">
                PREVIEW
            </div>
            <div className="PreviewCanvasWrapper">
                <canvas width={CANVAS_SIZE} ref = {canvas} height={CANVAS_SIZE} className = "canvasPreview" id = "previewTop" style = {{width:'180px',height:'180px',zIndex:1}}></canvas>
                <canvas width={CANVAS_SIZE} height={CANVAS_SIZE} className = "canvasPreview" id = "previewBG" style = {{width:'180px',height:'180px',zIndex:0}}></canvas>
            </div>
    </div>
}