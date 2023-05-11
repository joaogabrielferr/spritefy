import {useState } from "react";
import Editor from "./Editor"
import {ColorResult, SketchPicker } from 'react-color'
import './styles/sideBar.css';
import './styles/index.css';
import { CSS_CANVAS_SIZE } from "./utils/constants";
import { Toolbar } from "./components/Toolbar";
import { PencilSVG } from "./icons/PencilSVG";


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
          <div className="sideBar" style = {{height:CSS_CANVAS_SIZE + 50}}>

          </div>
          <Editor selectedColor = {selectedColor}></Editor>    
          <div className="sideBar" style = {{height:CSS_CANVAS_SIZE + 50}}>
            <div>
              <button onClick={()=>setSelectedTool('pencil')}><PencilSVG/></button>
              <button onClick={()=>setSelectedTool('eraser')}></button>
              <button onClick={()=>setSelectedTool('paintBucket')}></button>

            </div>
            <SketchPicker color = {selectedColor} onChangeComplete={handleChangeSelectedColor}></SketchPicker>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
