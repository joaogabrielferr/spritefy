import React, { useEffect } from "react";
import { ToolButton, toolsType } from "../types";
import '../styles/toolbar.css';


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
            }else if(['s','S','6'].indexOf(event.key) > -1)
            {
                setSelectedTool('square');
            }
        }

        document.addEventListener('keydown',checkKeys);

        return function(){
            document.removeEventListener('keydown',checkKeys);
        }

    },[selectedTool, setSelectedTool])

    
    // function createButton(button : ToolButton) : JSX.Element{
    //     console.log("RUNNING CREATE BUTTON");
    //     // const desktopHandler = {onClick: ()=>setSelectedTool(button.tool)};
    //     // const mobileHandler = {onPointerEnter: ()=>setSelectedTool(button.tool)};
    //     let buttonProps = {className : 'toolButton', key: button.tool};
    //     if(isMobile)buttonProps = {...buttonProps};
    //     else buttonProps = {...buttonProps};
    //     return <button {...buttonProps} style={{backgroundColor:selectedTool === button.tool ? "#634cb8" : "#dddddd"}} >{button.svg}</button>
    
    //   }
    console.log(penSize);

    return <div className = "toolbar">
            <div><h6>TOOLS</h6></div>
            <div className = "toolbarButtons">

                    {
                    toolButtons.map((button : ToolButton)=>{
                        return <button className = "toolButton"
                        style={{backgroundColor:selectedTool === button.tool ? "#634cb8" : "#dddddd"}}
                        onClick={()=>setSelectedTool(button.tool)}
                        key = {button.tool}     
                        >{button.svg}</button>
                    })
                    }
                

            </div>

            <div><h6>PEN SIZES</h6></div>
            <div className="toolbarPenSizes">
                <button className = "penSizeButton" style={{backgroundColor: penSize === 1 ? "#634cb8" : "#dddddd",height:'10px',width:'25%'}} onClick={()=>setPenSize(1)}></button>
                <button className = "penSizeButton" style={{backgroundColor: penSize === 2 ? "#634cb8" : "#dddddd",height:'15px',width:'25%'}} onClick={()=>setPenSize(2)}></button>
                <button className = "penSizeButton" style={{backgroundColor: penSize === 3 ? "#634cb8" : "#dddddd",height:'20px',width:'25%'}} onClick={()=>setPenSize(3)}></button>
            </div>

            <p id = "coordinates">{"[X:0,Y:0]"}</p>
            </div>

}