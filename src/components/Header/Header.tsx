import { useEffect, useRef } from 'react';
import './header.scss';
import { StoreType, store } from '../../store';
import GIF from 'gif.js';

export function Header({ isMobile }: { isMobile: boolean }) {
  const displaySize = store((store: StoreType) => store.displaySize);

  const downloadButton = useRef<HTMLButtonElement | null>(null);

  const framesList = store((store: StoreType) => store.framesList);

  const frameRate = store((store: StoreType) => store.frameRate);

  useEffect(
    function () {
      const refAux = downloadButton.current;

      //creates a sprite with 5 frames per row
      function createOutputImage() {
        const canvas = document.createElement('canvas');
        const width = displaySize * 5; //TODO: allow user to specify how many frames will be in a row
        const heigth = Math.ceil(framesList.length / 5) * displaySize;
        canvas.width = width;
        canvas.height = heigth;
        const ctx = canvas.getContext('2d');
        let destX = 0;
        let destY = 0;
        framesList.forEach((frame) => {
          ctx?.drawImage(document.getElementById(`${frame}@sidebar`)! as HTMLCanvasElement, destY, destX);
          if (destY + displaySize < displaySize * 5) {
            destY += displaySize;
          } else {
            destX += displaySize;
            destY = 0;
          }
        });
        document.body.appendChild(canvas);
        const img: string =
          framesList.length > 1
            ? canvas.toDataURL('image/png')
            : (document.getElementById(`${framesList[0]}@sidebar`) as HTMLCanvasElement).toDataURL('image/png');
        const link = document.createElement('a');
        link.href = img;
        link.download = 'spritefy-drawing.png';
        link.dispatchEvent(
          new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
          })
        );
      }

      //this lib has a problem when using images with transparent bg, search fow a new one
      // function createGif(){
      //     //generate gif from frames

      //     //save all frame canvases as images
      //     const images : string[] = [];

      //     framesList.forEach((frame)=>{
      //         const canvas : HTMLCanvasElement | null = document.getElementById(`${frame}@sidebar`) as HTMLCanvasElement;
      //         if(canvas)
      //         {
      //             images.push(canvas.toDataURL('image/png'));
      //         }
      //     });

      //     const gif = new GIF({
      //         workers: 2,
      //         workerScript: '/gif.worker.js',
      //         background: '#fff',
      //         transparent: '0x00FF00'
      //     });

      //     let imagesProcessed = 0;

      //     images.forEach((imageDataURL)=>{

      //         const image = new Image();
      //         image.src = imageDataURL;
      //         image.onload = () =>{
      //             const canvas = document.createElement('canvas');
      //             canvas.width = image.width;
      //             canvas.height = image.height;
      //             const ctx = canvas.getContext('2d')!;
      //             ctx.drawImage(image, 0, 0);
      //             gif.addFrame(canvas, { delay: 1000/frameRate });

      //             imagesProcessed++;

      //             if(imagesProcessed === images.length)
      //             {
      //                 gif.on('finished',(blob)=>{

      //                     const link = document.createElement("a");
      //                     if(images.length === 1)
      //                     {
      //                         link.href = images[0];
      //                         link.download = "spritefy-drawing.png";

      //                     }else
      //                     {
      //                         const url = URL.createObjectURL(blob);
      //                         link.href = url;
      //                         link.download = "animation.gif";

      //                     }

      //                     link.dispatchEvent(
      //                         new MouseEvent('click', {
      //                         bubbles: true,
      //                         cancelable: true,
      //                         view: window
      //                         })
      //                     );

      //                     document.body.removeChild(link);

      //                 });

      //                 gif.render();
      //             }

      //         }

      //     });

      // }

      if (downloadButton.current) {
        downloadButton.current.addEventListener('click', createOutputImage);
        //downloadButton.current.addEventListener("click",createGif);
      }

      return () => {
        refAux!.removeEventListener('click', createOutputImage);
        //refAux!.removeEventListener("click",createGif);
      };
    },
    [displaySize, frameRate, framesList]
  );

  return (
    <header className="header">
      <div className="inner-header">
        {!isMobile && <div style={{ fontWeight: 'bold' }}>SPRITEFY</div>}
        <button ref={downloadButton} className="download-button">
          SAVE DRAWING
        </button>
      </div>
    </header>
  );
}
