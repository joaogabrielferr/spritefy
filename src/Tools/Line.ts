import Mouse from "../scene/Mouse";
import Scene from "../scene/Scene";
import { bresenhamsAlgorithm } from "../scene/BuildPath";
import { Pixel } from "../types";

//ctx is the context of top canvas, drawing is made first on top canvas and after mouse up event the draw is translated to main canvas, since the draw change dinamically
export function Line(scene : Scene,ctx : CanvasRenderingContext2D ,mouse : Mouse, pixel_size : number,start : Pixel,selectedColor: string,penSize : number)
{
    const draw : Pixel[] = [];

    const x = mouse.x;
    const y = mouse.y;

    const end : Pixel | null = scene.findPixel(x,y,pixel_size);
    if(!end)return draw;

    const path = bresenhamsAlgorithm(scene,start,end,pixel_size);
    for(let pixel of path)
    {
        if(!isPixelAlreadyPaintedInCurrentDraw(pixel, scene))
        {
            ctx.fillStyle = selectedColor;
            ctx.fillRect(pixel.x1, pixel.y1, pixel_size, pixel_size);
            draw.push(pixel);

            paintNeighbors(pixel,scene,ctx,draw,penSize,pixel_size);            
        }

    }

    return draw;

}

function isPixelAlreadyPaintedInCurrentDraw(pixel : Pixel,scene : Scene){
    return scene.currentPixelsMousePressed.get(pixel.id);
}

function paintNeighbors(pixel : Pixel, scene : Scene, ctx : CanvasRenderingContext2D,draw : Pixel[],penSize : number,pixel_size : number)
{

    let neighbors : Pixel[] = scene.findNeighbors(pixel,penSize);

    for(let n of neighbors)
    {
        scene.currentPixelsMousePressed.set(n.id, true);
        ctx.fillRect(n.x1, n.y1, pixel_size, pixel_size);
        draw.push(n);
    }
}