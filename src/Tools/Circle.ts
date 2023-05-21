import { completeCircle } from "../scene/BuildPath";
import Mouse from "../scene/Mouse";
import Scene from "../scene/Scene";
import { Pixel } from "../types";

//ctx is the context of top canvas, drawing is made first on top canvas and after mouse up event the draw is translated to main canvas, since the draw change dinamically
export function Circle(scene : Scene,ctx : CanvasRenderingContext2D, pixel_size : number,midPoint : Pixel,selectedColor: string,penSize : number){

    const draw : Pixel[] = [];

    const path : Pixel[] = completeCircle(midPoint,scene.circleRadius,scene,pixel_size);

    const map = new Map<number,boolean>();

    for(let pixel of path)
    {
        if(!map.get(pixel.id))
        {
            map.set(pixel.id,true);
            ctx.fillStyle = selectedColor;
            ctx.fillRect(pixel.x1, pixel.y1, penSize, penSize);
            draw.push(pixel);

        }
    }

    return draw;
}