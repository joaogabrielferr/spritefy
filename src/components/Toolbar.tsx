import React, { useEffect } from "react";
import { ToolButton } from "../types";
import './toolbar.css';
import { store,StoreType } from "../store";
import { LeftArrow } from "../svg/LeftArrow";
import { RightArrow } from "../svg/RightArrow";
import { EventBus } from "../EventBus";
import { REDO_LAST_DRAW, RESET_CANVAS_POSITION, UNDO_LAST_DRAW } from "../utils/constants";


interface ToolbarProps{
    toolButtons : ToolButton[],
    isMobile? : boolean
}



export function Toolbar({toolButtons,isMobile} : ToolbarProps){

    const selectedTool = store((state : StoreType) => state.selectedTool);
    const setSelectedTool = store((state : StoreType) => state.setSelectedTool);
    const oneToOneRatioElipse = store((state : StoreType) => state.oneToOneRatioElipse);
    const toogleOneToOneRatioElipse = store((state : StoreType) => state.toogleOneToOneRatioElipse);
    const toogleXMirror = store((state : StoreType)=> state.toogleXMirror);
    const XMirror = store((state : StoreType) => state.xMirror);
    const toogleYMirror = store((state : StoreType)=> state.toogleYMirror);
    const YMirror = store((state : StoreType) => state.yMirror);
    const erasingRightButton = store((state : StoreType) => state.erasingRightButton);

    const toogleErasingRightButton = store((state : StoreType) => state.toogleErasingRightButton);

    
    useEffect(()=>{
        
        
        function checkKeys(event : KeyboardEvent){
        
            if(['p','P','1'].indexOf(event.key) > -1)
            {
                setSelectedTool('pencil');
            }else if(['e','E','2'].indexOf(event.key) > -1)
            {
                setSelectedTool('eraser');
            }else if(['b','B','3'].indexOf(event.key) > -1)
            {
                setSelectedTool('paintBucket');
            }else if(['d','D','4'].indexOf(event.key) > -1)
            {
                setSelectedTool('dropper');
            }else if(['l','L','5'].indexOf(event.key) > -1)
            {
                setSelectedTool('line');
            }else if(['r','R','6'].indexOf(event.key) > -1)
            {
                setSelectedTool('rectangle');
            }else if(['c','C','7'].indexOf(event.key) > -1)
            {
                setSelectedTool('elipse');
            }
        }

        document.addEventListener('keydown',checkKeys);

        return function(){
            document.removeEventListener('keydown',checkKeys);
        }

    },[setSelectedTool])


    return <div className = "toolbar">
            <div className = "toolbarItem">
            <div className = "toolbarButtons">

                    {
                    toolButtons.map((button : ToolButton)=>{
                        return <button className = "toolButton"
                        style={{backgroundColor:selectedTool === button.tool ? "#634cb8" : ""}}
                        onClick={()=>setSelectedTool(button.tool)}
                        key = {button.tool} 
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content={button.tooltip}    
                        >{button.svg}</button>
                    })
                    }
                

            </div>
            </div>

            <div className="toolbarItem">
                <ToolOptions>
                    <div style = {{marginTop:'5px',fontSize:'12px',fontWeight:'bold'}}>{selectedTool.toUpperCase()}</div>
                    {
                    (['pencil','eraser','line','rectangle','elipse'].find((tool)=>tool === selectedTool)) && <div>
                        <div style = {{marginTop:'5px',fontSize:'12px'}}>PEN SIZE</div>
                        <PenSizeSlider/>
                    </div>
                    }
                    {
                        selectedTool === 'elipse' && <div className = "checkboxWrapper">
                            <label className="checkbox">
                            Keep 1 to 1 ratio
                            <input type="checkbox" id = "OneToOneRatioElipse" checked = {oneToOneRatioElipse} onChange = {()=>toogleOneToOneRatioElipse()}/>
                            <span className="checkmark"></span>
                            </label>
                        </div>
                    }
                    {
                        (['pencil'].find((tool)=>tool === selectedTool)) && <div className = "checkboxWrapper">
                            <label className="checkbox">
                            MIRROR X AXIS
                            <input type="checkbox" id = "MirrorXAxis" checked = {XMirror} onChange = {()=>toogleXMirror()}/>
                            <span className="checkmark"></span>
                            </label>
                        </div>
                    }
                    {
                        (['pencil'].find((tool)=>tool === selectedTool)) && <div className = "checkboxWrapper">
                            <label className="checkbox">
                            MIRROR Y AXIS
                            <input type="checkbox" id = "MirrorXAxis" checked = {YMirror} onChange = {()=>toogleYMirror()}/>
                            <span className="checkmark"></span>
                            </label>
                        </div>
                    }
                    {
                        (['eraser'].find((tool)=>tool === selectedTool)) && !isMobile && <div className = "checkboxWrapper">
                            <label className="checkbox">
                            ERASE ON RIGHT CLICK
                            <input type="checkbox" id = "MirrorXAxis" checked = {erasingRightButton} onChange = {()=>toogleErasingRightButton()}/>
                            <span className="checkmark"></span>
                            </label>
                        </div>
                    }

                </ToolOptions>
                    
            </div>

            <div className="toolbarItem">
                <button onClick = {()=>{EventBus.getInstance().publish(UNDO_LAST_DRAW)}} className="extraOptionsButton"><LeftArrow/>UNDO</button>
                <button onClick = {()=>{EventBus.getInstance().publish(REDO_LAST_DRAW)}} className="extraOptionsButton"><RightArrow/>REDO</button>
                <button onClick = {()=>{EventBus.getInstance().publish(RESET_CANVAS_POSITION)}} className="extraOptionsButton">RESET CANVAS POSITION</button>
            </div>
        
            </div>

}


function PenSizeSlider(){

    const penSize = store((state : StoreType) => state.penSize);
    const setPenSize = store((state : StoreType) => state.setPenSize);

    return <>
            <div className = "SliderWrapper">
                <div className ="SliderRange">
                    <input className = "Slider" type="range" min={1} max={10} value={penSize} onChange={(e)=>setPenSize(+e.target.value)} id="range" /> 
                </div>
                <div className ="SliderValue">{penSize}</div>
            </div>
    </>
}

function ToolOptions({children} : {children:React.ReactNode}){

    return <div className = "ToolOptions">
        <div className = "InnerToolOptions">
        {children}    
        </div>
    </div>

}