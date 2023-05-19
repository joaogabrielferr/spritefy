import Mouse from "../scene/Mouse";
import Scene from "../scene/Scene";
import { bresenhamsAlgorithm } from "../scene/BuildPath";
import { Pixel } from "../types";

//ctx is the context of top canvas, drawing is made first on top canvas and after mouse up event the draw is translated to main canvas, since the draw change dinamically
export function Line(scene : Scene,ctx : CanvasRenderingContext2D ,mouse : Mouse, pixel_size : number,start : Pixel,selectedColor: string,penSize : number)
{
    const draw : Pixel[] = [];

    //const [x,y] = mouse.toWorldCoordinates(currentScale);
    const x = mouse.x;
    const y = mouse.y;

    const end : Pixel | null = scene.findPixel(x,y,pixel_size);
    if(!end)return draw;

    const path = bresenhamsAlgorithm(scene,start,end,pixel_size);

    for(let pixel of path)
    {
        ctx.fillStyle = selectedColor;
        ctx.fillRect(pixel.x1, pixel.y1, penSize, penSize);
        draw.push(pixel);
    }

    return draw;

}