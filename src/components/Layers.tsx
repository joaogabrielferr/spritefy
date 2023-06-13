import { useEffect } from "react";
import { EventBus } from "../EventBus";
import { StoreType, store } from "../store"
import {Layer, drawOnSideBarCanvasType } from "../types";
import { BACKGROUND_CANVAS, CANVAS_SIZE, CREATE_NEW_LAYER, DRAW_ON_SIDEBAR_CANVAS, SELECT_LAYER, TOOGLE_LAYER_VISIBILITY, TOP_CANVAS } from "../utils/constants";
import './layers.css';
import { Eye } from "../svg/Eye";
import { EyeOff } from "../svg/EyeOff";

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

    function changeCurrentLayer(layer : Layer)
    {
        if(layer.visible)
        {
            EventBus.getInstance().publish<string>(SELECT_LAYER,layer.canvas);
        }

    }

    function prepareLayerName(name : string)
    {
        return "LAYER " + name[name.length - 1];
    }

    function createNewLayerHandler()
    {
        EventBus.getInstance().publish(CREATE_NEW_LAYER);
    }

    function toogleLayerVisibility(layer : Layer){
            EventBus.getInstance().publish(TOOGLE_LAYER_VISIBILITY,layer.canvas);
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

                return (layer.canvas != TOP_CANVAS.canvas && layer.canvas != BACKGROUND_CANVAS.canvas) && 
                <div className = "layerWrapper" key = {layer.canvas} style = {{height:'60px',width:'100%',border:layer.canvas === currentLayer ? `3px solid #261857` : undefined}}>
                    <div 
                    className = "layerCanvas" 
                    onClick={()=>changeCurrentLayer(layer)}
                    style = {{backgroundColor: !layer.visible ? '#5e1818' : undefined,cursor: layer.visible ? 'pointer' : 'default'}}
                    data-tooltip-id={!layer.visible ? "my-tooltip-layers" : ""}
                    data-tooltip-content={!layer.visible ? 'toogle the visibility of the layer before selecting it' : ""}  
                    >
                    <canvas width={CANVAS_SIZE} height={CANVAS_SIZE} id = {`${layer.canvas}@sidebar`} style = {{width:'60px',height:'60px',backgroundColor:'white'}}></canvas>
                    {prepareLayerName(layer.canvas)}
                    </div>
                    <div className="layerOptions">
                       <span>
                        <button onClick ={()=>toogleLayerVisibility(layer)}>{layer.visible ? <Eye/> : <EyeOff/>}</button>
                       </span>
                    </div>
                </div>

            })
        }
    </div>

}