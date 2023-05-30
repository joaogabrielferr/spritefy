import React, { useEffect } from "react";
import { Store, ToolButton } from "../types";
import './toolbar.css';
import { store } from "../store";


interface ToolbarProps{
    toolButtons : ToolButton[],
}



export function Toolbar({toolButtons} : ToolbarProps){

    const selectedTool = store((state : Store) => state.selectedTool);
    const setSelectedTool = store((state : Store) => state.setSelectedTool);
    
    useEffect(()=>{
        
        
        function checkKeys(event : KeyboardEvent){
        
            if(['p','P','1'].indexOf(event.key) > -1)
            {
                setSelectedTool('pencil');
                selectedTool
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

    },[selectedTool, setSelectedTool])

    return <div className = "toolbar">
            <div className = "toolbarItem">
            <div className = "toolTitle">TOOLS</div>
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
                    {
                        (['pencil','eraser','line','square','elipse'].find((tool)=>tool === selectedTool)) &&
                        <ToolOptions>
                            <div style = {{marginTop:'5px',fontSize:'12px'}}>{selectedTool}</div>
                            <div className = "toolTitle" style = {{marginTop:'5px'}}>Pen size</div>
                            <PenSizeSlider/>
                        </ToolOptions>
                    }
            </div>
        
            </div>

}


function PenSizeSlider(){

    // const {penSize,setPenSize} = useContext(penSizeContext);
    const penSize = store((state : Store) => state.penSize);
    const setPenSize = store((state : Store) => state.setPenSize);

    return <>
            <div className = "penSizeWrapper">
                <div className ="penSizeRange">
                    <input className = "penSizeSlider" type="range" min={1} max={10} value={penSize} onChange={(e)=>setPenSize(+e.target.value)} id="range" /> 
                </div>
                <div className ="penSizeValue">{penSize}</div>
            </div>
    </>
}

function ToolOptions({children} : {children:React.ReactNode}){

    return <div className = "ToolOptions">
        {children}    
    </div>

}