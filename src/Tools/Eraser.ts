import Mouse from "../scene/Mouse";
import Scene from "../scene/Scene";
import { bresenhamsAlgorithm } from "../scene/buildPath"
import { Pixel } from "../types/index";
import { ERASING } from "../utils/constants";

export function Eraser(eventName : string, mouse : Mouse, scene : Scene, pixel_size : number, display_size : number, ctx : CanvasRenderingContext2D, penSize : number){
  
  // if(!mouse.isPressed)return [];


  const draw : Pixel[] = []; //pixels changed in this function are stored here


    const x = mouse.x;
    const y = mouse.y;

    if (x > display_size || x < 0 || y > display_size || y < 0)
    {
      return [];
    }

    //find pixel based on mouse position
    const pixel : Pixel | null = scene.findPixel(x,y,pixel_size);

    //if this pixel is in currentPixelsMousePressed, that means it was already painted in the current pen stroke, no need to paint it twice
    //if pixel is empty (not painted) dont do anything
    if (pixel != null) {

          if(!isPixelAlreadyPaintedInCurrentDraw(pixel, scene) && !empty(pixel))
          {
              pixel.colorStack.push(ERASING);
              scene.currentPixelsMousePressed.set(pixel.id, true);
              draw.push(pixel);
            //   ctx.fillStyle = pixel.bgColor;
              ctx.clearRect(pixel.x1, pixel.y1, pixel_size, pixel_size);
          }

          paintNeighbors(pixel,scene,ctx,draw,penSize,pixel_size);            



      //if there are gaps between the points, fill them with bresenham's algorithm (see scene/buildPath.ts)
      if (scene.lastPixel !== null && mouse.isPressed && scene.lastPixel.id !== pixel.id && (eventName == "mousemove" || "touchmove")) {
      
          //build path from last pixel to current pixel
          const path = bresenhamsAlgorithm(scene, scene.lastPixel, pixel,pixel_size);
          for (let p of path) {
              if (!isPixelAlreadyPaintedInCurrentDraw(p, scene) && !empty(p)) {
                  p.colorStack.push(p.bgColor);
                  scene.currentPixelsMousePressed.set(p.id, true);
                  draw.push(p);
                  ctx.clearRect(p.x1, p.y1, pixel_size, pixel_size);
              }
              
              paintNeighbors(p,scene,ctx,draw,penSize,pixel_size);            

          }
      }

      scene.lastPixel = pixel;

  }
  return draw;
  
}

function isPixelAlreadyPaintedInCurrentDraw(pixel : Pixel,scene : Scene){
  return scene.currentPixelsMousePressed.get(pixel.id);
}

//if pixel was never painted or it is already erased

function empty(pixel : Pixel)
{
  const lastColor : string | undefined = pixel.colorStack.top();
  if(!lastColor || (lastColor && lastColor === pixel.bgColor))return true;
  return false;
}

function paintNeighbors(pixel : Pixel, scene : Scene, ctx : CanvasRenderingContext2D,draw : Pixel[],penSize : number,pixel_size : number)
{

    let neighbors : Pixel[] = scene.findNeighbors(pixel,penSize);

    for(let n of neighbors)
    {
        if(!isPixelAlreadyPaintedInCurrentDraw(n, scene) && !empty(n))
        {
            scene.currentPixelsMousePressed.set(n.id, true);
            n.colorStack.push(ERASING);
            draw.push(n);
            ctx.clearRect(n.x1, n.y1, pixel_size, pixel_size);
        }
    }
}
