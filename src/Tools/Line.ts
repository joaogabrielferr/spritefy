import Mouse from "../scene/Mouse";
import Scene from "../scene/Scene";
import { buildPath } from "../scene/buildPath";
import { Pixel } from "../types";

export function Line(scene : Scene,ctx : CanvasRenderingContext2D ,mouse : Mouse, pixel_size : number,start : Pixel,selectedColor: string,penSize : number)
{
    const draw : Pixel[] = [];

    //const [x,y] = mouse.toWorldCoordinates(currentScale);
    const x = mouse.x;
    const y = mouse.y;

    const end : Pixel | null = scene.findPixel(x,y,pixel_size);
    if(!end)return draw;

    const path = buildPath(scene,start,end,pixel_size);

    for(let pixel of path)
    {
        ctx.fillStyle = selectedColor;
        ctx.fillRect(pixel.x1, pixel.y1, penSize, penSize);
        //pixel.colorStack.push(selectedColor);
        draw.push(pixel);
    }

    return draw;

}