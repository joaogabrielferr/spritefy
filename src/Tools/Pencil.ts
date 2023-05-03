import Mouse from "../Scene/Mouse";
import Scene from "../Scene/Scene";
import { buildPath } from "../Scene/buildPath";
import { Pixel } from "../types/Types";

export function Pencil(eventName : string,scene : Scene,mouse : Mouse,pixel_size : number,display_size : number,ctx: CanvasRenderingContext2D,penSize : number,currentScale : number) : Pixel[]{

    if(!mouse.isPressed)return [];

    const draw : Pixel[] = []; //pixels changed in this function are stored here

      //transforming mouse coordinates in world coordinates
      const [xs,ys] = mouse.toWorldCoordinates(currentScale);

      if (xs > display_size || xs < 0 || ys > display_size || ys < 0)
      {
        return [];
      }

      //find pixel based on mouse position
      const pixel : Pixel | null = scene.findPixel(xs,ys);

    
    //if this pixel is in currentPixelsMousePressed, that means it was already painted in the current stroke, no need to paint it twice
    if (pixel != null && !isPixelAlreadyPaintedInCurrentDraw(pixel, scene)) {
        pixel.color = scene.selectedColor;
        pixel.painted = true;
        pixel.numOfPaints++;
        pixel.colorStack.push(scene.selectedColor);

        scene.currentPixelsMousePressed.set(pixel.id, true);

        ctx.fillStyle = scene.selectedColor;
        ctx.fillRect(pixel.x1, pixel.y1, penSize, penSize);

        draw.push(pixel);

        if (scene.lastPixel !== null && mouse.isPressed && scene.lastPixel.id !== pixel.id && (eventName == "mousemove" || "touchmove")) {
        
            //build path from last pixel to current pixel
            const path = buildPath(scene.pixels, scene.lastPixel, pixel);
            for (let p of path) {
                if (!isPixelAlreadyPaintedInCurrentDraw(p, scene)) {
                ctx.fillStyle = scene.selectedColor;
                ctx.fillRect(p.x1, p.y1, penSize, penSize);

                p.color = scene.selectedColor;
                p.painted = true;
                p.numOfPaints++;
                p.colorStack.push(scene.selectedColor);
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