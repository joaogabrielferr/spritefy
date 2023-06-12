import { useEffect } from "react";
import { EventBus } from "../EventBus";
import { StoreType, store } from "../store"
import {drawOnSideBarCanvasType } from "../types";
import { BACKGROUND_CANVAS, CANVAS_SIZE, DRAW_ON_SIDEBAR_CANVAS, TOP_CANVAS } from "../utils/constants";
import './layers.css';

export function Layers(){
    
    const layers = store((state : StoreType) => state.layers);

    useEffect(()=>{
        
        function drawOnCanvas(args : drawOnSideBarCanvasType)
        {  
    
            //TODO: Just iterate over the entire pixel matrix and redraw from scratch 
            const {canvas,pixelMatrix} = args;
            
            console.log("canvas:",canvas,layers);
            if(!canvas || !pixelMatrix)return;
    
            const ctx = (document.getElementById(`${canvas}@sidebar`)as HTMLCanvasElement).getContext('2d')!;
            
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
        const subscription = EventBus.getInstance().subscribe(DRAW_ON_SIDEBAR_CANVAS,drawOnCanvas);
        
        return ()=>{
            subscription.unsubscribe();
        }

    },[layers]);



    return <div className = "layers">
        {
            layers.map((layer)=>{

                return (layer != TOP_CANVAS && layer != BACKGROUND_CANVAS) && <div key = {layer} style = {{height:'60px',width:'100%',border:'1px solid black'}}>
                    <canvas width={CANVAS_SIZE} height={CANVAS_SIZE} id = {`${layer}@sidebar`} style = {{width:'60px',height:'60px',backgroundColor:'white'}}></canvas>
                </div>

            })
        }
    </div>

}