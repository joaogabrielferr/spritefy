//two stacks, one for the undo e the other for the redo
//the pixels drawn until I released the mouse are put in the undo stack
//if i press ctrl + z, i select the pixels at the top of the undo stack, and remove then from the canvas
//after that, i put theses pixels in the redo stack
//if i press ctrz + y, i select the pixels at the top of the redo stack, and add then to the canvas
//after that, i put these pixels in the undo stack

import Scene from "../Scene/Scene";
import { Pixel } from "../types";
import { Stack } from "../utils/Stack";





//removes duplicated pixels
const cleanDraw = (draw : Pixel[][]) => {
  const clean = [];

  const map = new Map<number,boolean>();

  for (let i = 0; i < draw.length; i++) {
    if (draw[i]) {
      for (let j = 0; j < draw[i].length; j++) {
        // if (!map.get(draw[i][j].x1.toString() + draw[i][j].y1.toString())) {
        //   map.set(draw[i][j].x1.toString() + draw[i][j].y1.toString(), true);
        //   clean.push(draw[i][j]);
        // }
        if(!map.get(draw[i][j].id))
        {
            map.set(draw[i][j].id,true);
            clean.push(draw[i][j]);
        }
      }
    }
  }

  return clean;
};


export const undoLastDraw = (scene : Scene, penSize : number, ctx : CanvasRenderingContext2D) => {
  if (undoStack.isEmpty()) return;

  const draw = undoStack.top();
  if(!draw)return;
  undoStack.pop();
  const clean = cleanDraw(draw);

  for (let pixel of clean) {
    const currPixel = scene.pixels[pixel.i][pixel.j];
    //currPixel.numOfPaints--;
    // if (currPixel.numOfPaints <= 0) {
    //     if(currPixel.colorStack.isEmpty()){
    //   //ctx.clearRect(pixel.x1,pixel.y1,penSize,penSize);
    //   ctx.fillStyle = scene.pixels[pixel.i][pixel.j].bgColor;
    //   // ctx.fillRect(pixel.x1, pixel.y1, penSize, penSize);
    //   ctx.clearRect(pixel.x1, pixel.y1, penSize, penSize);
    // //   currPixel.color = scene.pixels[pixel.i][pixel.j].bgColor;
    // //   currPixel.painted = false;
    // } else {
    // const copy = JSON.stringify(currPixel.colorStack);
    // console.log(copy);
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

