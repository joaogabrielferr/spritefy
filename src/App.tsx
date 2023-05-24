import {useContext, useEffect, useState } from "react";
import Editor from "./Editor"
import './styles/sideBar.css';
import './styles/index.css';
import {ColorResult, HuePicker, SketchPicker} from 'react-color';
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



const ToolButtons = [
  {tool:'pencil',svg: <Pencil/>},
  {tool:'eraser',svg: <Eraser/>},
  {tool:'paintBucket',svg: <PaintBucket/>},
  {tool:'dropper',svg: <Dropper/>},
  {tool:'line',svg: <Line/>},
  {tool: 'square',svg : <Square/>},
  {tool: 'circle',svg : <Circle/>},
] as ToolButton[];


//TODO: Improve style (try to make it definitive)
//TODO: Set the important variables as states (pen size, canvas size, etc, also update canvas size on window resize)
//TODO: Add button to reset all canvas positions (back to the center of outer div)
/*TODO: Add different pen Sizes (probably allow user to set pixel_size, then search for all pixels within the painted area,
        also use a different variable since pixel_size is used to initialize pixel matrix and other stuff)*/

//TODO: set CANVAS_SIZE and pen size as state and globally available with context
//TODO: Add license page to add licenses of libs used (tabler-icon)


function App() {

  const {selectedColor,setSelectedColor} = useContext(selectedColorContext);
  const {selectedTool,setSelectedTool} = useContext(selectedToolContext);

  const [cssCanvasSize,setCssCanvasSize] = useState<number>(700); //TODO: change the name of this state to something like canvasWrapperSize

  const [penSize,setPenSize] = useState<number>(1);


  //here mobile is simply any device that has a screen height greater than screen width
  const [isMobile,setIsMobile] = useState<boolean>(window.innerWidth < window.innerHeight || window.innerWidth <= 768); //TODO:this may be two simple, search for a better way to detect a mobile device

  function handleWindowResize(){
    setIsMobile(window.innerWidth < window.innerHeight || window.innerWidth <= 768);
  }

  useEffect(function(){

    //innerHeight of screen - 50px of header - some offset

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
                        <SketchPicker presetColors={[]} color={selectedColor} onChangeComplete={handleChangeSelectedColor} width="auto" disableAlpha = {true} ></SketchPicker>
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
        </main>
  )
}

export default App
