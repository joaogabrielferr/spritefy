import { useCallback, useEffect, useRef, useState } from 'react';
import { EventBus } from '../EventBus';
import { StoreType, store } from '../store';
import { drawOnSideBarCanvasType } from '../types';
import {
  BG_COLORS,
  CANVAS_SIZE,
  COPY_FRAME,
  CREATE_NEW_FRAME,
  DELETE_FRAME,
  DRAW_ON_SIDEBAR_CANVAS,
  ERASING,
  SELECT_FRAME,
  SWAP_FRAMES
} from '../utils/constants';
import './frames.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClone, faDownLong, faTrashCan, faUpLong } from '@fortawesome/free-solid-svg-icons';

export function Frames() {
  // const layers = store((state : StoreType) => state.layers);
  const framesList = store((state: StoreType) => state.framesList);

  const [touched, setTouched] = useState<{ [frameName: string]: boolean }>({});

  const currentFrame = store((state: StoreType) => state.currentFrame);
  // const setCurrentFrame = store((state : StoreType) => state.setCurrentFrame);]

  const framesDivRef = useRef<HTMLDivElement | null>(null);

  let bgTileSize = 1;

  calculateBgTileSize();

  function calculateBgTileSize() {
    const factors = [];
    for (let i = 1; i <= CANVAS_SIZE; i++) {
      if (CANVAS_SIZE % i === 0) factors.push(i);
    }

    const mid = Math.floor(factors.length / 2);
    bgTileSize = factors[mid];

    //if CANVAS_SIZE is a prime number
    if (bgTileSize === CANVAS_SIZE) bgTileSize = 10;
  }

  function drawBackground(frame: string) {
    const ctx = (
      document.getElementById(`${frame}background@sidebar`) as HTMLCanvasElement
    ).getContext('2d')!;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    let firstInRow = 1;
    let a = firstInRow;

    //draw background
    for (let i = 0; i <= CANVAS_SIZE; i += bgTileSize) {
      if (firstInRow) a = 0;
      else a = 1;
      firstInRow = firstInRow ? 0 : 1;
      for (let j = 0; j <= CANVAS_SIZE; j += bgTileSize) {
        ctx.fillStyle = a ? BG_COLORS[0] : BG_COLORS[1];
        ctx.fillRect(i, j, bgTileSize, bgTileSize);
        a = a ? 0 : 1;
      }
    }
  }

  const drawOnCanvas = useCallback((args: drawOnSideBarCanvasType) => {
    const { frame, pixelMatrix } = args;

    if (!frame || !pixelMatrix) return;
    const canvas = document.getElementById(`${frame}@sidebar`) as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    for (let i = 0; i < pixelMatrix.length; i++) {
      for (let j = 0; j < pixelMatrix[i].length; j++) {
        if (!pixelMatrix[i][j].colorStack.isEmpty()) {
          const color = pixelMatrix[i][j].colorStack.top();
          if (!color || color === ERASING) {
            ctx.fillStyle = pixelMatrix[i][j].bgColor;
            ctx.clearRect(pixelMatrix[i][j].x1, pixelMatrix[i][j].y1, 1, 1);
          } else {
            ctx.fillStyle = color;
            ctx.fillRect(pixelMatrix[i][j].x1, pixelMatrix[i][j].y1, 1, 1);
          }
        }
      }
    }
  }, []);

  useEffect(() => {
    const subscription = EventBus.getInstance().subscribe(DRAW_ON_SIDEBAR_CANVAS, drawOnCanvas);

    return () => {
      subscription.unsubscribe();
    };
  }, [drawOnCanvas]);

  useEffect(() => {
    framesList.forEach((frame) => {
      if (!touched[frame]) {
        //drawing background when a new canvas is added
        setTouched({ ...touched, [frame]: true });
        drawBackground(frame);
      }
    });
  });

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

  function swapFrames(frame1: string, frame2: string) {
    EventBus.getInstance().publish(SWAP_FRAMES, { frame1, frame2 });
  }

  return (
    <>
      <div className="createNewFrameWrapper">
        <button className="createNewFrameButton" onClick={createNewFrameHandler}>
          ADD NEW FRAME
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-square-rounded-plus"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M9 12h6"></path>
            <path d="M12 9v6"></path>
            <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z"></path>
          </svg>
        </button>
      </div>
      <div className="frames" ref={framesDivRef}>
        {/* <div className="framesTitle">
            FRAMES
        </div> */}
        {framesList.map((frame, index) => (
          <div
            className="frameWrapper"
            key={frame}
            style={{
              width: '95%',
              border: frame === currentFrame ? `5px solid #000000` : undefined
            }}>
            <div className="frameCanvasWrapper" onClick={() => changeCurrentFrame(frame)}>
              <canvas
                className="frameCanvas"
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                id={`${frame}@sidebar`}
                style={{ zIndex: 1 }}></canvas>
              <canvas
                className="frameCanvas"
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                id={`${frame}background@sidebar`}
                style={{ zIndex: 0 }}></canvas>
              {framesList.length > 1 && index != 0 && (
                <div className="moveFrameUp">
                  <button
                    onClick={() => swapFrames(framesList[index - 1], frame)}
                    style={{
                      backgroundColor: 'transparent',
                      borderStyle: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      width: '100%',
                      height: '100%',
                      margin: '0 auto',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                    <FontAwesomeIcon size="lg" color="white" icon={faUpLong} />
                  </button>
                </div>
              )}
              {framesList.length > 1 && index != framesList.length - 1 && (
                <div className="moveFrameDown">
                  <button
                    onClick={() => swapFrames(frame, framesList[index + 1])}
                    style={{
                      backgroundColor: 'transparent',
                      borderStyle: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      width: '100%',
                      height: '100%',
                      margin: '0 auto',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                    <FontAwesomeIcon size="lg" color="white" icon={faDownLong} />
                  </button>
                </div>
              )}
            </div>
            <div className="frameOptions">
              <div style={{ textAlign: 'right', fontSize: '12px' }}>FRAME {index + 1}</div>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                <div>
                  <button onClick={() => copyFrame(frame)}>
                    <FontAwesomeIcon size="lg" color="#abbbc7" icon={faClone} />
                  </button>
                </div>
                {framesList.length > 1 && (
                  <div>
                    <button onClick={() => deleteFrame(frame)}>
                      <FontAwesomeIcon size="lg" color="#abbbc7" icon={faTrashCan} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
