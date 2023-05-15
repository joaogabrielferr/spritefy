import Scene from "../../scene/Scene";
import { Pixel } from "../../types";

//clean draw without adding it to undo stack
export function removeDraw(ctx : CanvasRenderingContext2D, draw : Pixel[],penSize : number)
{
    for(let pixel of draw)
    {
        pixel.colorStack.pop();
        const previousColor = pixel.colorStack.top();
        //   pixel.color = previousColor;
          if(previousColor)
          {
              ctx.fillStyle = previousColor;
              ctx.fillRect(pixel.x1, pixel.y1, penSize, penSize);
          }
          if(pixel.colorStack.isEmpty())
          {
              ctx.fillStyle = pixel.bgColor;
              ctx.fillRect(pixel.x1, pixel.y1, penSize, penSize);
          }
    }

}