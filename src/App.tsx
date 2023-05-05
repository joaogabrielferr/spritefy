import { useState } from "react";
import Editor from "./Editor"

function App() {
  
  //add contexts, etc
  const [counter,setCounter] = useState(0);

  return (
    <>
      <Editor counter = {counter} onSetCounter = {()=>setCounter((prev)=>prev+1)}></Editor>    
    </>
  )
}

export default App
