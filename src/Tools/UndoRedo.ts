//the pixels drawn until I released the mouse are put in the undo stack
//if i press ctrl + z, i select the pixels at the top of the undo stack, and remove then from the canvas
//after that, i put theses pixels in the redo stack
//if i press ctrz + y, i select the pixels at the top of the redo stack, and add then to the canvas
//after that, i put these pixels in the undo stack

import Scene from "../scene/Scene";
import { Pixel } from "../types";
import { Stack } from "../utils/Stack";
import { cleanDraw } from "./helpers/CleanDraw";




export const undoLastDraw = (scene : Scene, penSize : number, ctx : CanvasRenderingContext2D) => {
  if (undoStack.isEmpty()) return;

  const draw = undoStack.top();
  if(!draw)return;
  undoStack.pop();
  const clean = cleanDraw(draw);

  for (let pixel of clean) {
    const currPixel = scene.pixels[pixel.i][pixel.j];

    currPixel.colorStack.pop();
    const previousColor = currPixel.colorStack.top();
    //   currPixel.color = previousColor;
      if(previousColor)
      {
          ctx.fillStyle = previousColor;
          ctx.fillRect(currPixel.x1, currPixel.y1, penSize, penSize);
      }
      if(currPixel.colorStack.isEmpty())
      {
          ctx.fillStyle = currPixel.bgColor;
          ctx.fillRect(currPixel.x1, currPixel.y1, penSize, penSize);
      }
    // }
  }
};


export const undoStack = new Stack<Pixel[][]>();
export const redoStack = new Stack<Pixel[][]>();

