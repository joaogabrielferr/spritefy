import Scene from "../../scene/Scene";
import { Pixel } from "../../types";

export function translateDrawToMainCanvas(draw : Pixel[],ctx : CanvasRenderingContext2D,pixel_size : number,selectedColor : string,penSize : number,scene : Scene){

    for(let pixel of draw)
    {
        ctx.fillStyle = selectedColor;
        ctx.fillRect(pixel.x1,pixel.y1,pixel_size,pixel_size);
        pixel.colorStack.push(selectedColor);

        // if(penSize === 2)
        // {
        //     const neighbors = scene.findNeighborsSize2(pixel);
        //     for(let n of neighbors)
        //     {
        //         // if(!isPixelAlreadyPaintedInCurrentDraw(n, scene))
        //         // {
        //             // scene.currentPixelsMousePressed.set(n.id, true);
        //             ctx.fillRect(n.x1, n.y1, pixel_size, pixel_size);
        //             n.colorStack.push(selectedColor);
        //             // draw.push(n);
        //         // }
        //     }
        // }

    }   
}