import { useEffect } from "react";
import { EventBus } from "../EventBus";
import { StoreType, store } from "../store"
import {drawOnSideBarCanvasType } from "../types";
import { BACKGROUND_CANVAS, CANVAS_SIZE, CREATE_NEW_LAYER, DRAW_ON_SIDEBAR_CANVAS, SELECT_LAYER, TOP_CANVAS } from "../utils/constants";
import './layers.css';

export function Layers(){
    
    const layers = store((state : StoreType) => state.layers);

    const currentLayer = store((state : StoreType) => state.currentLayer);
    const setCurrentLayer = store((state : StoreType) => state.setCurrentLayer);

    useEffect(()=>{
    
        function drawOnCanvas(args : drawOnSideBarCanvasType)
        {  
    
            //TODO: Just iterate over the entire pixel matrix and redraw from scratch 
            const {canvas,pixelMatrix} = args;
            
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

    function changeCurrentLayer(layer : string)
    {
        EventBus.getInstance().publish<string>(SELECT_LAYER,layer);
    }

    function prepareLayerName(name : string)
    {
        return "LAYER " + name[name.length - 1];
    }

    function createNewLayerHandler()
    {
        EventBus.getInstance().publish(CREATE_NEW_LAYER);
    }

    return <div className = "layers">
        <div className="layersTitle">
            LAYERS
        </div>
        <div className="createNewLayerWrapper">
            <button className = "createNewLayerButton" onClick = {createNewLayerHandler}>
                NEW LAYER
                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-square-rounded-plus" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M9 12h6"></path>
                    <path d="M12 9v6"></path>
                    <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z"></path>
                </svg>
            </button>
        </div>
        {
            layers.map((layer)=>{

                return (layer != TOP_CANVAS && layer != BACKGROUND_CANVAS) && <div className = "layerWrapper" onClick={()=>changeCurrentLayer(layer)} key = {layer} style = {{height:'60px',width:'100%',border:layer === currentLayer ? '3px solid black' : undefined}}>
                    <canvas width={CANVAS_SIZE} height={CANVAS_SIZE} id = {`${layer}@sidebar`} style = {{width:'60px',height:'60px',backgroundColor:'white'}}></canvas>
                    <div className="layerOptions">
                    {prepareLayerName(layer)}
                    </div>
                </div>

            })
        }
    </div>

}