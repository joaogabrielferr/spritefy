import {useContext, useEffect, useState } from "react";
import Editor from "./Editor"
import './styles/sideBar.css';
import './styles/index.css';
import {ColorResult, CustomPicker, HuePicker, SketchPicker} from 'react-color';
import { Pencil } from "./svg/Pencil";
import { Eraser } from "./svg/Eraser";
import { PaintBucket } from "./svg/PaintBucket";
import { Dropper } from "./svg/Dropper";
import { Line } from "./svg/Line";
import { Square } from "./svg/Square";
import { Sidebar } from "./components/Sidebar";
import { ToolButton } from "./types";
import { Toolbar } from "./components/Toolbar";
import { Circle } from "./svg/Circle";
import { Palettes } from "./components/Palettes";
import { selectedColorContext } from "./contexts/selectedColor/selectedColorContext";
import { selectedToolContext } from "./contexts/selectedTool/selectedToolContext";
import { Header } from "./components/Header";
import { Tooltip } from 'react-tooltip';
import {
  EditableInput,
  Hue,
  Saturation
} from "react-color/lib/components/common";
import CustomColorPicker from "./components/ColorPicker";



const ToolButtons = [
  {tool:'pencil',svg: <Pencil/>,tooltip:'Pen tool(P or 1)'},
  {tool:'eraser',svg: <Eraser/>,tooltip:'Eraser tool(E or 2)'},
  {tool:'paintBucket',svg: <PaintBucket/>,tooltip: 'Paint bucket(B or 3)'},
  {tool:'dropper',svg: <Dropper/>,tooltip:'Color picker(D or 4)'},
  {tool:'line',svg: <Line/>,tooltip:'Pencil stroke line(L or 5)'},
  {tool: 'square',svg : <Square/>,tooltip:'Rectangle tool(R or 6)'},
  {tool: 'circle',svg : <Circle/>,tooltip:'Circle tool(C or 7)'},
] as ToolButton[];


//TODO: Set the important variables as states (pen size, canvas size, etc, also update canvas size on window resize)
//TODO: Add button to reset all canvas positions (back to the center of outer div)
//TODO: set CANVAS_SIZE and pen size as state and globally available with context
//TODO: Add license page to add licenses of libs used (tabler-icon)


function App() {

  const {selectedColor,setSelectedColor} = useContext(selectedColorContext);
  const {selectedTool,setSelectedTool} = useContext(selectedToolContext);


  const [cssCanvasSize,setCssCanvasSize] = useState<number>(window.innerHeight - 50 - 30); //TODO: change the name of this state to something like canvasWrapperSize

  const [penSize,setPenSize] = useState<number>(1);


  //here mobile is simply any device that has a screen height greater than screen width
  const [isMobile,setIsMobile] = useState<boolean>(window.innerWidth <= 768); //TODO:this may be two simple, search for a better way to detect a mobile device


  useEffect(function(){
    function handleWindowResize(){
      // console.log(cssCanvasSize);
      // console.log("updating size:",window.innerWidth - 200 - 30);
    
      setCssCanvasSize((_)=>window.innerHeight - 50 - 30)
  
      if(window.innerWidth <= 1000)
      {
        setCssCanvasSize((_)=>cssCanvasSize - 200);
      }
      
      if(window.innerWidth <= 768)
      {
        setCssCanvasSize((_)=>window.innerWidth);
      }
  
      setIsMobile((_)=>window.innerWidth <= 768);
    }

      window.addEventListener('resize',handleWindowResize)

      return function(){
        window.removeEventListener('resize',handleWindowResize);
      }

  },[cssCanvasSize]);



  function handleChangeSelectedColor(color : ColorResult){
    setSelectedColor(color.hex);
  }

  const ColorPicker = CustomPicker(CustomColorPicker);


  return (
        <main>
          <Header isMobile = {isMobile}/>
          <section className = "mainSection">
            <div className = "editorWrapper">

                {!isMobile && 
                <Sidebar width={'7%'} height={cssCanvasSize}>
                    <Toolbar toolButtons={ToolButtons} selectedTool={selectedTool} setSelectedTool={setSelectedTool} setPenSize = {setPenSize} penSize = {penSize}/>
                </Sidebar>}

                <Editor 
                  cssCanvasSize = {cssCanvasSize} 
                  isMobile = {isMobile}
                  penSize = {penSize}
                ></Editor>    


                {!isMobile && <div className="sideBar" style = {{height:cssCanvasSize}}>
                    <Sidebar width={'90%'} height={cssCanvasSize}>
                        <ColorPicker color = {selectedColor} onChange ={handleChangeSelectedColor}/>
                        <Palettes></Palettes>
                    </Sidebar>
                </div>}
              </div>

              <div>
              {isMobile && <div style={{width:'350px', height:'300px',marginTop:'18px'}}>
                  <HuePicker width="auto" color={selectedColor} onChangeComplete={handleChangeSelectedColor}></HuePicker>
                  <Toolbar toolButtons={ToolButtons} selectedTool={selectedTool} setSelectedTool={setSelectedTool} setPenSize = {setPenSize} penSize = {penSize}></Toolbar>
              </div>}
              
              </div>
          </section>
          <Tooltip id="my-tooltip" place="right" style={{zIndex:9999,backgroundColor:'#383838'}}/>
        </main>
  )
}

export default App
