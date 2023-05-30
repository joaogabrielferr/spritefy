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
import { Header } from "./components/Header";
import { Tooltip } from 'react-tooltip';
import CustomColorPicker from "./components/ColorPicker";
import { EventBus } from "./EventBus";
import { RESET_CANVAS_POSITION } from "./utils/constants";
import { LeftArrow } from "./svg/LeftArrow";
import { RightArrow } from "./svg/RightArrow";



const ToolButtons = [
  {tool:'pencil',svg: <Pencil/>,tooltip:'Pen tool(P or 1)'},
  {tool:'eraser',svg: <Eraser/>,tooltip:'Eraser tool(E or 2)'},
  {tool:'paintBucket',svg: <PaintBucket/>,tooltip: 'Paint bucket(B or 3)'},
  {tool:'dropper',svg: <Dropper/>,tooltip:'Color picker(D or 4)'},
  {tool:'line',svg: <Line/>,tooltip:'Pencil stroke line(L or 5)'},
  {tool: 'rectangle',svg : <Square/>,tooltip:'Rectangle tool(R or 6)'},
  {tool: 'elipse',svg : <Circle/>,tooltip:'Circle tool(C or 7)'},
  {tool: 'undo',svg : <LeftArrow/>,tooltip:'Undo last draw(Ctrl + Z)'},
  {tool: 'redo',svg : <RightArrow/>,tooltip:'Redo last draw(Ctrl + Y)'},
] as ToolButton[];


//TODO: rename square to rectangle
//TODO: Add zustand
//TODO: Detect pinch for zooming in mobile
//TODO: Add layer functionality
//TODO: save image (check if its possible to save pixel matrix, if not generate an image and save it)
//TODO: Add tutorial if opened for the first time
//TODO: Add license page to add licenses of libs used (tabler-icon)

//TODO: possible options to each tool
// pen:
// pen size - added
// erase with left click

// eraser:
// pen size -added
// erase with left click

// paint bucket:
// diagonal neighbors

// color picker:
// choose as current color
// add to palette

// rectangle:
// keep 1 to 1 ratio

// elipe:
// keep 1 to 1 ratio





function App() {

  const {selectedColor,setSelectedColor} = useContext(selectedColorContext);
  const [cssCanvasSize,setCssCanvasSize] = useState<number>(700); //TODO: change the name of this state to something like canvasWrapperSize

  //here mobile is simply any device that has a screen height greater than screen width
  const [isMobile,setIsMobile] = useState<boolean>(window.innerWidth <= 768); //TODO:this may be two simple, search for a better way to detect a mobile device


  function handleWindowResize(){
    

    setCssCanvasSize(window.innerHeight - 30 - 30)

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
                <Sidebar width={'230px'} height={cssCanvasSize} marginTop={'30px'}> {/*30px to take the extra bar into consideration*/}
                    <Toolbar toolButtons={ToolButtons}/>
                  <div style = {{width:'95%'}}>
                    <ColorPicker color = {selectedColor} onChange ={handleChangeSelectedColor}/>
                  </div>
                    <Palettes></Palettes>
                </Sidebar>}
                
                <div style = {{width:'100%',height:cssCanvasSize}}>
                  {/* extra bar */}
                <div style = {{width:'100%',height:'30px',backgroundColor:'rgb(73, 71, 71)',display:'flex',justifyContent:'flex-start',alignItems:'center'}}>
                  <span id = "coordinates" style = {{color:'white',fontSize:'12px',marginRight:'20px'}}>{"[X:0,Y:0]"}</span>
                  <button onClick = {()=>{EventBus.getInstance().publish(RESET_CANVAS_POSITION)}}>reset canvas position</button>
                </div>
                {/* main editor */}
                  <Editor 
                    cssCanvasSize = {cssCanvasSize} 
                    isMobile = {isMobile}
                  ></Editor>    
                </div>

                 {/* right sidebar */}
                {!isMobile && 
                  <Sidebar width={'250px'} height={cssCanvasSize} marginTop={'30px'}>
                    <div>here</div>
                    {/* <div style = {{width:'100%',height:'100%'}}>
                      
                      {/* <ColorPicker color = {selectedColor} onChange ={handleChangeSelectedColor}/>
                      <Palettes></Palettes> */}
                    {/*</div> */}
                  </Sidebar>
                }

              </div>

              <div>
              {isMobile && <div className = "mobileOptions">
                  <ColorPicker color = {selectedColor} onChange ={handleChangeSelectedColor}/>
                  <Toolbar toolButtons={ToolButtons}></Toolbar>
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
