import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './topbar.scss';
import { faArrowRotateLeft, faBars, faBroom, faDownload, faFile, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { EventBus } from '../../EventBus';
import { CLEAR_DRAWING, REDO_LAST_DRAW, START_NEW_DRAWING, UNDO_LAST_DRAW } from '../../utils/constants';
import { store, StoreType } from '../../store';
import { createSpriteSheet } from '../../algorithms/createSpriteSheet';

export function Topbar({ isMobile }: { isMobile: boolean }) {
  const displaySize = store((store: StoreType) => store.displaySize);

  const framesList = store((store: StoreType) => store.framesList);

  const frameRate = store((store: StoreType) => store.frameRate);

  function downloadDrawing() {
    createSpriteSheet(displaySize, framesList);
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

  return (
    <div className="topbar">
      <div className="inner-topbar">
        {!isMobile ? (
          <nav className="topbar-nav">
            <button onClick={() => EventBus.getInstance().publish(START_NEW_DRAWING)}>
              <FontAwesomeIcon size="lg" color="white" icon={faFile} /> NEW DRAWING
            </button>
            <button onClick={() => EventBus.getInstance().publish(CLEAR_DRAWING)}>
              <FontAwesomeIcon size="lg" color="white" icon={faBroom} />
              CLEAR DRAWING
            </button>
            <button className="topbar-download" onClick={downloadDrawing}>
              <FontAwesomeIcon size="lg" color="#abbbc7" icon={faDownload} />
              SAVE DRAWING
            </button>
          </nav>
        ) : (
          <div>
            <FontAwesomeIcon size="2x" color="white" icon={faBars} />
          </div>
        )}
      </div>
    </div>
  );
}
