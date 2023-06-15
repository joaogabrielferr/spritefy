import { useCallback, useEffect, useState } from "react";
import { EventBus } from "../EventBus";
import { StoreType, store } from "../store"
import {drawOnSideBarCanvasType } from "../types";
import { BG_COLORS, CANVAS_SIZE, CREATE_NEW_FRAME, DELETE_FRAME, DRAW_ON_SIDEBAR_CANVAS, ERASING, SELECT_FRAME} from "../utils/constants";
import './frames.css';
import { Trash } from "../svg/Trash";



export function Frames(){
    
    // const layers = store((state : StoreType) => state.layers);
    const framesList = store((state : StoreType) => state.framesList);

    const [touched,setTouched] = useState<{[frameName : string] : boolean}>({});

    const currentFrame = store((state : StoreType) => state.currentFrame);
    const setCurrentFrame = store((state : StoreType) => state.setCurrentFrame);

    let bgTileSize = 1;

    //simple calculation, can stay in component body
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

    // useEffect(()=>{
    //     drawBackground('frame1');
    // },[]);

    function drawBackground(frame : string)
    {
        const ctx = (document.getElementById(`${frame}@sidebar`)as HTMLCanvasElement).getContext('2d')!;
        
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
                ctx.fillRect(i, j, 10, 10);
                a = a ? 0 : 1;
            }
        }
    }

    const drawOnCanvas = useCallback((args : drawOnSideBarCanvasType)=>
    {  
        const {frame,pixelMatrix} = args;
        
        if(!frame || !pixelMatrix)return;

        const ctx = (document.getElementById(`${frame}@sidebar`)as HTMLCanvasElement).getContext('2d')!;
        
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
                ctx.fillRect(i, j, 10, 10);
                a = a ? 0 : 1;
            }
        }

        for (let i = 0; i < pixelMatrix.length; i++) {
            for (let j = 0; j < pixelMatrix[i].length; j++) {
                if (!pixelMatrix[i][j].colorStack.isEmpty()) {
                    const color = pixelMatrix[i][j].colorStack.top();
                    if(!color || color === ERASING)
                    {

                        ctx.fillStyle = pixelMatrix[i][j].bgColor;
                        ctx.fillRect(pixelMatrix[i][j].x1, pixelMatrix[i][j].y1, 1, 1);
                    
                    }else
                    {
                        ctx.fillStyle = color;
                        ctx.fillRect(pixelMatrix[i][j].x1, pixelMatrix[i][j].y1, 1, 1);
                    }
                }
            }
        }
    },[]);
    
    useEffect(()=>{

        const subscription = EventBus.getInstance().subscribe(DRAW_ON_SIDEBAR_CANVAS,drawOnCanvas);
        
        return ()=>{
            subscription.unsubscribe();
        }

    },[drawOnCanvas]);

    
    useEffect(()=>{
        
        framesList.forEach((frame)=>{

            if(!touched[frame])
            {
                setTouched({...touched,[frame] : true})
                drawBackground(frame);
            }
        })
        
    });

    
    
    function changeCurrentFrame(frame : string)
    {
        console.log("IN FRAMES:",frame);
        EventBus.getInstance().publish<string>(SELECT_FRAME,frame);

    }

    function createNewFrameHandler()
    {
        EventBus.getInstance().publish(CREATE_NEW_FRAME);
    }

    function deleteFrame(frame : string)
    {
        EventBus.getInstance().publish(DELETE_FRAME,frame);
    }

    // function toogleLayerVisibility(layer : Layer){
    //         EventBus.getInstance().publish(TOOGLE_LAYER_VISIBILITY,layer);
    // }

    return <div className = "frames">
        <div className="framesTitle">
            FRAMES
        </div>
        {
            framesList.map((frame,index)=>{

                // return (frame != TOP_CANVAS && frame != BACKGROUND_CANVAS) && 
                return <div className = "frameWrapper" key = {frame} style = {{height:'90px',width:'95%',border:frame === currentFrame ? `3px solid #181818` : undefined}}>
                    <div 
                    className = "frameCanvasWrapper" style = {{width:'90px',height:'90px'}}
                    onClick = {()=>changeCurrentFrame(frame)}
                    >
                    <canvas className = "frameCanvas" width={CANVAS_SIZE} height={CANVAS_SIZE} id = {`${frame}@sidebar`} style = {{width:'90px',height:'90px'}}></canvas>
                    {/* {prepareFrameName(frame)} */}
                    </div>
                    <div className="frameOptions">
                        <div>FRAME {index + 1}</div>
                        {framesList.length > 1 && <div>
                            <button onClick = {()=>deleteFrame(frame)}><Trash/></button>
                        </div>}
                       {/* <span>
                        <button onClick ={()=>toogleframeVisibility(frame)}>{layer.visible ? <Eye/> : <EyeOff/>}</button>
                       </span> */}
                    </div>
                </div>

            })
        }
                <div className="createNewFrameWrapper">
            <button className = "createNewFrameButton" onClick = {createNewFrameHandler}>
                ADD NEW FRAME
                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-square-rounded-plus" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M9 12h6"></path>
                    <path d="M12 9v6"></path>
                    <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z"></path>
                </svg>
            </button>
        </div>
    </div>

}