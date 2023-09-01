import { useCallback, useEffect, useRef } from 'react';
import { EventBus } from '../../EventBus';
import { StoreType, store } from '../../store';
import { drawOnSideBarCanvasType } from '../../types';
import {
  BG_COLORS,
  BG_TILE_SIZE,
  COPY_FRAME,
  CREATE_NEW_FRAME,
  DELETE_FRAME,
  DRAW_ON_SIDEBAR_CANVAS,
  SELECT_FRAME
} from '../../utils/constants';
import './frames.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleArrowDown,
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleArrowUp,
  faCopy,
  faPlus,
  faTrashCan
} from '@fortawesome/free-solid-svg-icons';

export function Frames({ isMobile }: { isMobile: boolean }) {
  // const layers = store((state : StoreType) => state.layers);
  const framesList = store((state: StoreType) => state.framesList);

  const displaySize = store((state: StoreType) => state.displaySize);

  const currentFrame = store((state: StoreType) => state.currentFrame);

  const framesDivRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (framesDivRef.current) {
      framesDivRef.current.addEventListener('wheel', (e) => {
        if (e.deltaY > 0) framesDivRef.current!.scrollLeft += 15;
        else framesDivRef.current!.scrollLeft -= 15;
      });
    }
  }, []);

  const drawFrameBackground = useCallback(
    (frame: string) => {
      const ctx = (document.getElementById(`${frame}background@sidebar`) as HTMLCanvasElement).getContext('2d')!;
      ctx.clearRect(0, 0, displaySize, displaySize);

      let firstInRow = 1;
      let a = firstInRow;

      for (let i = 0; i <= displaySize; i += BG_TILE_SIZE) {
        if (firstInRow) a = 0;
        else a = 1;
        firstInRow = firstInRow ? 0 : 1;
        for (let j = 0; j <= displaySize; j += BG_TILE_SIZE) {
          ctx.fillStyle = a ? BG_COLORS[0] : BG_COLORS[1];
          ctx.fillRect(i, j, BG_TILE_SIZE, BG_TILE_SIZE);
          a = a ? 0 : 1;
        }
      }
    },
    [displaySize]
  );

  const drawFrame = useCallback(
    (args: drawOnSideBarCanvasType) => {
      // console.log('updating ', args.frame, ' with ', args.pixelArray);
      const canvas = document.getElementById(`${args.frame}@sidebar`) as HTMLCanvasElement;
      if (!canvas) return;
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, displaySize, displaySize);

      ctx.putImageData(new ImageData(args.pixelArray, displaySize, displaySize), 0, 0);
    },
    [displaySize]
  );

  useEffect(() => {
    const DrawOnSideBarCanvassubscription = EventBus.getInstance().subscribe(DRAW_ON_SIDEBAR_CANVAS, drawFrame);

    return () => {
      DrawOnSideBarCanvassubscription.unsubscribe();
    };
  }, [drawFrame]);

  useEffect(() => {
    framesList.forEach((frame) => drawFrameBackground(frame));
  }, [drawFrameBackground, framesList]);

  function changeCurrentFrame(frame: string) {
    EventBus.getInstance().publish<string>(SELECT_FRAME, frame);
  }

  function createNewFrameHandler() {
    EventBus.getInstance().publish(CREATE_NEW_FRAME);

    setTimeout(() => {
      //scroll frames list to the bottom when new fram is added
      if (isMobile && framesDivRef.current) {
        framesDivRef.current.scrollTop = framesDivRef.current.scrollHeight;
        framesDivRef.current.scrollLeft = framesDivRef.current.scrollWidth;
      }
    }, 100);
  }

  function deleteFrame(frame: string) {
    EventBus.getInstance().publish(DELETE_FRAME, frame);
  }

  function copyFrame(frame: string) {
    EventBus.getInstance().publish(COPY_FRAME, frame);
  }

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ width: '100%', backgroundColor: '#494949' }}>
        <button className="frame-button" onClick={createNewFrameHandler}>
          <FontAwesomeIcon size="lg" color="white" icon={faPlus} />
          &nbsp; ADD FRAME
        </button>
        <button className="frame-button" onClick={() => copyFrame(currentFrame)}>
          <FontAwesomeIcon size="lg" color="white" icon={faCopy} />
          &nbsp; COPY FRAME
        </button>
        <button className="frame-button" onClick={() => deleteFrame(currentFrame)}>
          <FontAwesomeIcon size="lg" color="white" icon={faTrashCan} />
        </button>
        <button className="frame-button" onClick={createNewFrameHandler}>
          {isMobile ? (
            <FontAwesomeIcon size="lg" color="white" icon={faCircleArrowUp} />
          ) : (
            <FontAwesomeIcon size="lg" color="white" icon={faCircleArrowLeft} />
          )}
        </button>
        <button className="frame-button" onClick={createNewFrameHandler}>
          {isMobile ? (
            <FontAwesomeIcon size="lg" color="white" icon={faCircleArrowDown} />
          ) : (
            <FontAwesomeIcon size="lg" color="white" icon={faCircleArrowRight} />
          )}
        </button>
      </div>
      <div style={{ width: '100%', display: 'flex', height: '100%' }}>
        <div className="frames" ref={framesDivRef}>
          {framesList.map((frame, index) => (
            <div
              className="frame-wrapper"
              key={frame}
              style={{
                border: frame === currentFrame ? `5px solid #1e6ee7` : undefined
              }}>
              <div className="frame-canvas-wrapper" onClick={() => changeCurrentFrame(frame)}>
                <canvas
                  className="frame-canvas"
                  width={displaySize}
                  height={displaySize}
                  id={`${frame}@sidebar`}
                  style={{ zIndex: 1 }}></canvas>
                <canvas
                  className="frame-canvas"
                  width={displaySize}
                  height={displaySize}
                  id={`${frame}background@sidebar`}
                  style={{ zIndex: 0 }}></canvas>
                <div
                  className="frame-number"
                  style={{
                    backgroundColor: ' #1e6ee7'
                  }}>
                  {index + 1}
                </div>
              </div>
              {/* </div> */}
              {/* <div className="frame-options">
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ textAlign: 'right', fontSize: '12px' }}>#{index + 1}</div>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                  <div>
                    <button onClick={() => copyFrame(frame)}>
                      <FontAwesomeIcon size="xs" color="#abbbc7" icon={faClone} />
                    </button>
                  </div>
                  {framesList.length > 1 && (
                    <div>
                      <button onClick={() => deleteFrame(frame)}>
                        <FontAwesomeIcon size="xs" color="#abbbc7" icon={faTrashCan} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
