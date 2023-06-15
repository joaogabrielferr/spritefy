import { useEffect } from "react";
import { EventBus } from "../EventBus";
import { StoreType, store } from "../store"
import {Layer, drawOnSideBarCanvasType } from "../types";
import { BACKGROUND_CANVAS, CANVAS_SIZE, CREATE_NEW_LAYER, DRAW_ON_SIDEBAR_CANVAS, SELECT_LAYER, TOOGLE_LAYER_VISIBILITY, TOP_CANVAS } from "../utils/constants";
import './frames.css';
import { Eye } from "../svg/Eye";
import { EyeOff } from "../svg/EyeOff";

export function Frames(){
    
    // const layers = store((state : StoreType) => state.layers);
    const frames = store((state : StoreType) => state.frames);

    const backgroundTileSize = store((state : StoreType) => state.backgroundTileSize);

    const currentFrame = store((state : StoreType) => state.currentFrame);
    const setCurrentFrame = store((state : StoreType) => state.setCurrentFrame);

    useEffect(()=>{
    
        const subscription = EventBus.getInstance().subscribe(DRAW_ON_SIDEBAR_CANVAS,drawOnCanvas);
        
        return ()=>{
            subscription.unsubscribe();
        }

    },[]);

    function drawOnCanvas(args : drawOnSideBarCanvasType)
    {  

        const {frame,pixelMatrix} = args;
        
        if(!frame || !pixelMatrix)return;

        const ctx = (document.getElementById(`${frame}@sidebar`)as HTMLCanvasElement).getContext('2d')!;
        
        ctx.clearRect(0,0,CANVAS_SIZE,CANVAS_SIZE);

        for (let i = 0; i < pixelMatrix.length; i++) {
            for (let j = 0; j < pixelMatrix[i].length; j++) {
                if (!pixelMatrix[i][j].colorStack.isEmpty()) {
                    ctx.fillStyle = pixelMatrix[i][j].colorStack.top()!;
                    ctx.fillRect(pixelMatrix[i][j].x1, pixelMatrix[i][j].y1, 1, 1);
                }
            }
        }

        
        
    }


    // function changeCurrentLayer(layer : Layer)
    // {
    //     if(layer.visible)
    //     {
    //         EventBus.getInstance().publish<string>(SELECT_LAYER,layer);
    //     }

    // }

    function prepareFrameName(name : string)
    {
        return "FRAME " + name[name.length - 1];
    }

    function createNewFrameHandler()
    {
        //EventBus.getInstance().publish(CREATE_NEW_LAYER);
    }

    // function toogleLayerVisibility(layer : Layer){
    //         EventBus.getInstance().publish(TOOGLE_LAYER_VISIBILITY,layer);
    // }

    return <div className = "frames">
        <div className="framesTitle">
            FRAMES
        </div>
        <div className="createNewFrameWrapper">
            <button className = "createNewFrameButton" onClick = {createNewFrameHandler}>
                NEW FRAME
                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-square-rounded-plus" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M9 12h6"></path>
                    <path d="M12 9v6"></path>
                    <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z"></path>
                </svg>
            </button>
        </div>
        {
            frames.map((frame)=>{

                // return (frame != TOP_CANVAS && frame != BACKGROUND_CANVAS) && 
                return <div className = "frameWrapper" key = {frame} style = {{height:'90px',width:'100%',border:frame === currentFrame ? `3px solid #261857` : undefined}}>
                    <div 
                    className = "frameCanvas" 
                    >
                    <canvas width={CANVAS_SIZE} height={CANVAS_SIZE} id = {`${frame}@sidebar`} style = {{width:'90px',height:'90px',backgroundColor:'white'}}></canvas>
                    {prepareFrameName(frame)}
                    </div>
                    <div className="frameOptions">
                       <span>
                        {/* <button onClick ={()=>toogleframeVisibility(frame)}>{layer.visible ? <Eye/> : <EyeOff/>}</button> */}
                       </span>
                    </div>
                </div>

            })
        }
    </div>

}