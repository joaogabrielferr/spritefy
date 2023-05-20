import React from "react";
import { ToolButton } from "../types";
import '../styles/toolbar.css';


interface ToolbarProps{
    toolButtons : ToolButton[],
    selectedTool : string,
    setSelectedTool : React.Dispatch<React.SetStateAction<string>>,
    isMobile : boolean
}


export function Toolbar({toolButtons,setSelectedTool,isMobile,selectedTool} : ToolbarProps){

    function createButton(button : ToolButton) : JSX.Element{
        const desktopHandler = {onClick: ()=>setSelectedTool(button.tool)};
        // const mobileHandler = {onPointerEnter: ()=>setSelectedTool(button.tool)};
        let buttonProps = {className : 'toolButton', key: button.tool};
        if(isMobile)buttonProps = {...buttonProps};
        else buttonProps = {...buttonProps,...desktopHandler};
        return <button {...buttonProps} style={{backgroundColor:selectedTool === button.tool ? "#634cb8" : "#dddddd"}} >{button.svg}</button>
    
      }


    return <div className = "toolbar">
            TOOLS 
            <div className = "toolbarButtons">

                    {
                    toolButtons.map((button : ToolButton)=>createButton(button))
                    }
                

            </div>
            <p id = "coordinates">{"[0x0]"}</p>
            </div>

}