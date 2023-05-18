import { Pixel } from "../../types";

export function translateDrawToMainCanvas(draw : Pixel[],ctx : CanvasRenderingContext2D,pixel_size : number,selectedColor : string){

    for(let pixel of draw)
    {
        ctx.fillStyle = selectedColor;
        ctx.fillRect(pixel.x1,pixel.y1,pixel_size,pixel_size);
        pixel.colorStack.push(selectedColor);
    }   
}