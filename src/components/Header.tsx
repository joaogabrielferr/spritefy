import { ChangeEvent, useEffect, useRef } from "react";
import { Logo } from "../svg/Logo";
import './header.css';
import { Github } from "../svg/Github";
import { StoreType, store } from "../store";
import GIF from 'gif.js';


export function Header({isMobile} : {isMobile : boolean}){

    const downloadButton = useRef<HTMLButtonElement | null>(null);

    const framesList = store((store : StoreType) => store.framesList);


    useEffect(function(){

        const refAux = downloadButton.current;

        function createGif(){
            //generate gif from frames

            //save all frame canvases as images
            const images : string[] = [];

            console.log("getting imageurl from all canvases on sidebar");
            framesList.forEach((frame)=>{
                const canvas : HTMLCanvasElement | null = document.getElementById(`${frame}@sidebar`) as HTMLCanvasElement;
                if(canvas)
                {
                    images.push(canvas.toDataURL('image/png'));
                }
            })

            console.log("result:",images);

            const gif = new GIF({
                workers: 2,
                workerScript: '/public/gif.worker.js', 
            });

            console.log("add frames:");

            let imagesProcessed = 0;
            
            images.forEach((imageDataURL)=>{

                const image = new Image();
                image.src = imageDataURL;
                image.onload = () =>{

                    const canvas = document.createElement('canvas');
                    canvas.width = image.width;
                    canvas.height = image.height;
                    const ctx = canvas.getContext('2d')!;
                    ctx.drawImage(image, 0, 0);
                    gif.addFrame(canvas, { delay: 100 }); //TODO: Allow user to change the frame rate, currently hard coded in Preview.tsx
                    console.log("frame added");

                    imagesProcessed++;

                    if(imagesProcessed === images.length)
                    {
                        gif.on('finished',(blob)=>{
                            console.log("finish");
                            const url = URL.createObjectURL(blob);
                            
                            // Create a link element
                            const link = document.createElement("a");
            
                            // Set link's href to point to the Blob URL
                            link.href = url;
                            link.download = "animation.gif";
            
                            // Append link to the body
                            document.body.appendChild(link);
            
                            // Dispatch click event on the link
                            // This is necessary as link.click() does not work on the latest firefox
                            link.dispatchEvent(
                                new MouseEvent('click', { 
                                bubbles: true, 
                                cancelable: true, 
                                view: window 
                                })
                            );
            
                            // Remove link from body
                            document.body.removeChild(link);
            
                            
                        });
                        
                        gif.render();
                    }

                }

            });


        }

         if(downloadButton.current){
           downloadButton.current.addEventListener("click",createGif);
     }

    return ()=>{
        refAux!.removeEventListener("click",createGif);
    }

   },[framesList]);



    return <header className="header">
                <div className="innerHeader">
                    <div style={{width: isMobile ? '20%' : '80px',height:'90%',display:'flex',justifyContent: isMobile ? 'flex-start' : 'space-between',alignItems:'center'}}>
                        <a href="https://github.com/joaogabrielferr/pixel-art-editor" target="_blank"><Github></Github></a>
                    </div>
                    {!isMobile && <div style = {{fontWeight:'bold'}}><Logo></Logo></div>}
                    <button ref = {downloadButton} className = "downloadButton">DOWNLOAD DRAWING</button>
                </div>
        </header>

}