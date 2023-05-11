import {useState } from "react";
import Editor from "./Editor"
import {ColorResult, SketchPicker } from 'react-color'
import './colorPicker.css';
import './global.css';




function App() {

  //add contexts, etc
  const [counter,] = useState(0);
  const [selectedColor,setSelectedColor] = useState("black");

  function handleChangeSelectedColor(color : ColorResult){
    setSelectedColor(color.hex);
  }


  return (
    <main className = "wrapper">
      <Editor counter = {counter} selectedColor = {selectedColor}></Editor>    
      <div className="colorPicker">
        {/* <h3>color palette</h3>
        <div className="colorPickerGrid">
          {
            colors.map((c)=> <button value = {c} style = {{width:'100%',height:'50px',backgroundColor:c}} key = {c} onClick={()=>handleChangeSelectedColor(c)}></button>)
          }
        </div> */}
        <SketchPicker color = {selectedColor} onChangeComplete={handleChangeSelectedColor}></SketchPicker>
      </div>
    </main>
  )
}

export default App
