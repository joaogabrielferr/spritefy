import { Pixel } from "../../types";

//clean draw from top canvas
export function removeDraw(ctx : CanvasRenderingContext2D, draw : Pixel[],pixel_size : number)
{
    for(let pixel of draw)
    {
    //     pixel.colorStack.pop();
    //     const previousColor = pixel.colorStack.top();
    //     //   pixel.color = previousColor;
    //       if(previousColor)
    //       {
    //           ctx.fillStyle = previousColor;
    //           ctx.fillRect(pixel.x1, pixel.y1, pixel_size, pixel_size);
    //       }
    //       if(pixel.colorStack.isEmpty())
    //       {
    //           ctx.fillStyle = pixel.bgColor;
    //           ctx.fillRect(pixel.x1, pixel.y1, pixel_size, pixel_size);
    //       }
    // }
        ctx.clearRect(pixel.x1,pixel.y1,pixel_size,pixel_size);
    }

}