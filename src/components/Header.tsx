import { useEffect, useRef } from "react";
import { Logo } from "../svg/Logo";
import './header.css';
import { Github } from "../svg/Github";
import { StoreType, store } from "../store";
import GIF from 'gif.js';


export function Header({isMobile} : {isMobile : boolean}){

    const downloadButton = useRef<HTMLButtonElement | null>(null);

    const framesList = store((store : StoreType) => store.framesList);

    const frameRate = store((store : StoreType) => store.frameRate);

    useEffect(function(){

        const refAux = downloadButton.current;

        function createGif(){
            //generate gif from frames

            //save all frame canvases as images
            const images : string[] = [];

            framesList.forEach((frame)=>{
                const canvas : HTMLCanvasElement | null = document.getElementById(`${frame}@sidebar`) as HTMLCanvasElement;
                if(canvas)
                {
                    images.push(canvas.toDataURL('image/png'));
                }
            });


            const gif = new GIF({
                workers: 2,
                workerScript: '/public/gif.worker.js',
            });



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
                    gif.addFrame(canvas, { delay: 1000/frameRate });

                    imagesProcessed++;

                    if(imagesProcessed === images.length)
                    {
                        gif.on('finished',(blob)=>{
                            
                            const link = document.createElement("a");
                            if(images.length === 1)
                            {
                                link.href = images[0];
                                link.download = "viewwit-drawing.png";
                                

                            }else
                            {
                                const url = URL.createObjectURL(blob);
                                link.href = url;
                                link.download = "animation.gif";
                                document.body.appendChild(link);

                            }

                            
                            link.dispatchEvent(
                                new MouseEvent('click', { 
                                bubbles: true, 
                                cancelable: true, 
                                view: window 
                                })
                            );
                            
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

   },[frameRate, framesList]);



    return <header className="header">
                <div className="innerHeader">
                    <div style={{width: isMobile ? '20%' : '80px',height:'90%',display:'flex',justifyContent: isMobile ? 'flex-start' : 'space-between',alignItems:'center'}}>
                        <a href="https://github.com/joaogabrielferr/pixel-art-editor" target="_blank"><Github></Github></a>
                    </div>
                    {!isMobile && <div style = {{fontWeight:'bold'}}><Logo></Logo></div>}
                    <button ref = {downloadButton} className = "downloadButton">SAVE DRAWING</button>
                </div>
        </header>

}