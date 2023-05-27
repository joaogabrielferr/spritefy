import React, { useEffect } from "react";
import { ToolButton, toolsType } from "../types";
import './toolbar.css';
import { ToolOptions } from "./ToolOptions";


interface ToolbarProps{
    toolButtons : ToolButton[],
    selectedTool : string,
    setSelectedTool : React.Dispatch<React.SetStateAction<toolsType>>,
    setPenSize : React.Dispatch<React.SetStateAction<number>>,
    penSize : number
}



export function Toolbar({toolButtons,setSelectedTool,selectedTool,setPenSize,penSize} : ToolbarProps){

    
    
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
                setSelectedTool('square');
            }else if(['c','C','7'].indexOf(event.key) > -1)
            {
                setSelectedTool('circle');
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

            <div className="toolbarItem" style = {{height:'100px'}}>
                {
                    selectedTool === 'pencil' ? <ToolOptions><div className = "toolTitle">PENCIL</div></ToolOptions> :
                    (selectedTool === 'eraser' ? <ToolOptions><div className = "toolTitle">ERASER</div></ToolOptions> : null)
                }
            </div>
            
            {/* <div className = "toolbarItem">
            <div className = "toolTitle">PEN SIZE</div>
            <div className="toolbarPenSizes" data-tooltip-id="my-tooltip" data-tooltip-content={"Pen sizes(1 to 3)"} >
                <div style={{width:'25px',height:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
                {penSize > 1 && <button className = "penSizeButton" onClick={()=>setPenSize((prev)=>prev-1)}><LeftArrow/></button>}
                </div>
                <div style = {{fontWeight:'bold',width:'25px',height:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>{penSize}x</div>
                <div style={{width:'25px',height:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
                {penSize < 3 && <button  className = "penSizeButton" onClick={()=>setPenSize((prev)=>prev+1)}><RightArrow/></button>}
                </div>
            </div>
            </div> */}
            </div>

}