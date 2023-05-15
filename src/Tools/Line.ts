import Mouse from "../scene/Mouse";
import Scene from "../scene/Scene";
import { buildPath } from "../scene/buildPath";
import { Pixel } from "../types";

export function Line(scene : Scene,ctx : CanvasRenderingContext2D ,mouse : Mouse, pixel_size : number,start : Pixel,currentScale : number,selectedColor: string,penSize : number)
{
    const draw : Pixel[] = [];

    const [x,y] = mouse.toWorldCoordinates(currentScale);

    const end : Pixel | null = scene.findPixel(x,y,pixel_size);

    if(!end)return draw;

    // ctx.fillStyle = selectedColor;
    // ctx.fillRect(start.x1,start.y1,penSize,penSize);
    // start.colorStack.push(selectedColor);

    // draw.push(start);

    const path = buildPath(scene,scene.pixels,start,end,pixel_size);

    for(let pixel of path)
    {
        ctx.fillStyle = selectedColor;
        ctx.fillRect(pixel.x1, pixel.y1, penSize, penSize);
        pixel.colorStack.push(selectedColor);
        draw.push(pixel);
    }

    // ctx.fillStyle = selectedColor;
    // ctx.fillRect(end.x1,end.y1,penSize,penSize);
    // end.colorStack.push(selectedColor);

    // draw.push(end);

    return draw;

}