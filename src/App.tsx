import { useEffect, useState } from "react";
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
import { Header } from "./components/Header";
import { Tooltip } from 'react-tooltip';
import CustomColorPicker from "./components/ColorPicker";
import { EventBus } from "./EventBus";
import { RESET_CANVAS_POSITION } from "./utils/constants";
import { store,StoreType } from "./store";
import { Frames } from "./components/Frames";
import { Preview } from "./components/Preview";



const ToolButtons = [
  {tool:'pencil',svg: <Pencil/>,tooltip:'Pen tool(P or 1)'},
  {tool:'eraser',svg: <Eraser/>,tooltip:'Eraser tool(E or 2)'},
  {tool:'paintBucket',svg: <PaintBucket/>,tooltip: 'Paint bucket(B or 3)'},
  {tool:'dropper',svg: <Dropper/>,tooltip:'Color picker(D or 4)'},
  {tool:'line',svg: <Line/>,tooltip:'Pencil stroke line(L or 5)'},
  {tool: 'rectangle',svg : <Square/>,tooltip:'Rectangle tool(R or 6)'},
  {tool: 'elipse',svg : <Circle/>,tooltip:'Circle tool(C or 7)'},
] as ToolButton[];


//TODO: right now im saving the gifs with a white background because i couldnt figure out how to create transparent gifs with gif.js,
        //probably look for another library that supports transparent bg (or keep it white, pixilart also saves gifs with white bg so transparent bg may not be easy to achieve)
//TODO: add pixel_size and display_size as global states (and stop using CANVAS_SIZE)
//TODO: add eslint to project
//TODO: add styled components
//TODO: save image (check if its possible to save pixel matrix, if not generate an image and save it)
//TODO: Add tutorial if opened for the first time
//TODO: Add license page to add licenses of libs used (tabler-icon)

//TODO: possible options to each tool
// pen:
// erase with left click

// eraser:
// erase with left click

// paint bucket:
// diagonal neighbors
//erase pixels instead of painting
//change color of all pixels with the start colors

// color picker:
// choose as current color
// add to palette





function App() {
  
  const selectedColor = store((state : StoreType) => state.selectedColor);
  const setSelectedColor = store((state : StoreType) => state.setSelectedColor);


  const [cssCanvasSize,setCssCanvasSize] = useState<number>(700); //TODO: change the name of this state to something like canvasWrapperSize

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


      if(isMobile)setCssCanvasSize(window.innerWidth);
      else setCssCanvasSize(window.innerHeight - 50 - 30)

      window.addEventListener('resize',handleWindowResize)
      window.addEventListener("contextmenu", e => e.preventDefault());

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
                <Sidebar width={'230px'} height={cssCanvasSize} marginTop={'30px'}>
                    <Toolbar toolButtons={ToolButtons} isMobile = {isMobile}/>
                  <div style = {{width:'95%'}}>
                    <ColorPicker color = {selectedColor} onChange ={handleChangeSelectedColor}/>
                  </div>
                    {/* <Palettes></Palettes> */}
                </Sidebar>}
                
                <div style = {{width:'100%',height:cssCanvasSize}}>
                <div style = {{width:'100%',height:'30px',backgroundColor:'rgb(46, 46, 49)',display:'flex',justifyContent:'flex-start',alignItems:'center'}}>
                  <span id = "coordinates" style = {{color:'white',fontSize:'12px',marginRight:'20px',width:'60px',userSelect:'none'}}>{"[X:0,Y:0]"}</span>
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
                    <Preview/>
                    <Frames/>
                  </Sidebar>
                }

              </div>

              {isMobile && <div className = "mobileOptions">
                  {/* <ColorPicker color = {selectedColor} onChange ={handleChangeSelectedColor}/> */}
                  <Toolbar toolButtons={ToolButtons}></Toolbar>
              </div>}
              
             
          </section>
          {/* {
            !isMobile && <Tooltip id="my-tooltip" place="bottom" style={{zIndex:9999,backgroundColor:'#634cb8'}}/>
          }
          {
            !isMobile && <Tooltip id="my-tooltip-layers" place="left" style={{zIndex:9999,backgroundColor:'#634cb8'}}/>
          } */}
          <div className = "footer">
            {/* <button onClick = {handleResetCanvasPosition}>center canvas</button>
            <p id = "coordinates">{"[X:0,Y:0]"}</p> */}
          </div>
        </main>
  )
}

export default App
