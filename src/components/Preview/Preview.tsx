import { ChangeEvent, useCallback, useEffect, useRef } from 'react';
import { BG_COLORS, BG_TILE_SIZE, ERASING, UPDATE_FRAMES_REF_ON_PREVIEW } from '../../utils/constants';
import './preview.scss';
import { Frame } from '../../types';
import { EventBus } from '../../EventBus';
import { StoreType, store } from '../../store';

export function Preview() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const previewInterval = useRef<number>(0);

  const displaySize = store((store: StoreType) => store.displaySize);

  const frameRate = store((store: StoreType) => store.frameRate);
  const setFrameRate = store((store: StoreType) => store.setFrameRate);

  const frameDuration = 1000 / frameRate;

  const currentIndex = useRef<number>(0);

  //pixel matrices are passed by reference
  const frames = useRef<Frame[]>([]);

  const redrawPreview = useCallback(() => {
    const ctx = canvas.current!.getContext('2d')!;

    if (!frames.current || !frames.current[currentIndex.current]) return;

    ctx.clearRect(0, 0, displaySize, displaySize);

    for (let i = 0; i < frames.current[currentIndex.current].scene.pixels.length; i++) {
      for (let j = 0; j < frames.current[currentIndex.current].scene.pixels[i].length; j++) {
        if (!frames.current[currentIndex.current].scene.pixels[i][j].colorStack.isEmpty()) {
          const color = frames.current[currentIndex.current].scene.pixels[i][j].colorStack.top();
          if (!color || color === ERASING) {
            ctx.fillStyle = frames.current[currentIndex.current].scene.pixels[i][j].bgColor;
            ctx.clearRect(
              frames.current[currentIndex.current].scene.pixels[i][j].x1,
              frames.current[currentIndex.current].scene.pixels[i][j].y1,
              1,
              1
            );
          } else {
            ctx.fillStyle = color;
            ctx.fillRect(
              frames.current[currentIndex.current].scene.pixels[i][j].x1,
              frames.current[currentIndex.current].scene.pixels[i][j].y1,
              1,
              1
            );
          }
        }
      }
    }
  }, [displaySize]);

  const startPreview = useCallback(() => {
    previewInterval.current = setInterval(() => {
      redrawPreview();
      currentIndex.current++;
      if (currentIndex.current >= frames.current.length) {
        currentIndex.current = 0;
      }
    }, frameDuration);
  }, [frameDuration, redrawPreview]);

  function finishPreview() {
    clearInterval(previewInterval.current);
  }

  const drawBackground = useCallback(() => {
    const ctx = (document.getElementById('previewBG') as HTMLCanvasElement).getContext('2d')!;

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
  }, [displaySize]);

  useEffect(() => {
    drawBackground();

    EventBus.getInstance().subscribe(UPDATE_FRAMES_REF_ON_PREVIEW, updateFramesOnPreview);

    startPreview();

    return () => {
      finishPreview();
    };
  }, [drawBackground, startPreview]);

  function updateFramesOnPreview(_frames: Frame[]) {
    frames.current = _frames;
  }

  return (
    <div className="preview">
      <div className="preview-title">PREVIEW</div>
      <div className="preview-canvas-wrapper">
        <canvas
          width={displaySize}
          ref={canvas}
          height={displaySize}
          className="preview-canvas"
          id="previewTop"
          style={{ width: '180px', height: '180px', zIndex: 1 }}></canvas>
        <canvas
          width={displaySize}
          height={displaySize}
          className="preview-canvas"
          id="previewBG"
          style={{ width: '180px', height: '180px', zIndex: 0 }}></canvas>
      </div>
      <div>
        <div style={{ width: '180px', margin: '0 auto', display: 'flex' }}>
          <div style={{ color: 'white', fontSize: '12px', width: '30%' }}>{frameRate} FPS</div>
          <div className="slider-wrapper">
            <div className="slider-range">
              <input
                className="slider"
                type="range"
                min={1}
                max={12}
                value={frameRate}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFrameRate(+e.target.value)}
                id="range"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
