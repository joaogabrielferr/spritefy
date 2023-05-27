import {useContext, useEffect, useState } from "react";
import Editor from "./Editor";
import './index.css';
import {ColorResult, CustomPicker} from 'react-color';
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
import CustomColorPicker from "./components/ColorPicker";
import { EventBus } from "./EventBus";
import { RESET_CANVAS_POSITION } from "./utils/constants";



const ToolButtons = [
  {tool:'pencil',svg: <Pencil/>,tooltip:'Pen tool(P or 1)'},
  {tool:'eraser',svg: <Eraser/>,tooltip:'Eraser tool(E or 2)'},
  {tool:'paintBucket',svg: <PaintBucket/>,tooltip: 'Paint bucket(B or 3)'},
  {tool:'dropper',svg: <Dropper/>,tooltip:'Color picker(D or 4)'},
  {tool:'line',svg: <Line/>,tooltip:'Pencil stroke line(L or 5)'},
  {tool: 'square',svg : <Square/>,tooltip:'Rectangle tool(R or 6)'},
  {tool: 'circle',svg : <Circle/>,tooltip:'Circle tool(C or 7)'},
  {tool: 'circle',svg : <Circle/>,tooltip:'Circle tool(C or 7)'},
  {tool: 'circle',svg : <Circle/>,tooltip:'Circle tool(C or 7)'},
  {tool: 'circle',svg : <Circle/>,tooltip:'Circle tool(C or 7)'},
] as ToolButton[];


//TODO: Redo UI
//TODO: Detect pinch for zooming in mobile
//TODO: save image (check if its possible to save pixel matrix, if not generate an image and save it)
//TODO: Add tutorial if opened for the first time
//TODO: Add license page to add licenses of libs used (tabler-icon)
//TODO: Add layer functionality

function App() {

  const {selectedColor,setSelectedColor} = useContext(selectedColorContext);
  const {selectedTool,setSelectedTool} = useContext(selectedToolContext);

  const [cssCanvasSize,setCssCanvasSize] = useState<number>(700); //TODO: change the name of this state to something like canvasWrapperSize

  const [penSize,setPenSize] = useState<number>(1);


  //here mobile is simply any device that has a screen height greater than screen width
  const [isMobile,setIsMobile] = useState<boolean>(window.innerWidth <= 768); //TODO:this may be two simple, search for a better way to detect a mobile device


  function handleWindowResize(){
    

    setCssCanvasSize(window.innerHeight - 50 - 30)

    EventBus.getInstance().publish(RESET_CANVAS_POSITION);
    
    if(window.innerWidth <= 768)
    {
      setCssCanvasSize(window.innerWidth);
    }

    setIsMobile(window.innerWidth <= 768);
  }

  useEffect(function(){


    //if on mobile, set this state to be equal to screen width
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

  const ColorPicker = CustomPicker(CustomColorPicker);


  return (
        <main>
          <Header isMobile = {isMobile}/>
          <section className = "mainSection">
            <div className = "editorWrapper">

                {/* left sidebar */}
                {!isMobile && 
                <Sidebar width={'230px'} height={cssCanvasSize}>
                    <Toolbar toolButtons={ToolButtons} selectedTool={selectedTool} setSelectedTool={setSelectedTool} setPenSize = {setPenSize} penSize = {penSize}/>
                  <div style = {{width:'95%'}}>
                    <ColorPicker color = {selectedColor} onChange ={handleChangeSelectedColor}/>
                  </div>
                    <Palettes></Palettes>
                </Sidebar>}
                
                {/* main editor */}
                <div style = {{width:'100%',height:'100%'}}>
                <div style = {{width:'100%',height:'30px',backgroundColor:'#000000',display:'flex',justifyContent:'flex-start',alignItems:'center'}}>
                <span id = "coordinates" style = {{color:'white'}}>{"[X:0,Y:0]"}</span>
                </div>
                  <Editor 
                    cssCanvasSize = {cssCanvasSize} 
                    isMobile = {isMobile}
                    penSize = {penSize}
                  ></Editor>    
                </div>

                 {/* right sidebar */}
                {!isMobile && 
                  <Sidebar width={'250px'} height={cssCanvasSize}>
                    <div style = {{width:'90%',height:'100%'}}>
                      
                      {/* <ColorPicker color = {selectedColor} onChange ={handleChangeSelectedColor}/>
                      <Palettes></Palettes> */}
                    </div>
                  </Sidebar>
                }

              </div>

              <div>
              {isMobile && <div className = "mobileOptions">
                  <ColorPicker color = {selectedColor} onChange ={handleChangeSelectedColor}/>
                  <Toolbar toolButtons={ToolButtons} selectedTool={selectedTool} setSelectedTool={setSelectedTool} setPenSize = {setPenSize} penSize = {penSize}></Toolbar>
              </div>}
              
              </div>
          </section>
          {/* {
            !isMobile && <Tooltip id="my-tooltip" place="bottom" style={{zIndex:9999,backgroundColor:'#634cb8'}}/>
          } */}
          <div className = "footer">
            {/* <button onClick = {handleResetCanvasPosition}>center canvas</button>
            <p id = "coordinates">{"[X:0,Y:0]"}</p> */}
          </div>
        </main>
  )
}

export default App
