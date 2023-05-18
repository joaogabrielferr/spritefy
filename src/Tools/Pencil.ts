import Mouse from "../scene/Mouse";
import Scene from "../scene/Scene";
import { buildPath } from "../scene/BuildPath";
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
    //   console.log(pixel);

      //if this pixel is in currentPixelsMousePressed, that means it was already painted in the current pen stroke, no need to paint it twice
      if (pixel != null && !isPixelAlreadyPaintedInCurrentDraw(pixel, scene)) {
          
            pixel.colorStack.push(selectedColor);
            scene.currentPixelsMousePressed.set(pixel.id, true);
            ctx.fillStyle = selectedColor;
            ctx.fillRect(pixel.x1, pixel.y1, penSize, penSize);

            draw.push(pixel);

        //if there are gaps between the points, fill them with bresenham's algorithm (see scene/buildPath.ts)
        if (scene.lastPixel !== null && mouse.isPressed && scene.lastPixel.id !== pixel.id && (eventName == "mousemove" || "touchmove")) {
        
            //build path from last pixel to current pixel
            const path = buildPath(scene, scene.lastPixel, pixel,pixel_size);
            for (let p of path) {
                if (!isPixelAlreadyPaintedInCurrentDraw(p, scene)) {
                ctx.fillStyle = selectedColor;
                ctx.fillRect(p.x1, p.y1, penSize, penSize);
                p.colorStack.push(selectedColor);
                scene.currentPixelsMousePressed.set(p.id, true);
                draw.push(p);
                // if (penSize == PIXEL_SIZE * 2) {
                //     paintPixelSize2(p, pixels, DISPLAY_SIZE, currentPixelsMousePressed, selectedColor, draw);
                // }

                // if (penSize == PIXEL_SIZE * 3) {
                //     paintPixelsSize3(p, pixels, DISPLAY_SIZE, currentPixelsMousePressed, selectedColor, draw);
                // }
                }
            }
        }

        scene.lastPixel = pixel;

    }
    return draw;
    
}

const isPixelAlreadyPaintedInCurrentDraw = (pixel : Pixel,scene : Scene) => {
    return scene.currentPixelsMousePressed.get(pixel.id);
  };