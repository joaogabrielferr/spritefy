import Mouse from "../scene/Mouse";
import Scene from "../scene/Scene";
import { bresenhamsAlgorithm} from "../scene/BuildPath";
import { Pixel} from "../types";

export function 
Pencil(eventName : string,
        scene : Scene,
        mouse : Mouse,
        pixel_size : number,
        display_size : number,
        ctx: CanvasRenderingContext2D,
        penSize : number,
        selectedColor : string) : Pixel[]{



    if(!mouse.isPressed)return [];


    const draw : Pixel[] = []; //pixels changed in this function are stored here

      //transforming mouse coordinates in world coordinates
      //const [xs,ys] = mouse.toWorldCoordinates(currentScale);
      
      const xs = mouse.x;
      const ys = mouse.y;

      if (xs > display_size || xs < 0 || ys > display_size || ys < 0)
      {
        return [];
      }

      //find pixel based on mouse position
      const pixel : Pixel | null = scene.findPixel(xs,ys,pixel_size);

      //if this pixel is in currentPixelsMousePressed, that means it was already painted in the current pen stroke, no need to paint it twice
      if (pixel != null) {
          
            if(!isPixelAlreadyPaintedInCurrentDraw(pixel, scene))
            {
                pixel.colorStack.push(selectedColor);
                scene.currentPixelsMousePressed.set(pixel.id, true);
                draw.push(pixel);
            }
            ctx.fillStyle = selectedColor;
            ctx.fillRect(pixel.x1, pixel.y1, pixel_size, pixel_size);
            
            paintNeighbors(pixel,scene,ctx,draw,penSize,selectedColor,pixel_size);            

            
        //if there are gaps between the points, fill them with bresenham's algorithm (see scene/buildPath.ts)
        if (scene.lastPixel !== null && mouse.isPressed && scene.lastPixel.id !== pixel.id && (eventName == "mousemove" || "touchmove")) {
        
            //build path from last pixel to current pixel
            const path = bresenhamsAlgorithm(scene, scene.lastPixel, pixel,pixel_size);
            for (let p of path) {
                if (!isPixelAlreadyPaintedInCurrentDraw(p, scene)) {

                    p.colorStack.push(selectedColor);
                    scene.currentPixelsMousePressed.set(p.id, true);
                    draw.push(p);
                }
                ctx.fillStyle = selectedColor;
                ctx.fillRect(p.x1, p.y1, pixel_size, pixel_size);
                
                paintNeighbors(p,scene,ctx,draw,penSize,selectedColor,pixel_size);            
  
            }
        }

        scene.lastPixel = pixel;

    }
    return draw;
    
}

function isPixelAlreadyPaintedInCurrentDraw(pixel : Pixel,scene : Scene){
    return scene.currentPixelsMousePressed.get(pixel.id);
}

function paintNeighbors(pixel : Pixel, scene : Scene, ctx : CanvasRenderingContext2D,draw : Pixel[],penSize : number,selectedColor : string,pixel_size : number)
{

    let neighbors : Pixel[] = scene.findNeighbors(pixel,penSize);

    for(let n of neighbors)
    {
        if(!isPixelAlreadyPaintedInCurrentDraw(n, scene))
        {
            scene.currentPixelsMousePressed.set(n.id, true);
            draw.push(n);
            n.colorStack.push(selectedColor);
        }  
            ctx.fillRect(n.x1, n.y1, pixel_size, pixel_size);
        
    }
}