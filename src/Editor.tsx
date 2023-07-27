import { useEffect, useRef, WheelEvent, MouseEvent, TouchEvent, Touch, useCallback } from 'react';
import './editor.scss';
import {
  MAX_ZOOM_AMOUNT,
  BG_COLORS,
  SCALE_FACTOR,
  RESET_CANVAS_POSITION,
  DRAW_ON_SIDEBAR_CANVAS,
  CREATE_NEW_FRAME,
  SELECT_FRAME,
  DELETE_FRAME,
  UPDATE_FRAMES_REF_ON_PREVIEW,
  COPY_FRAME,
  ERASING,
  SWAP_FRAMES,
  UNDO_LAST_DRAW,
  REDO_LAST_DRAW,
  EDITOR_SIZE_OFFSET,
  EDITOR_SIZE_OFFSET_MOBILE,
  UPDATE_FRAMES_REF_ON_FRAMES_LIST_BAR,
  BG_TILE_SIZE
} from './utils/constants';
import Mouse from './scene/Mouse';
import Scene from './scene/Scene';
import { Pencil } from './Tools/Pencil';
import { Eraser } from './Tools/Eraser';
import { redoLastDraw, undoLastDraw } from './Tools/UndoRedo';
import { PaintBucket } from './Tools/PaintBucket';
import { Dropper } from './Tools/Dropper';
import { Line } from './Tools/Line';
import { Frame, Pixel, drawOnSideBarCanvasType } from './types';
import { removeDraw } from './helpers/RemoveDraw';
import { cleanDraw } from './helpers/CleanDraw';
import { translateDrawToMainCanvas } from './helpers/TranslateDrawToMainCanvas';
import { Rectangle } from './Tools/Rectangle';
import { Elipse } from './Tools/Elipse';
import { EventBus } from './EventBus';
import { store, StoreType } from './store';
import { Stack } from './utils/Stack';

interface IEditor {
  cssCanvasSize: number;
  isMobile: boolean;
}

//////////////////////////////////////////////////////////

let canvas: HTMLCanvasElement, topCanvas: HTMLCanvasElement, backgroundCanvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D, topCtx: CanvasRenderingContext2D, bgCtx: CanvasRenderingContext2D;

let outerDiv: HTMLDivElement;

const mouse = new Mouse();

let pixel_size: number;

let currentScale = 1;

let coordinatesElement: HTMLSpanElement;

let originalCanvasWidth: number;

let touchStartDistance: number;

let isPinching = false;

let pinchTouchStartTimeOut: number | undefined = undefined;

let currentFrameIndex = 0;

//////////////////////////////////////////////////////////

export default function Editor({ cssCanvasSize, isMobile }: IEditor): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const topCanvasRef = useRef<HTMLCanvasElement>(null);
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);

  //persisting frames between re renders
  //updating frames doesnt generate re renders
  const frames = useRef<Frame[]>([
    //framesList is initialized with ['frame1']
    {
      name: 'frame1',
      scene: new Scene(),
      undoStack: new Stack<Uint8ClampedArray>(),
      redoStack: new Stack<Uint8ClampedArray>()
      // undoStack: new Stack<Pixel[][]>(),
      // redoStack: new Stack<[Pixel, string | undefined][]>()
    }
  ]);

  const displaySize = store((state: StoreType) => state.displaySize);

  const selectedColor = store((state: StoreType) => state.selectedColor);
  const setSelectedColor = store((state: StoreType) => state.setSelectedColor);
  const selectedTool = store((state: StoreType) => state.selectedTool);
  const penSize = store((state: StoreType) => state.penSize);
  const oneToOneRatioElipse = store((state: StoreType) => state.oneToOneRatioElipse);
  const xMirror = store((state: StoreType) => state.xMirror);
  const yMirror = store((state: StoreType) => state.yMirror);
  const erasingRightButton = store((state: StoreType) => state.erasingRightButton);

  const framesList = store((state: StoreType) => state.framesList);
  const setFramesList = store((state: StoreType) => state.setFramesList);

  const currentFrame = store((state: StoreType) => state.currentFrame);
  const setCurrentFrame = store((state: StoreType) => state.setCurrentFrame);

  const outerDivRef = useRef<HTMLDivElement>(null); //div that wraps all canvases

  const latestFrameCreated = useRef('');

  const shouldUpdateSideBarCanvas = useRef(false);

  const draw = useCallback(
    (drawBackground?: boolean) => {
      let firstInRow = 1;
      let a = firstInRow;
      //draw background
      if (drawBackground) {
        for (let i = 0; i <= displaySize; i += pixel_size * BG_TILE_SIZE) {
          if (firstInRow) a = 0;
          else a = 1;
          firstInRow = firstInRow ? 0 : 1;
          for (let j = 0; j <= displaySize; j += pixel_size * BG_TILE_SIZE) {
            bgCtx.fillStyle = a ? BG_COLORS[0] : BG_COLORS[1];
            bgCtx.fillRect(i, j, pixel_size * BG_TILE_SIZE, pixel_size * BG_TILE_SIZE);
            a = a ? 0 : 1;
          }
        }
      }

      // ctx.clearRect(0, 0, displaySize, displaySize);

      // //draw pixel matrix
      // for (let i = 0; i < frames.current[currentFrameIndex].scene.pixels.length; i++) {
      //   for (let j = 0; j < frames.current[currentFrameIndex].scene.pixels[i].length; j++) {
      //     if (!frames.current[currentFrameIndex].scene.pixels[i][j].colorStack.isEmpty()) {
      //       const color = frames.current[currentFrameIndex].scene.pixels[i][j].colorStack.top();
      //       if (!color || color === ERASING) {
      //         ctx.fillStyle = frames.current[currentFrameIndex].scene.pixels[i][j].bgColor;
      //         ctx.fillRect(
      //           frames.current[currentFrameIndex].scene.pixels[i][j].x1,
      //           frames.current[currentFrameIndex].scene.pixels[i][j].y1,
      //           1,
      //           1
      //         );
      //       } else {
      //         ctx.fillStyle = color;
      //         ctx.fillRect(
      //           frames.current[currentFrameIndex].scene.pixels[i][j].x1,
      //           frames.current[currentFrameIndex].scene.pixels[i][j].y1,
      //           1,
      //           1
      //         );
      //       }
      //     }
      //   }
      // }
    },
    [displaySize]
  );

  useEffect(() => {
    pixel_size = 1;

    outerDiv = outerDivRef.current!;

    canvas = canvasRef.current!;
    topCanvas = topCanvasRef.current!;
    backgroundCanvas = backgroundCanvasRef.current!;

    ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    topCtx = topCanvas.getContext('2d', { willReadFrequently: true })!;
    bgCtx = backgroundCanvas.getContext('2d')!;

    canvas.width = displaySize;
    canvas.height = displaySize;

    topCanvas.width = displaySize;
    topCanvas.height = displaySize;

    backgroundCanvas.width = displaySize;
    backgroundCanvas.height = displaySize;

    //TODO: if i decide to add option to edit display size for a draw, create function that updates pixel matrix for all frames and use it here
    frames.current[currentFrameIndex].scene.initializePixelMatrix(displaySize, pixel_size);

    //update frames ref on frames component in sidebar
    EventBus.getInstance().publish<Frame[]>(UPDATE_FRAMES_REF_ON_FRAMES_LIST_BAR, frames.current);

    draw(true);
  }, [displaySize, draw]);

  useEffect(() => {
    if (isMobile) {
      canvas.style.width = `${cssCanvasSize - EDITOR_SIZE_OFFSET_MOBILE}px`;
      canvas.style.height = `${cssCanvasSize - EDITOR_SIZE_OFFSET_MOBILE}px`;

      topCanvas.style.width = `${cssCanvasSize - EDITOR_SIZE_OFFSET_MOBILE}px`;
      topCanvas.style.height = `${cssCanvasSize - EDITOR_SIZE_OFFSET_MOBILE}px`;

      backgroundCanvas.style.width = `${cssCanvasSize - EDITOR_SIZE_OFFSET_MOBILE}px`;
      backgroundCanvas.style.height = `${cssCanvasSize - EDITOR_SIZE_OFFSET_MOBILE}px`;

      originalCanvasWidth = cssCanvasSize - EDITOR_SIZE_OFFSET_MOBILE;
    } else {
      canvas.style.width = `${cssCanvasSize - EDITOR_SIZE_OFFSET}px`;
      canvas.style.height = `${cssCanvasSize - EDITOR_SIZE_OFFSET}px`;

      topCanvas.style.width = `${cssCanvasSize - EDITOR_SIZE_OFFSET}px`;
      topCanvas.style.height = `${cssCanvasSize - EDITOR_SIZE_OFFSET}px`;

      backgroundCanvas.style.width = `${cssCanvasSize - EDITOR_SIZE_OFFSET}px`;
      backgroundCanvas.style.height = `${cssCanvasSize - EDITOR_SIZE_OFFSET}px`;

      originalCanvasWidth = cssCanvasSize - EDITOR_SIZE_OFFSET;
    }

    coordinatesElement = document.getElementById('coordinates') as HTMLSpanElement;

    resetCanvasPosition();
  }, [cssCanvasSize, isMobile]);

  // function handleLayersRef(layerName : string)
  // {
  //     return function(element : HTMLCanvasElement)
  //     {
  //         layersRef.current![layerName] = element;
  //     }
  // }

  ///////////////////////////////////////////////////////////////////////////////////////////////
  const addNewFrame = useCallback(() => {
    const newFrame = createNewFrame();

    frames.current.push(newFrame);

    currentFrameIndex = frames.current.length - 1;

    frames.current[currentFrameIndex].scene.initializePixelMatrix(displaySize, pixel_size);

    //update frames ref on preview component
    EventBus.getInstance().publish<Frame[]>(UPDATE_FRAMES_REF_ON_PREVIEW, frames.current);

    setCurrentFrame(newFrame.name);

    setFramesList([...framesList, newFrame.name]);

    resetCanvasPosition();

    draw();
  }, [displaySize, draw, framesList, setCurrentFrame, setFramesList]);

  ///////////////////////////////////////////////////////////////////////////////////////////////

  const selectFrame = useCallback(
    (_frame: string) => {
      currentFrameIndex = frames.current.findIndex((frame) => frame.name === _frame);

      resetCanvasPosition();

      setCurrentFrame(_frame);
    },
    [setCurrentFrame]
  );

  ///////////////////////////////////////////////////////////////////////////////////////////////

  const deleteFrame = useCallback(
    (_frame: string) => {
      const newFramesList = framesList.filter((frame) => frame !== _frame);

      const frameToRemoveIndex = frames.current.findIndex((frame) => frame.name === _frame);

      frames.current.splice(frameToRemoveIndex, 1);

      if (currentFrameIndex === frameToRemoveIndex) {
        currentFrameIndex = 0;
        setCurrentFrame(frames.current[currentFrameIndex].name);
      } else if (currentFrameIndex > frameToRemoveIndex) {
        currentFrameIndex = frames.current.length - 1;
        setCurrentFrame(frames.current[frames.current.length - 1].name);
      }

      setFramesList(newFramesList);

      //update frames ref on preview component
      EventBus.getInstance().publish<Frame[]>(UPDATE_FRAMES_REF_ON_PREVIEW, frames.current);
    },
    [framesList, setCurrentFrame, setFramesList]
  );

  ///////////////////////////////////////////////////////////////////////////////////////////////

  const copyFrame = useCallback(
    (_frame: string) => {
      const newFrame = createNewFrame();

      latestFrameCreated.current = newFrame.name;

      //true only when copiyng a frame
      shouldUpdateSideBarCanvas.current = true;

      const frameCopiedIndex = frames.current.findIndex((frame) => frame.name === _frame);

      if (frameCopiedIndex < 0) return;

      frames.current.splice(frameCopiedIndex + 1, 0, newFrame);
      const newFrameIndex = frames.current.findIndex((frame) => frame.name === newFrame.name);

      frames.current[newFrameIndex].scene.copyPixelMatrix(frames.current[frameCopiedIndex].scene.pixels);

      if (newFrameIndex === frames.current.length - 1) {
        setFramesList([...framesList, newFrame.name]);
      } else {
        const newFramesList = [...framesList];
        newFramesList.splice(frameCopiedIndex + 1, 0, newFrame.name);
        setFramesList(newFramesList);
      }

      setCurrentFrame(newFrame.name);

      currentFrameIndex = newFrameIndex;

      resetCanvasPosition();

      draw();

      //update frames ref on preview component
      EventBus.getInstance().publish<Frame[]>(UPDATE_FRAMES_REF_ON_PREVIEW, frames.current);
    },
    [draw, framesList, setCurrentFrame, setFramesList]
  );

  ///////////////////////////////////////////////////////////////////////////////////////////////

  function updateSideBarCanvasAfterChangingFramesList(frameName: string) {
    if (!shouldUpdateSideBarCanvas.current || frameName === '' || frameName.length <= 1) return;

    const frameIndex = frames.current.findIndex((frame) => frame.name === frameName);

    // EventBus.getInstance().publish<drawOnSideBarCanvasType>(DRAW_ON_SIDEBAR_CANVAS, {
    //   frame: frameName,
    //   pixelMatrix: frames.current[frameIndex].scene.pixels,
    //   frames: frames.current
    // });

    //true only when copiyng a frame
    shouldUpdateSideBarCanvas.current = false;
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////

  const swapFrames = useCallback(
    ({ frame1, frame2 }: { frame1: string; frame2: string }) => {
      let frame1index = frames.current.findIndex((frame) => frame.name === frame1);
      let frame2index = frames.current.findIndex((frame) => frame.name === frame2);

      if (frame1index < 0 || frame2index < 0) return;

      const aux = frames.current[frame1index];
      frames.current[frame1index] = frames.current[frame2index];
      frames.current[frame2index] = aux;

      const newFramesList = [...framesList];

      frame1index = framesList.findIndex((frame) => frame === frame1);
      frame2index = framesList.findIndex((frame) => frame === frame2);

      const aux2 = newFramesList[frame1index];
      newFramesList[frame1index] = newFramesList[frame2index];
      newFramesList[frame2index] = aux2;

      EventBus.getInstance().publish<Frame[]>(UPDATE_FRAMES_REF_ON_PREVIEW, frames.current);

      setFramesList(newFramesList);
    },
    [framesList, setFramesList]
  );

  ///////////////////////////////////////////////////////////////////////////////////////////////

  const handleUndoLastDraw = useCallback(() => {
    undoLastDraw(pixel_size, ctx, frames.current[currentFrameIndex], displaySize);

    // EventBus.getInstance().publish<drawOnSideBarCanvasType>(DRAW_ON_SIDEBAR_CANVAS, {
    //   frame: currentFrame,
    //   pixelMatrix: frames.current[currentFrameIndex].scene.pixels,
    //   frames: frames.current
    // });

    EventBus.getInstance().publish<Frame[]>(UPDATE_FRAMES_REF_ON_PREVIEW, frames.current);
  }, [displaySize]);

  ///////////////////////////////////////////////////////////////////////////////////////////////

  const handleRedoLastDraw = useCallback(() => {
    redoLastDraw(ctx, pixel_size, frames.current[currentFrameIndex], displaySize);
    // EventBus.getInstance().publish<drawOnSideBarCanvasType>(DRAW_ON_SIDEBAR_CANVAS, {
    //   frame: currentFrame,
    //   pixelMatrix: frames.current[currentFrameIndex].scene.pixels,
    //   frames: frames.current
    // });

    EventBus.getInstance().publish<Frame[]>(UPDATE_FRAMES_REF_ON_PREVIEW, frames.current);
  }, [displaySize]);

  ///////////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    const resetCanvasSubscription = EventBus.getInstance().subscribe(RESET_CANVAS_POSITION, resetCanvasPosition);
    const selectFrameSubscription = EventBus.getInstance().subscribe(SELECT_FRAME, selectFrame);
    const createNewFrameSubscription = EventBus.getInstance().subscribe(CREATE_NEW_FRAME, addNewFrame);
    const deleteFrameSubscription = EventBus.getInstance().subscribe(DELETE_FRAME, deleteFrame);
    const copyFrameSubscription = EventBus.getInstance().subscribe(COPY_FRAME, copyFrame);
    const swapFramesSubscription = EventBus.getInstance().subscribe(SWAP_FRAMES, swapFrames);
    const handleUndoLastDrawSubscription = EventBus.getInstance().subscribe(UNDO_LAST_DRAW, handleUndoLastDraw);
    const handleRedoLastDrawSubscription = EventBus.getInstance().subscribe(REDO_LAST_DRAW, handleRedoLastDraw);

    function checkKeyCombinations(event: KeyboardEvent) {
      if (event.ctrlKey && event.code === 'KeyZ') {
        handleUndoLastDraw();
      } else if (event.ctrlKey && event.code === 'KeyY') {
        handleRedoLastDraw();
      } else if (event.ctrlKey && event.code === 'Space') {
        resetCanvasPosition();
      }
    }

    document.addEventListener('keydown', checkKeyCombinations);

    return () => {
      resetCanvasSubscription.unsubscribe();
      selectFrameSubscription.unsubscribe();
      createNewFrameSubscription.unsubscribe();
      deleteFrameSubscription.unsubscribe();
      copyFrameSubscription.unsubscribe();
      swapFramesSubscription.unsubscribe();
      handleUndoLastDrawSubscription.unsubscribe();
      handleRedoLastDrawSubscription.unsubscribe();
      document.removeEventListener('keydown', checkKeyCombinations);
    };
  }, [addNewFrame, copyFrame, currentFrame, deleteFrame, handleRedoLastDraw, handleUndoLastDraw, selectFrame, swapFrames, draw]);

  useEffect(() => {
    //updating sidebar canvas when a new frame is copied, putting it here so that i can garantee that it only updates after framesList changes
    //in other situations where sidebar canvas is updated (frame created, deleted, or draw finished) this is not necessary
    updateSideBarCanvasAfterChangingFramesList(latestFrameCreated.current);
  }, [framesList]);

  ///////////////////////////////////////////////////////////////////////////////////////////////

  function handleFirstClick(event: MouseEvent) {
    if (event.button === 0) {
      mouse.isLeftButtonClicked = true;
      mouse.isRightButtonClicked = false;
    } else if (event.button === 2) {
      mouse.isRightButtonClicked = true;
      mouse.isLeftButtonClicked = false;
    }
    mouse.isPressed = true;
    if (selectedTool === 'pencil' && (mouse.isLeftButtonClicked || (mouse.isRightButtonClicked && !erasingRightButton))) {
      Pencil(
        'mousedown',
        frames.current[currentFrameIndex].scene,
        mouse,
        pixel_size,
        displaySize,
        ctx,
        penSize,
        selectedColor,
        xMirror,
        yMirror
      );
    } else if (selectedTool === 'eraser' && (mouse.isLeftButtonClicked || (mouse.isRightButtonClicked && erasingRightButton))) {
      Eraser('mousedown', mouse, frames.current[currentFrameIndex].scene, pixel_size, displaySize, ctx, penSize);
    } else if (
      selectedTool === 'paintBucket' &&
      (mouse.isLeftButtonClicked || (mouse.isRightButtonClicked && !erasingRightButton))
    ) {
      PaintBucket(
        frames.current[currentFrameIndex].scene,
        mouse,
        pixel_size,
        displaySize,
        ctx,
        penSize,
        displaySize,
        selectedColor
      );
    } else if (selectedTool === 'dropper' && (mouse.isLeftButtonClicked || (mouse.isRightButtonClicked && !erasingRightButton))) {
      const color: string | undefined | null = Dropper(frames.current[currentFrameIndex].scene, mouse, pixel_size, displaySize);
      if (color) setSelectedColor(color);
    } else if (
      (selectedTool === 'line' || selectedTool === 'rectangle' || selectedTool === 'elipse') &&
      (mouse.isLeftButtonClicked || (mouse.isRightButtonClicked && !erasingRightButton))
    ) {
      frames.current[currentFrameIndex].scene.lineFirstPixel = { x: Math.floor(mouse.x), y: Math.floor(mouse.y) };
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////

  function getTouchDistanceBetweenTwoTouches(touch1: Touch, touch2: Touch) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////

  function handleTouchStart(e: TouchEvent) {
    //in some mobile devices, when pinching, the touchstart listener is called with e.touches.length === 1, and only then it is called again with e.touches.length === 2
    clearTimeout(pinchTouchStartTimeOut);
    pinchTouchStartTimeOut = setTimeout(() => {
      if (e.touches.length === 2) {
        isPinching = true;
      }

      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        touchStartDistance = getTouchDistanceBetweenTwoTouches(touch1, touch2);
      } else if (!isPinching) {
        const bounding = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - bounding.left;
        mouse.y = e.touches[0].clientY - bounding.top;

        const canvasWidth = parseFloat(canvas.style.width);
        const canvasHeight = parseFloat(canvas.style.height);

        const offsetX = (canvasWidth - canvas.offsetWidth) / 2; // Calculate the X-axis offset due to scaling
        const offsetY = (canvasHeight - canvas.offsetHeight) / 2; // Calculate the Y-axis offset due to scaling

        mouse.x = (mouse.x - offsetX) * (displaySize / canvasWidth); // Transform the mouse X-coordinate to canvas coordinate system taking into consideration the zooming and panning
        mouse.y = (mouse.y - offsetY) * (displaySize / canvasHeight); // Transform the mouse Y-coordinate to canvas

        mouse.isPressed = true;

        if (selectedTool === 'pencil') {
          Pencil(
            'mousedown',
            frames.current[currentFrameIndex].scene,
            mouse,
            pixel_size,
            displaySize,
            ctx,
            penSize,
            selectedColor,
            xMirror,
            yMirror
          );
        } else if (selectedTool === 'eraser') {
          Eraser('mousedown', mouse, frames.current[currentFrameIndex].scene, pixel_size, displaySize, ctx, penSize);
        } else if (selectedTool === 'paintBucket') {
          PaintBucket(
            frames.current[currentFrameIndex].scene,
            mouse,
            pixel_size,
            displaySize,
            ctx,
            penSize,
            displaySize,
            selectedColor
          );
        } else if (selectedTool === 'dropper') {
          const color: string | undefined | null = Dropper(
            frames.current[currentFrameIndex].scene,
            mouse,
            pixel_size,
            displaySize
          );
          if (color) setSelectedColor(color);
        } else if (selectedTool === 'line' || selectedTool === 'rectangle' || selectedTool === 'elipse') {
          frames.current[currentFrameIndex].scene.lineFirstPixel = { x: Math.floor(mouse.x), y: Math.floor(mouse.y) };
        }
      }
    }, 100);
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////

  function mouseToWorldCoordinates(clientX: number, clientY: number) {
    const bounding = canvas.getBoundingClientRect();
    mouse.x = clientX - bounding.left;
    mouse.y = clientY - bounding.top;

    const canvasWidth = parseFloat(canvas.style.width);
    const canvasHeight = parseFloat(canvas.style.height);

    const offsetX = (canvasWidth - canvas.offsetWidth) / 2; // Calculate the X-axis offset due to scaling
    const offsetY = (canvasHeight - canvas.offsetHeight) / 2; // Calculate the Y-axis offset due to scaling

    mouse.x = (mouse.x - offsetX) * (displaySize / canvasWidth); // Transform the mouse X-coordinate to canvas coordinate system taking into consideration the zooming and panning
    mouse.y = (mouse.y - offsetY) * (displaySize / canvasHeight); // Transform the mouse Y-coordinate to canvas coordinate system taking into consideration the zooming and panning
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////

  function handleMouseMove(event: MouseEvent) {
    window.requestAnimationFrame(() => {
      if (!canvas) return;
      mouseToWorldCoordinates(event.clientX, event.clientY);

      if (coordinatesElement && mouse.x >= 0 && mouse.x <= displaySize && mouse.y >= 0 && mouse.y <= displaySize) {
        coordinatesElement.innerHTML = `[X:${Math.floor(mouse.x) + 1},Y:${Math.floor(mouse.y) + 1}]`;
      }

      if (!(mouse.x >= 0 && mouse.x <= displaySize && mouse.y >= 0 && mouse.y <= displaySize)) {
        //out of canvas
        frames.current[currentFrameIndex].scene.lastPixel = null;
        frames.current[currentFrameIndex].scene.lastPixelXMirror = null;
        frames.current[currentFrameIndex].scene.lastPixelYMirror = null;
        frames.current[currentFrameIndex].scene.lastPixelXYMirror = null;
        if (frames.current[currentFrameIndex].scene.previousPixelWhileMovingMouse) {
          topCtx.clearRect(
            frames.current[currentFrameIndex].scene.previousPixelWhileMovingMouse!.x,
            frames.current[currentFrameIndex].scene.previousPixelWhileMovingMouse!.y,
            pixel_size,
            pixel_size
          );

          for (let n of frames.current[currentFrameIndex].scene.previousNeighborsWhileMovingMouse) {
            topCtx.clearRect(n.x, n.y, pixel_size, pixel_size);
          }
        }
        return;
      }
      if (
        (selectedTool === 'eraser' && (mouse.isLeftButtonClicked || (mouse.isRightButtonClicked && erasingRightButton))) ||
        (selectedTool !== 'eraser' && mouse.isRightButtonClicked && erasingRightButton)
      ) {
        Eraser('mousemove', mouse, frames.current[currentFrameIndex].scene, pixel_size, displaySize, ctx, penSize);
      } else if (
        selectedTool === 'pencil' &&
        (mouse.isLeftButtonClicked || (mouse.isRightButtonClicked && !erasingRightButton))
      ) {
        Pencil(
          'mousedown',
          frames.current[currentFrameIndex].scene,
          mouse,
          pixel_size,
          displaySize,
          ctx,
          penSize,
          selectedColor,
          xMirror,
          yMirror
        );
      } else if (selectedTool === 'line' && (mouse.isLeftButtonClicked || (mouse.isRightButtonClicked && !erasingRightButton))) {
        topCtx.clearRect(0, 0, displaySize, displaySize);
        frames.current[currentFrameIndex].scene.currentPixelsMousePressed = new Map();
        Line(
          frames.current[currentFrameIndex].scene,
          topCtx,
          mouse,
          pixel_size,
          frames.current[currentFrameIndex].scene.lineFirstPixel!,
          selectedColor,
          penSize,
          displaySize
        );
      } else if (
        selectedTool === 'rectangle' &&
        (mouse.isLeftButtonClicked || (mouse.isRightButtonClicked && !erasingRightButton))
      ) {
        //remove draw from the top canvas
        topCtx.clearRect(0, 0, displaySize, displaySize);
        Rectangle(
          frames.current[currentFrameIndex].scene,
          topCtx,
          mouse,
          pixel_size,
          frames.current[currentFrameIndex].scene.lineFirstPixel!,
          selectedColor,
          penSize,
          displaySize
        );
      } else if (
        selectedTool === 'elipse' &&
        (mouse.isLeftButtonClicked || (mouse.isRightButtonClicked && !erasingRightButton))
      ) {
        //remove draw from the top canvas

        topCtx.clearRect(0, 0, displaySize, displaySize);
        console.log('cleared');
        if (frames.current[currentFrameIndex].scene.lineFirstPixel) {
          const majorRadius = Math.abs(frames.current[currentFrameIndex].scene.lineFirstPixel!.x - mouse.x);
          const minorRadius = Math.abs(frames.current[currentFrameIndex].scene.lineFirstPixel!.y - mouse.y);

          if (oneToOneRatioElipse) {
            Elipse(
              frames.current[currentFrameIndex].scene,
              topCtx,
              pixel_size,
              frames.current[currentFrameIndex].scene.lineFirstPixel!,
              selectedColor,
              penSize,
              majorRadius,
              majorRadius,
              displaySize
            );
          } else {
            Elipse(
              frames.current[currentFrameIndex].scene,
              topCtx,
              pixel_size,
              frames.current[currentFrameIndex].scene.lineFirstPixel!,
              selectedColor,
              penSize,
              majorRadius,
              minorRadius,
              displaySize
            );
          }
        }
      }

      //paint pixel in top canvas relative to mouse position
      paintMousePosition();

      mouse.mouseMoveLastPos = { x: mouse.x, y: mouse.y };
    });
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////

  function handleTouchMove(event: TouchEvent) {
    if (!canvas) return;

    if (event.touches.length === 2) {
      handleZoomMobile(event);
      return;
    }

    const bounding = canvas.getBoundingClientRect();
    mouse.x = event.touches[0].clientX - bounding.left;
    mouse.y = event.touches[0].clientY - bounding.top;

    const canvasWidth = parseFloat(canvas.style.width);
    const canvasHeight = parseFloat(canvas.style.height);

    const offsetX = (canvasWidth - canvas.offsetWidth) / 2; // Calculate the X-axis offset due to scaling
    const offsetY = (canvasHeight - canvas.offsetHeight) / 2; // Calculate the Y-axis offset due to scaling

    mouse.x = (mouse.x - offsetX) * (displaySize / canvasWidth); // Transform the mouse X-coordinate to canvas coordinate system taking into consideration the zooming and panning
    mouse.y = (mouse.y - offsetY) * (displaySize / canvasHeight); // Transform the mouse Y-coordinate to canvas coordinate system taking into consideration the zooming and panning

    if (coordinatesElement && mouse.x >= 0 && mouse.x <= displaySize && mouse.y >= 0 && mouse.y <= displaySize) {
      coordinatesElement.innerHTML = `[X:${Math.floor(mouse.x) + 1},Y:${Math.floor(mouse.y) + 1}]`;
    }

    if (!(mouse.x >= 0 && mouse.x <= displaySize && mouse.y >= 0 && mouse.y <= displaySize)) {
      //out of canvas
      frames.current[currentFrameIndex].scene.lastPixel = null;
      frames.current[currentFrameIndex].scene.lastPixelXMirror = null;
      frames.current[currentFrameIndex].scene.lastPixelYMirror = null;
      frames.current[currentFrameIndex].scene.lastPixelXYMirror = null;
      if (frames.current[currentFrameIndex].scene.previousPixelWhileMovingMouse) {
        // removeDraw(
        //   topCtx,
        //   [
        //     frames.current[currentFrameIndex].scene.previousPixelWhileMovingMouse!,
        //     ...frames.current[currentFrameIndex].scene.previousNeighborsWhileMovingMouse
        //   ],
        //   pixel_size
        // );
      }
      return;
    }

    if (selectedTool === 'pencil' && mouse.isPressed) {
      Pencil(
        'mousemove',
        frames.current[currentFrameIndex].scene,
        mouse,
        pixel_size,
        displaySize,
        ctx,
        penSize,
        selectedColor,
        xMirror,
        yMirror
      );
    } else if (selectedTool === 'eraser' && mouse.isPressed) {
      Eraser('mousemove', mouse, frames.current[currentFrameIndex].scene, pixel_size, displaySize, ctx, penSize);
    } else if (selectedTool === 'line' && mouse.isPressed) {
      //remove draw from the top canvas
      topCtx.clearRect(0, 0, displaySize, displaySize);
      frames.current[currentFrameIndex].scene.currentPixelsMousePressed = new Map();
      Line(
        frames.current[currentFrameIndex].scene,
        topCtx,
        mouse,
        pixel_size,
        frames.current[currentFrameIndex].scene.lineFirstPixel!,
        selectedColor,
        penSize,
        displaySize
      );
    } else if (selectedTool === 'rectangle' && mouse.isPressed) {
      //remove draw from the top canvas
      topCtx.clearRect(0, 0, displaySize, displaySize);
      Rectangle(
        frames.current[currentFrameIndex].scene,
        topCtx,
        mouse,
        pixel_size,
        frames.current[currentFrameIndex].scene.lineFirstPixel!,
        selectedColor,
        penSize,
        displaySize
      );
    } else if (selectedTool === 'elipse' && mouse.isPressed) {
      //remove draw from the top canvas
      topCtx.clearRect(0, 0, displaySize, displaySize);

      if (frames.current[currentFrameIndex].scene.lineFirstPixel) {
        const majorRadius = Math.abs(frames.current[currentFrameIndex].scene.lineFirstPixel!.x - mouse.x);
        const minorRadius = Math.abs(frames.current[currentFrameIndex].scene.lineFirstPixel!.y - mouse.y);

        if (oneToOneRatioElipse) {
          Elipse(
            frames.current[currentFrameIndex].scene,
            topCtx,
            pixel_size,
            frames.current[currentFrameIndex].scene.lineFirstPixel!,
            selectedColor,
            penSize,
            majorRadius,
            majorRadius,
            displaySize
          );
        } else {
          Elipse(
            frames.current[currentFrameIndex].scene,
            topCtx,
            pixel_size,
            frames.current[currentFrameIndex].scene.lineFirstPixel!,
            selectedColor,
            penSize,
            majorRadius,
            minorRadius,
            displaySize
          );
        }
      }
    }

    mouse.mouseMoveLastPos = { x: mouse.x, y: mouse.y };
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////

  function paintMousePosition() {
    const x = Math.floor(mouse.x);
    const y = Math.floor(mouse.y);
    if (x >= 0 && x <= displaySize && y >= 0 && y <= displaySize) {
      if (frames.current[currentFrameIndex].scene.previousPixelWhileMovingMouse) {
        // removeDraw(
        //   topCtx,
        //   [
        //     frames.current[currentFrameIndex].scene.previousPixelWhileMovingMouse!,
        //     ...frames.current[currentFrameIndex].scene.previousNeighborsWhileMovingMouse
        //   ],
        //   pixel_size
        // );
        topCtx.clearRect(
          frames.current[currentFrameIndex].scene.previousPixelWhileMovingMouse!.x,
          frames.current[currentFrameIndex].scene.previousPixelWhileMovingMouse!.y,
          pixel_size,
          pixel_size
        );

        for (let n of frames.current[currentFrameIndex].scene.previousNeighborsWhileMovingMouse) {
          topCtx.clearRect(n.x, n.y, pixel_size, pixel_size);
        }
      }
      // topCtx.fillStyle = selectedColor;
      if (selectedTool === 'paintBucket' || selectedTool === 'dropper' || selectedTool === 'eraser') {
        topCtx.fillStyle = 'rgba(58, 73, 96, 0.42)';
      } else {
        topCtx.fillStyle = selectedColor;
      }
      topCtx.fillRect(x, y, pixel_size, pixel_size);

      let neighbors: { x: number; y: number }[] = frames.current[currentFrameIndex].scene.findNeighborsMatrix(
        x,
        y,
        penSize,
        displaySize
      );

      if (selectedTool !== 'dropper' && selectedTool !== 'paintBucket') {
        for (let n of neighbors) {
          if (selectedTool === 'eraser') topCtx.fillStyle = 'rgba(58, 73, 96, 0.42)';
          else topCtx.fillStyle = selectedColor;
          topCtx.fillRect(n.x, n.y, pixel_size, pixel_size);
        }
      }

      frames.current[currentFrameIndex].scene.previousNeighborsWhileMovingMouse = neighbors;

      frames.current[currentFrameIndex].scene.previousPixelWhileMovingMouse = { x, y };
    } else {
      if (frames.current[currentFrameIndex].scene.previousPixelWhileMovingMouse) {
        // removeDraw(
        //   topCtx,
        //   [
        //     frames.current[currentFrameIndex].scene.previousPixelWhileMovingMouse!,
        //     ...frames.current[currentFrameIndex].scene.previousNeighborsWhileMovingMouse
        //   ],
        //   pixel_size
        // );

        topCtx.clearRect(
          frames.current[currentFrameIndex].scene.previousPixelWhileMovingMouse!.x,
          frames.current[currentFrameIndex].scene.previousPixelWhileMovingMouse!.y,
          pixel_size,
          pixel_size
        );

        for (let n of frames.current[currentFrameIndex].scene.previousNeighborsWhileMovingMouse) {
          topCtx.clearRect(n.x, n.y, pixel_size, pixel_size);
        }
      }
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////

  function handleZoomMobile(e: TouchEvent) {
    if (!outerDiv) return;

    // Prevent the default behavior of the touch event
    //e.preventDefault();

    const rect = outerDiv.getBoundingClientRect();

    if (e.touches.length === 2) {
      // Update the touch positions relative to the outer div
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const touch1X = touch1.clientX - rect.left;
      const touch1Y = touch1.clientY - rect.top;
      const touch2X = touch2.clientX - rect.left;
      const touch2Y = touch2.clientY - rect.top;

      //zooming in mobile the same way it's done in desktop but its not great
      //TODO: implement zooming in another way for mobile

      // Calculate the distance between the two touch points
      const touchDistance = Math.sqrt(Math.pow(touch2X - touch1X, 2) + Math.pow(touch2Y - touch1Y, 2));

      const mouseX = (touch1X + touch2X) / 2;
      const mouseY = (touch1Y + touch2Y) / 2;

      // Calculate the pinch scale based on the initial touch distance and current touch distance
      const pinchScale = touchDistance / touchStartDistance;

      if (pinchScale > 1 && frames.current[currentFrameIndex].scene.zoomAmount < MAX_ZOOM_AMOUNT) {
        if (frames.current[currentFrameIndex].scene.zoomAmount < MAX_ZOOM_AMOUNT) {
          frames.current[currentFrameIndex].scene.zoomAmount++;

          //dx and dy determines the translation of the canvas based on the mouse position during zooming
          //subtracting outerDiv.offsetWidth / 2 from mouse.x determines the offset of the mouse position from the center of the outer div.
          //the resulting value is then multiplied by the SCALE_FACTOR to ensure the correct translation based on the current scale factor.

          const dx = (mouseX - outerDiv.offsetWidth / 2) * SCALE_FACTOR;
          const dy = (mouseY - outerDiv.offsetHeight / 2) * SCALE_FACTOR;

          currentScale += SCALE_FACTOR;
          currentScale = Math.max(currentScale, 0.1); // Set a minimum scale value

          const scaleChangeFactor = currentScale / (currentScale - SCALE_FACTOR); //calculate current scale factor

          canvas.style.width = `${canvas.offsetWidth * scaleChangeFactor}px`;
          canvas.style.height = `${canvas.offsetHeight * scaleChangeFactor}px`;
          canvas.style.left = `${canvas.offsetLeft - dx}px`;
          canvas.style.top = `${canvas.offsetTop - dy}px`;

          topCanvas.style.width = `${topCanvas.offsetWidth * scaleChangeFactor}px`;
          topCanvas.style.height = `${topCanvas.offsetHeight * scaleChangeFactor}px`;
          topCanvas.style.left = `${topCanvas.offsetLeft - dx}px`;
          topCanvas.style.top = `${topCanvas.offsetTop - dy}px`;

          backgroundCanvas.style.width = `${backgroundCanvas.offsetWidth * scaleChangeFactor}px`;
          backgroundCanvas.style.height = `${backgroundCanvas.offsetHeight * scaleChangeFactor}px`;
          backgroundCanvas.style.left = `${backgroundCanvas.offsetLeft - dx}px`;
          backgroundCanvas.style.top = `${backgroundCanvas.offsetTop - dy}px`;

          // Store the mouse position in the history
          mouse.history.push({ x: mouseX, y: mouseY });
        }
      } else if (pinchScale < 1) {
        // Zoom out

        if (frames.current[currentFrameIndex].scene.zoomAmount > 0) {
          frames.current[currentFrameIndex].scene.zoomAmount--;
          if (mouse.history.length > 0) {
            const lastMousePos = mouse.history.pop()!;

            const dx = (lastMousePos.x - outerDiv.offsetWidth / 2) * SCALE_FACTOR;
            const dy = (lastMousePos.y - outerDiv.offsetHeight / 2) * SCALE_FACTOR;

            currentScale -= SCALE_FACTOR;
            currentScale = Math.max(currentScale, 0.1); // Set a minimum scale value

            const scaleChangeFactor = currentScale / (currentScale + SCALE_FACTOR);

            canvas.style.width = `${canvas.offsetWidth * scaleChangeFactor}px`;
            canvas.style.height = `${canvas.offsetHeight * scaleChangeFactor}px`;
            canvas.style.left = `${canvas.offsetLeft + dx}px`;
            canvas.style.top = `${canvas.offsetTop + dy}px`;
            topCanvas.style.width = `${topCanvas.offsetWidth * scaleChangeFactor}px`;
            topCanvas.style.height = `${topCanvas.offsetHeight * scaleChangeFactor}px`;
            topCanvas.style.left = `${topCanvas.offsetLeft + dx}px`;
            topCanvas.style.top = `${topCanvas.offsetTop + dy}px`;

            backgroundCanvas.style.width = `${backgroundCanvas.offsetWidth * scaleChangeFactor}px`;
            backgroundCanvas.style.height = `${backgroundCanvas.offsetHeight * scaleChangeFactor}px`;
            backgroundCanvas.style.left = `${backgroundCanvas.offsetLeft + dx}px`;
            backgroundCanvas.style.top = `${backgroundCanvas.offsetTop + dy}px`;
          }
        } else {
          resetCanvasPosition();
        }
      }
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////

  function handleZoom(e: WheelEvent) {
    if (!outerDiv) return;

    //e.preventDefault();

    const rect = outerDiv.getBoundingClientRect();

    // Update the mouse position relative to the outer div
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const delta = Math.sign(e.deltaY);

    if (delta < 0 && frames.current[currentFrameIndex].scene.zoomAmount < MAX_ZOOM_AMOUNT) {
      // Zoom in
      if (parseFloat(canvas.style.width) < originalCanvasWidth) {
        currentScale += SCALE_FACTOR;
        const newSize = Math.min(parseFloat(canvas.style.width) + 100, originalCanvasWidth);

        canvas.style.width = `${newSize}px`;
        canvas.style.height = `${newSize}px`;
        topCanvas.style.width = `${newSize}px`;
        topCanvas.style.height = `${newSize}px`;
        backgroundCanvas.style.width = `${newSize}px`;
        backgroundCanvas.style.height = `${newSize}px`;

        //paint pixel in top canvas relative to mouse position
        mouseToWorldCoordinates(e.clientX, e.clientY);
        paintMousePosition();
      } else if (frames.current[currentFrameIndex].scene.zoomAmount < MAX_ZOOM_AMOUNT) {
        frames.current[currentFrameIndex].scene.zoomAmount++;

        //dx and dy determines the translation of the canvas based on the mouse position during zooming
        //subtracting outerDiv.offsetWidth / 2 from mouse.x determines the offset of the mouse position from the center of the outer div.
        //the resulting value is then multiplied by the SCALE_FACTOR to ensure the correct translation based on the current scale factor.

        const dx = (mouseX - outerDiv.offsetWidth / 2) * SCALE_FACTOR;
        const dy = (mouseY - outerDiv.offsetHeight / 2) * SCALE_FACTOR;

        currentScale += SCALE_FACTOR;
        currentScale = Math.max(currentScale, 0.15); // Set a minimum scale value

        const scaleChangeFactor = currentScale / (currentScale - SCALE_FACTOR); //calculate current scale factor

        canvas.style.width = `${canvas.offsetWidth * scaleChangeFactor}px`;
        canvas.style.height = `${canvas.offsetHeight * scaleChangeFactor}px`;
        canvas.style.left = `${canvas.offsetLeft - dx}px`;
        canvas.style.top = `${canvas.offsetTop - dy}px`;

        topCanvas.style.width = `${topCanvas.offsetWidth * scaleChangeFactor}px`;
        topCanvas.style.height = `${topCanvas.offsetHeight * scaleChangeFactor}px`;
        topCanvas.style.left = `${topCanvas.offsetLeft - dx}px`;
        topCanvas.style.top = `${topCanvas.offsetTop - dy}px`;

        backgroundCanvas.style.width = `${backgroundCanvas.offsetWidth * scaleChangeFactor}px`;
        backgroundCanvas.style.height = `${backgroundCanvas.offsetHeight * scaleChangeFactor}px`;
        backgroundCanvas.style.left = `${backgroundCanvas.offsetLeft - dx}px`;
        backgroundCanvas.style.top = `${backgroundCanvas.offsetTop - dy}px`;

        // Store the mouse position in the history
        mouse.history.push({ x: mouseX, y: mouseY });
        //paint pixel in top canvas relative to mouse position
        mouseToWorldCoordinates(e.clientX, e.clientY);
        paintMousePosition();
      }
    } else if (delta > 0) {
      // Zoom out

      if (frames.current[currentFrameIndex].scene.zoomAmount > 0) {
        frames.current[currentFrameIndex].scene.zoomAmount--;
        if (mouse.history.length > 0) {
          const lastMousePos = mouse.history.pop()!;

          const dx = (lastMousePos.x - outerDiv.offsetWidth / 2) * SCALE_FACTOR;
          const dy = (lastMousePos.y - outerDiv.offsetHeight / 2) * SCALE_FACTOR;

          currentScale -= SCALE_FACTOR;
          currentScale = Math.max(currentScale, 0.1); // Set a minimum scale value

          const scaleChangeFactor = currentScale / (currentScale + SCALE_FACTOR);

          canvas.style.width = `${canvas.offsetWidth * scaleChangeFactor}px`;
          canvas.style.height = `${canvas.offsetHeight * scaleChangeFactor}px`;
          canvas.style.left = `${canvas.offsetLeft + dx}px`;
          canvas.style.top = `${canvas.offsetTop + dy}px`;

          topCanvas.style.width = `${topCanvas.offsetWidth * scaleChangeFactor}px`;
          topCanvas.style.height = `${topCanvas.offsetHeight * scaleChangeFactor}px`;
          topCanvas.style.left = `${topCanvas.offsetLeft + dx}px`;
          topCanvas.style.top = `${topCanvas.offsetTop + dy}px`;

          backgroundCanvas.style.width = `${backgroundCanvas.offsetWidth * scaleChangeFactor}px`;
          backgroundCanvas.style.height = `${backgroundCanvas.offsetHeight * scaleChangeFactor}px`;
          backgroundCanvas.style.left = `${backgroundCanvas.offsetLeft + dx}px`;
          backgroundCanvas.style.top = `${backgroundCanvas.offsetTop + dy}px`;

          //paint pixel in top canvas relative to mouse position
          mouseToWorldCoordinates(e.clientX, e.clientY);
          paintMousePosition();
        }
      } else if (parseFloat(canvas.style.width) > displaySize) {
        const newSize = Math.max(parseFloat(canvas.style.width) - 100, displaySize);

        canvas.style.width = `${newSize}px`;
        canvas.style.height = `${newSize}px`;
        topCanvas.style.width = `${newSize}px`;
        topCanvas.style.height = `${newSize}px`;
        backgroundCanvas.style.width = `${newSize}px`;
        backgroundCanvas.style.height = `${newSize}px`;

        currentScale -= SCALE_FACTOR;

        //paint pixel in top canvas relative to mouse position
        mouseToWorldCoordinates(e.clientX, e.clientY);
        paintMousePosition();
      }
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////

  function resetCanvasPosition() {
    canvas.style.width = `${originalCanvasWidth}px`;
    canvas.style.height = `${originalCanvasWidth}px`;
    canvas.style.left = '45%';
    canvas.style.top = '45%';
    topCanvas.style.width = `${originalCanvasWidth}px`;
    topCanvas.style.height = `${originalCanvasWidth}px`;
    topCanvas.style.left = '45%';
    topCanvas.style.top = '45%';
    backgroundCanvas.style.width = `${originalCanvasWidth}px`;
    backgroundCanvas.style.height = `${originalCanvasWidth}px`;
    backgroundCanvas.style.left = '45%';
    backgroundCanvas.style.top = '45%';

    currentScale = 1;
    frames.current[currentFrameIndex].scene.zoomAmount = 0;
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////

  function handleFinishDraw(e: TouchEvent | MouseEvent | undefined) {
    if (e) e.preventDefault();

    clearTimeout(pinchTouchStartTimeOut);

    isPinching = false;
    mouse.isPressed = false;
    mouse.isLeftButtonClicked = false;
    mouse.isRightButtonClicked = false;

    frames.current[currentFrameIndex].scene.lastPixel = null;
    frames.current[currentFrameIndex].scene.lastPixelXMirror = null;
    frames.current[currentFrameIndex].scene.lastPixelYMirror = null;
    frames.current[currentFrameIndex].scene.lastPixelXYMirror = null;

    // const array = ctx.getImageData(0, 0, displaySize, displaySize).data.slice();
    // console.log('pushing to undo stack:', array);

    // if (!empty) {
    //   frames.current[currentFrameIndex].undoStack.push(frames.current[currentFrameIndex].scene.currentDraw);
    //   EventBus.getInstance().publish<drawOnSideBarCanvasType>(DRAW_ON_SIDEBAR_CANVAS, {
    //     frame: currentFrame,
    //     pixelMatrix: frames.current[currentFrameIndex].scene.pixels,
    //     frames: frames.current
    //   });
    //   EventBus.getInstance().publish<Frame[]>(UPDATE_FRAMES_REF_ON_PREVIEW, frames.current);
    frames.current[currentFrameIndex].redoStack.clear();
    // }
    //}

    //here the draws made with Line, Rectangle or Elipse tool are put in main canvas
    if (selectedTool === 'line' || selectedTool === 'rectangle' || selectedTool === 'elipse') {
      topCanvasToMainCanvas();

      topCtx.clearRect(0, 0, displaySize, displaySize);
    }

    if (frames.current[currentFrameIndex].scene.currentDrawTopCanvas.length > 0) {
      // const clean: Pixel[] = cleanDraw(frames.current[currentFrameIndex].scene.currentDrawTopCanvas);
      // translateDrawToMainCanvas(clean, ctx, pixel_size, selectedColor, penSize, frames.current[currentFrameIndex].scene);
      // // EventBus.getInstance().publish<drawOnSideBarCanvasType>(DRAW_ON_SIDEBAR_CANVAS, {
      // //   frame: currentFrame,
      // //   pixelMatrix: frames.current[currentFrameIndex].scene.pixels,
      // //   frames: frames.current
      // // });
      // EventBus.getInstance().publish<Frame[]>(UPDATE_FRAMES_REF_ON_PREVIEW, frames.current);
      // frames.current[currentFrameIndex].undoStack.push(frames.current[currentFrameIndex].scene.currentDrawTopCanvas);
      //frames.current[currentFrameIndex].redoStack.clear();
    }

    removeDraw(topCtx, cleanDraw(frames.current[currentFrameIndex].scene.currentDrawTopCanvas), pixel_size);
    frames.current[currentFrameIndex].scene.currentDrawTopCanvas = [];

    frames.current[currentFrameIndex].scene.currentPixelsMousePressed = new Map();

    frames.current[currentFrameIndex].scene.circleRadius = 0;

    if (selectedTool !== 'dropper') {
      frames.current[currentFrameIndex].undoStack.push(ctx.getImageData(0, 0, displaySize, displaySize).data);
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////

  function topCanvasToMainCanvas() {
    const topData = topCtx.getImageData(0, 0, displaySize, displaySize).data;

    for (let i = 0; i < topData.length; i += 4) {
      if (topData[i + 3] !== 0) {
        frames.current[currentFrameIndex].scene.pixels[i] = topData[i];
        frames.current[currentFrameIndex].scene.pixels[i + 1] = topData[i + 1];
        frames.current[currentFrameIndex].scene.pixels[i + 2] = topData[i + 2];
        frames.current[currentFrameIndex].scene.pixels[i + 3] = topData[i + 3];
      }
    }

    const imageData = new ImageData(frames.current[currentFrameIndex].scene.pixels, displaySize, displaySize);

    ctx.putImageData(imageData, 0, 0);

    // frames.current[currentFrameIndex].undoStack.push(ctx.getImageData(0, 0, displaySize, displaySize).data);
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////

  function createNewFrame() {
    return {
      name: `frame${Date.now()}`,
      scene: new Scene()
      // undoStack: new Stack<Pixel[][]>(),
      // redoStack: new Stack<[Pixel, string | undefined][]>()
    } as Frame;
  }

  return (
    <>
      <div
        className="editor-wrapper"
        style={!isMobile ? { height: '100%', width: '100%' } : { height: '50vh', width: '100%' }}
        ref={outerDivRef}
        onWheel={handleZoom}
        onMouseDown={handleFirstClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleFinishDraw}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleFinishDraw}>
        <canvas className="canvas" id="topCanvas" style={{ zIndex: 2 }} ref={topCanvasRef}></canvas>
        <canvas className="canvas" id="canvas" style={{ zIndex: 1 }} ref={canvasRef}></canvas>
        <canvas className="canvas" id="backgroundCanvas" style={{ zIndex: 0 }} ref={backgroundCanvasRef}></canvas>
      </div>
      {isMobile ?? <div>TESTE 1234567</div>}
    </>
  );
}
