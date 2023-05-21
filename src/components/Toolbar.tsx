import React, { useEffect } from "react";
import { ToolButton, toolsType } from "../types";
import '../styles/toolbar.css';


interface ToolbarProps{
    toolButtons : ToolButton[],
    selectedTool : string,
    setSelectedTool : React.Dispatch<React.SetStateAction<toolsType>>,
    isMobile : boolean
}



export function Toolbar({toolButtons,setSelectedTool,isMobile,selectedTool} : ToolbarProps){

    
    
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


    return <div className = "toolbar">
            TOOLS 
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
            <p id = "coordinates">{"[X:0,Y:0]"}</p>
            </div>

}