import { useCallback, useEffect, useRef, useState } from 'react';
import { EventBus } from '../../EventBus';
import { StoreType, store } from '../../store';
import { Frame, drawOnSideBarCanvasType } from '../../types';
import {
  BG_COLORS,
  BG_TILE_SIZE,
  COPY_FRAME,
  CREATE_NEW_FRAME,
  DELETE_FRAME,
  DRAW_ON_SIDEBAR_CANVAS,
  SELECT_FRAME,
  SWAP_FRAMES
} from '../../utils/constants';
import './frames.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClone, faDownLong, faTrashCan, faUpLong } from '@fortawesome/free-solid-svg-icons';

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

      //draw background
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
    //const updateFramesOnFramesList = EventBus.getInstance().subscribe(UPDATE_FRAMES_REF_ON_FRAMES_LIST_BAR, updateFrames);

    return () => {
      DrawOnSideBarCanvassubscription.unsubscribe();
      //updateFramesOnFramesList.unsubscribe();
    };
  }, [drawFrame]);

  useEffect(() => {
    framesList.forEach((frame) => drawFrameBackground(frame));
  }, [drawFrameBackground, framesList]);

  // useEffect(() => {
  //   framesList.forEach((frame) => {
  //     if (!touched[frame]) {
  //       //drawing background when a new canvas is added
  //       setTouched({ ...touched, [frame]: true });
  //       drawFrameBackground(frame);
  //     }
  //   });
  // });

  // useEffect(() => {
  //   frames.current.forEach((frame) => {
  //     drawFrameBackground(frame.name);
  //     // drawFrame({ frame: frame.name, pixelMatrix: frame.scene.pixels });
  //   });
  // }, [displaySize, drawFrameBackground, drawFrame]);

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
    console.log(frame);
    EventBus.getInstance().publish(COPY_FRAME, frame);
  }

  function swapFrames(frame1: string, frame2: string) {
    EventBus.getInstance().publish(SWAP_FRAMES, { frame1, frame2 });
  }

  return (
    <>
      <div className="create-new-frame-wrapper">
        <button className="create-new-frame-button" onClick={createNewFrameHandler}>
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
            className="frame-wrapper"
            key={frame}
            style={{
              width: '95%',
              border: frame === currentFrame ? `2px solid #000000` : undefined
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
              {framesList.length > 1 && index != 0 && (
                <div className="move-frame-up">
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
                <div className="move-frame-down">
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
            <div className="frame-options">
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
