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

            if(penSize === 2)
            {
                const neighbors = scene.findNeighborsSize2(pixel);
                for(let n of neighbors)
                {
                    if(!isPixelAlreadyPaintedInCurrentDraw(n, scene))
                    {
                        scene.currentPixelsMousePressed.set(n.id, true);
                        ctx.fillRect(n.x1, n.y1, pixel_size, pixel_size);
                        //not adding to pixel color stack since this is being painted on top canvas temporarily
                        draw.push(n);
                    }
                }
            }else if(penSize === 3)
            {
                const neighbors = scene.findNeighborsSize3(pixel);
                for(let n of neighbors)
                {
                    if(!isPixelAlreadyPaintedInCurrentDraw(n, scene))
                    {
                        scene.currentPixelsMousePressed.set(n.id, true);
                        ctx.fillRect(n.x1, n.y1, pixel_size, pixel_size);
                        draw.push(n);
                    }
                }
            }
        }

    }

    return draw;

}

function isPixelAlreadyPaintedInCurrentDraw(pixel : Pixel,scene : Scene){
    return scene.currentPixelsMousePressed.get(pixel.id);
}