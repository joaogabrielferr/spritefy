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

type toolsType = 'pencil' | 'eraser' | 'paintBucket' | 'dropper' | 'line';


function App() {

  //add contexts, etc
  const [selectedColor,setSelectedColor] = useState("#000000");
  const [selectedTool,setSelectedTool] = useState<toolsType>('pencil');
  const [cssCanvasSize,setCssCanvasSize] = useState<number>(600);

  useEffect(()=>{

    //innerHeight of screen - 50px of header - some offset
    console.log("setting canvas size with:",window.innerHeight - 80);
    setCssCanvasSize(window.innerHeight - 50 - 30)


  },[]);


  function handleChangeSelectedColor(color : ColorResult){
    setSelectedColor(color.hex);
  }


  return (
    <main>
      <header className="header">
        <div><h1>VIEWWIT</h1></div>
      </header>
      <section className = "MainSection">
      <div className = "editorWrapper">
          <div className="sideBar" style = {{height:cssCanvasSize,width:'10%'}}>
          <div className = "toolbar">
            TOOLS
            <div className = "toolbarButtons">

              <button className = "toolButton" style = {{backgroundColor: selectedTool === 'pencil' ? '#634cb8' : '#dddddd' }}  onClick={()=>setSelectedTool('pencil')}>
                {/* <FontAwesomeIcon size={"2x"} icon={faPencil} /> */}
                <Pencil/>
                </button>
              <button className = "toolButton" style = {{backgroundColor: selectedTool === 'eraser' ? '#634cb8' : '#dddddd' }}  onClick={()=>setSelectedTool('eraser')}>
                {/* <FontAwesomeIcon size={"2x"} icon={faEraser} /> */}
                <Eraser/>
                </button>
              <button className = "toolButton" style = {{backgroundColor: selectedTool === 'paintBucket' ? '#634cb8' : '#dddddd' }} onClick={()=>setSelectedTool('paintBucket')}>
                {/* <FontAwesomeIcon size={"2x"} icon={faFill} /> */}
                <PaintBucket/>
                </button>
              <button className = "toolButton" style = {{backgroundColor: selectedTool === 'dropper' ? '#634cb8' : '#dddddd' }} onClick={()=>setSelectedTool('dropper')}>
                {/* <FontAwesomeIcon size={"2x"} icon={faEyedropper} /> */}
                <Dropper/>
                </button>
              <button className = "toolButton" style = {{backgroundColor: selectedTool === 'line' ? '#634cb8' : '#dddddd' }} onClick={()=>setSelectedTool('line')}>
                {/* <FontAwesomeIcon size={"2x"} icon={faEyedropper} /> */}
                <Line/>
                </button>
            </div>
          </div>
          </div>
          <Editor selectedColor = {selectedColor} selectedTool = {selectedTool} cssCanvasSize = {cssCanvasSize} onSelectedColor = {setSelectedColor}></Editor>    
          <div className="sideBar" style = {{height:cssCanvasSize}}>
            <div className = "colorPickerWrapper">
              <SketchPicker color={selectedColor} onChangeComplete={handleChangeSelectedColor} width="150px"></SketchPicker>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
