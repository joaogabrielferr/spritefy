import {useEffect, useRef, useState } from "react";
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
import { Sidebar } from "./components/Sidebar";
import { toolsType,ToolButton } from "./types";
import { Toolbar } from "./components/Toolbar";
import { Circle } from "./svg/Circle";


const ToolButtons = [
  {tool:'pencil',svg: <Pencil/>},
  {tool:'eraser',svg: <Eraser/>},
  {tool:'paintBucket',svg: <PaintBucket/>},
  {tool:'dropper',svg: <Dropper/>},
  {tool:'line',svg: <Line/>},
  {tool: 'square',svg : <Square/>},
  {tool: 'circle',svg : <Circle/>},
] as ToolButton[];

//TODO: Add background canvas and change logic of erasing, etc (dont forget to scale bgCanvas with the other ones)
//TODO: Add erasing to ctrl z logic
//TODO: Add circle tool
//TODO: Improve style (try to make it definitive)
//TODO: Set the important variables as states (pen size, canvas size, etc, also update canvas size on window resize)
//TODO: Add button to reset all canvas positions (back to the center of outer div)
/*TODO: Add different pen Sizes (probably allow user to set pixel_size, then search for all pixels within the painted area,
        also use a different variable since pixel_size is used to initialize pixel matrix and other stuff)*/

//TODO: set CANVAS_SIZE and pen size as state and globally available with context
//TODO: Add license page to add licenses of libs used (tabler-icon)


function App() {

  //add contexts, etc
  const [selectedColor,setSelectedColor] = useState("#000000");
  const [selectedTool,setSelectedTool] = useState<toolsType>('pencil');
  const [cssCanvasSize,setCssCanvasSize] = useState<number>(700); //TODO: change the name of this state to something like canvasWrapperSize


  const downloadButton = useRef<HTMLButtonElement | null>(null);


  //here mobile is simply any device that has a screen height greater than screen width
  const [isMobile,setIsMobile] = useState<boolean>(window.innerWidth < window.innerHeight); //TODO:this may be two simple, search for a better way to detect a mobile device

  function handleWindowResize(){
    setIsMobile(window.innerWidth < window.innerHeight);
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

  useEffect(function(){
      if(downloadButton.current){
        downloadButton.current.addEventListener("click", function(){
        let downloadLink = document.createElement("a");
        downloadLink.setAttribute("download", "my_draw.png");
        let dataURL = (document.getElementById('canvas') as HTMLCanvasElement)!.toDataURL("image/png");
        let url = dataURL.replace(/^data:image\/png/, "data:application/octet-stream");
        downloadLink.setAttribute("href", url);
        downloadLink.click();
        }
    );
  }
},[]);


  function handleChangeSelectedColor(color : ColorResult){
    setSelectedColor(color.hex);
  }


  //TODO: Make wrapper component for the sidebar and componetns for toolbar,colorpickerwrapper and header

  //TODO: Refactor the styling its terrible

  return (
    <main>
      <header className="header">
        <div><h1 style = {{fontWeight:'bold',letterSpacing:'3px'}}>VIEWWIT</h1></div>
        <button ref = {downloadButton} style = {{width:'10%',height:'85%'}}>DOWNLOAD DRAWING</button>
      </header>
      <section className = "mainSection">
      <div className = "editorWrapper">
          {!isMobile && 
          <Sidebar width={'10%'} height={cssCanvasSize}>
              <Toolbar toolButtons={ToolButtons} selectedTool={selectedTool} setSelectedTool={setSelectedTool} isMobile={isMobile}/>
          </Sidebar>}
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
