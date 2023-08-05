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
import { faAdd, faClone, faTrashCan } from '@fortawesome/free-solid-svg-icons';

export function Frames() {
  // const layers = store((state : StoreType) => state.layers);
  const framesList = store((state: StoreType) => state.framesList);

  const displaySize = store((state: StoreType) => state.displaySize);

  const currentFrame = store((state: StoreType) => state.currentFrame);

  const framesDivRef = useRef<HTMLDivElement | null>(null);

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
      if (framesDivRef.current) {
        framesDivRef.current.scrollTop = framesDivRef.current.scrollHeight;
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
    <>
      <div className="create-new-frame-wrapper">
        <button className="create-new-frame-button" onClick={createNewFrameHandler}>
          ADD NEW FRAME
          <FontAwesomeIcon size="sm" color="white" icon={faAdd} />
        </button>
      </div>

      <div className="frames" ref={framesDivRef}>
        <div className="frames-title">FRAMES</div>
        {framesList.map((frame, index) => (
          <div
            className="frame-wrapper"
            key={frame}
            style={{
              width: '95%',
              border: frame === currentFrame ? `2px solid #000000` : undefined
            }}>
            <div className="frame-clickable-area" onClick={() => changeCurrentFrame(frame)}>
              <div className="frame-canvas-wrapper">
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
              </div>
            </div>
            <div className="frame-options">
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ textAlign: 'right', fontSize: '12px' }}>FRAME {index + 1}</div>
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
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
