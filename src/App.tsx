import {useState } from "react";
import Editor from "./Editor"
import {ColorResult, SketchPicker } from 'react-color'
import './styles/sideBar.css';
import './styles/index.css';
import { CSS_CANVAS_SIZE } from "./utils/constants";


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
          <div className="sideBar"></div>
          <Editor selectedColor = {selectedColor}></Editor>    
          <div className="sideBar">
            <SketchPicker color = {selectedColor} onChangeComplete={handleChangeSelectedColor}></SketchPicker>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
