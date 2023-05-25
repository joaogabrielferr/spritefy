import { ChangeEvent, useEffect, useRef } from "react";
import { Logo } from "../svg/Logo";
import '../styles/header.css';
import { Github } from "../svg/Github";

export function Header({isMobile} : {isMobile : boolean}){

    const drawingNameInput = useRef<HTMLInputElement | null>(null);
    const downloadButton = useRef<HTMLButtonElement | null>(null);


    useEffect(function(){

        if(drawingNameInput.current)drawingNameInput.current.value = "New Drawing*";
   
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


   function handleInputChange(event : ChangeEvent<HTMLInputElement>){
        if(event.target.value.trim() === "")drawingNameInput.current!.value = "New drawing";
        else drawingNameInput.current!.value = event.target.value;
   }


    return <header className="header">
                <div className="innerHeader">
                    <div style={{width: isMobile ? '20%' : '5%',height:'100%',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <Logo></Logo>
                        <a href="https://github.com/joaogabrielferr/pixel-art-editor" target="_blank"><Github></Github></a>
                    </div>
                    {!isMobile && <div style = {{fontWeight:'bold'}}>New drawing</div>}
                    {/* {!isMobile && <input className = "drawingNameInput" ref = {drawingNameInput} type="text" onChange={handleInputChange}/>} */}
                    <button ref = {downloadButton} className = "downloadButton">DOWNLOAD DRAWING</button>
                </div>
        </header>

}