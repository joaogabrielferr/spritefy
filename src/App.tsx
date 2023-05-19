import {useEffect, useState } from "react";
import Editor from "./Editor"
import './styles/sideBar.css';
import './styles/index.css';
import {ColorResult, SketchPicker} from 'react-color';
import { Pencil } from "./svg/Pencil";
import { Eraser } from "./svg/Eraser";
import { PaintBucket } from "./svg/PaintBucket";
import { Dropper } from "./svg/Dropper";
import { Line } from "./svg/Line";
import { Square } from "./svg/Square";

type toolsType = 'pencil' | 'eraser' | 'paintBucket' | 'dropper' | 'line' | 'square';

type ToolButton= {tool : toolsType, svg : JSX.Element};

const ToolButtons = [
  {tool:'pencil',svg: <Pencil/>},
  {tool:'eraser',svg: <Eraser/>},
  {tool:'paintBucket',svg: <PaintBucket/>},
  {tool:'dropper',svg: <Dropper/>},
  {tool:'line',svg: <Line/>},
  {tool: 'square',svg : <Square/>}
] as ToolButton[];


function App() {

  //add contexts, etc
  const [selectedColor,setSelectedColor] = useState("#000000");
  const [selectedTool,setSelectedTool] = useState<toolsType>('pencil');
  const [cssCanvasSize,setCssCanvasSize] = useState<number>(700); //TODO: change the name of this state to something like canvasWrapperSize

  //here mobile is simply any device that has a screen height greater than screen width
  const [isMobile,setIsMobile] = useState<boolean>(window.innerWidth < window.innerHeight); //TODO:this may be two simple, search for a better way to detect a mobile device

  function handleWindowResize(){
    setIsMobile(window.innerWidth < window.innerHeight);
  }

  useEffect(()=>{

    //innerHeight of screen - 50px of header - some offset

    //if on mobile, set this state to be equal to screen width
    console.log(window.innerWidth);
      if(isMobile)setCssCanvasSize(window.innerWidth);
      else setCssCanvasSize(window.innerHeight - 50 - 30)
      //setCssCanvasSize(600)

      window.addEventListener('resize',handleWindowResize)

      return function(){
        window.removeEventListener('resize',handleWindowResize);
      }

  },[isMobile]);


  function handleChangeSelectedColor(color : ColorResult){
    setSelectedColor(color.hex);
  }

  function createButton(button : ToolButton) : JSX.Element{
    const desktopHandler = {onClick: ()=>setSelectedTool(button.tool)};
    // const mobileHandler = {onPointerEnter: ()=>setSelectedTool(button.tool)};
    
    let buttonProps = {className : 'toolButton', key: button.tool};
    if(isMobile)buttonProps = {...buttonProps};
    else buttonProps = {...buttonProps,...desktopHandler};
    return <button {...buttonProps} style={{backgroundColor:selectedTool === button.tool ? "#634cb8" : "#dddddd"}} >{button.svg}</button>

  }


  //TODO: Make wrapper component for the sidebar and componetns for toolbar,colorpickerwrapper and header

  return (
    <main>
      <header className="header">
        <div><h1 style = {{fontWeight:'bold',letterSpacing:'3px'}}>VIEWWIT</h1></div>
      </header>
      <section className = "MainSection">
      <div className = "editorWrapper">
          {!isMobile && <div className="sideBar" style = {{height:cssCanvasSize,width:'10%'}}>
          <div className = "toolbar">
            TOOLS 
            <div className = "toolbarButtons">

                  {
                    ToolButtons.map((button : ToolButton)=>createButton(button))
                  }
              

            </div>
            <p id = "coordinates">{"[0x0]"}</p>
          </div>
          </div>}
          <Editor 
            selectedColor = {selectedColor} 
            selectedTool = {selectedTool} 
            cssCanvasSize = {cssCanvasSize} 
            onSelectedColor = {setSelectedColor}
            isMobile = {isMobile}
          ></Editor>    
           {!isMobile && <div className="sideBar" style = {{height:cssCanvasSize}}>
             <div className = "colorPickerWrapper">
               <SketchPicker color={selectedColor} onChangeComplete={handleChangeSelectedColor} width="150px"></SketchPicker>
             </div>
           </div>}
        </div>
      </section>
    </main>
  )
}

export default App
