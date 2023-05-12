import {useState } from "react";
import Editor from "./Editor"
import {ColorResult, SketchPicker } from 'react-color'
import './styles/sideBar.css';
import './styles/index.css';
import { CSS_CANVAS_SIZE } from "./utils/constants";
import { PencilSVG } from "./icons/PencilSVG";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import { faEraser } from "@fortawesome/free-solid-svg-icons";
import { faFill } from "@fortawesome/free-solid-svg-icons";

type toolsType = 'pencil' | 'eraser' | 'paintBucket';


function App() {

  //add contexts, etc
  const [selectedColor,setSelectedColor] = useState("black");
  const [selectedTool,setSelectedTool] = useState<toolsType>('pencil');

  function handleChangeSelectedColor(color : ColorResult){
    setSelectedColor(color.hex);
  }


  return (
    <main>
      <header className="header">
      </header>
      <section className = "MainSection">
      <div className = "editorWrapper">
          <div className="sideBar" style = {{height:CSS_CANVAS_SIZE}}>
          <div className = "toolbar">
            <div className = "toolbarButtons">

              <button className = "toolButton" style = {{backgroundColor: selectedTool === 'pencil' ? '#634cb8' : '#dddddd' }}  onClick={()=>setSelectedTool('pencil')}><FontAwesomeIcon size={"2x"} icon={faPencil} /></button>
              <button className = "toolButton" style = {{backgroundColor: selectedTool === 'eraser' ? '#634cb8' : '#dddddd' }}  onClick={()=>setSelectedTool('eraser')}><FontAwesomeIcon size={"2x"} icon={faEraser} /></button>
              <button className = "toolButton" style = {{backgroundColor: selectedTool === 'paintBucket' ? '#634cb8' : '#dddddd' }} onClick={()=>setSelectedTool('paintBucket')}><FontAwesomeIcon size={"2x"} icon={faFill} /></button>
            </div>
          </div>
          </div>
          <Editor selectedColor = {selectedColor} selectedTool = {selectedTool}></Editor>    
          <div className="sideBar" style = {{height:CSS_CANVAS_SIZE}}>
            <SketchPicker color = {selectedColor} onChangeComplete={handleChangeSelectedColor}></SketchPicker>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
