import Mouse from "../Scene/Mouse.js";
import Scene from "../Scene/Scene.js";
import { buildPath } from "../Scene/buildPath.js";
import { Pixel } from "../types/index.js";

export const Eraser = (eventName : string, mouse : Mouse, scene : Scene, pixel_size : number, display_size : number, ctx : CanvasRenderingContext2D, penSize : number,currentScale : number) => {
  if (!mouse.isPressed) return;
  
  const [x,y] = mouse.toWorldCoordinates(currentScale);


  if (x > pixel_size * display_size || x < 0 || y > pixel_size * display_size || y < 0) return;

   //find pixel based on mouse position
   const pixel : Pixel | null = scene.findPixel(x,y,pixel_size);

  if (pixel != null) {
    ctx.fillStyle = pixel.bgColor;
    ctx.fillRect(pixel.x1, pixel.y1, penSize, penSize);
    pixel.colorStack.clear();


    if (scene.lastPixel !== null && mouse.isPressed && scene.lastPixel.id !== pixel.id && (eventName === "mousemove" || eventName === "touchmove")) {
      const path = buildPath(scene.pixels, scene.lastPixel, pixel);
      for (let p of path) {
        ctx.fillStyle = p.bgColor;
        ctx.fillRect(p.x1, p.y1, penSize, penSize);
        p.colorStack.clear();
        // p.color = p.bgColor;
        // p.painted = false;
        // p.numOfPaints = 0;
      }
    }
    scene.lastPixel = pixel;
  }
};
