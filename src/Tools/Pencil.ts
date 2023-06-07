import Mouse from "../scene/Mouse";
import Scene from "../scene/Scene";
import { bresenhamsAlgorithm} from '../scene/buildPath';
import { Pixel} from "../types";

export function 
Pencil(eventName : string,
        scene : Scene,
        mouse : Mouse,
        pixel_size : number,
        display_size : number,
        ctx: CanvasRenderingContext2D,
        penSize : number,
        selectedColor : string,
        xMirror : boolean,
        yMirror : boolean) : Pixel[]{



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
      const pixelXMirror : Pixel | null = scene.findPixel(display_size/2 + (display_size/2 - xs),ys,pixel_size);
      const pixelYMirror : Pixel | null = scene.findPixel(xs,display_size/2 + (display_size/2 - ys),pixel_size);
      const pixelXYMirror : Pixel | null = scene.findPixel(display_size/2 + (display_size/2 - xs),display_size/2 + (display_size/2 - ys),pixel_size);


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
            let path = bresenhamsAlgorithm(scene, scene.lastPixel, pixel,pixel_size);
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

    if(xMirror)
    {
        if(pixelXMirror)
        {
            if(!isPixelAlreadyPaintedInCurrentDraw(pixelXMirror, scene))
            {
                pixelXMirror.colorStack.push(selectedColor);
                scene.currentPixelsMousePressed.set(pixelXMirror.id, true);
                draw.push(pixelXMirror);
            }
            ctx.fillStyle = selectedColor;
            ctx.fillRect(pixelXMirror.x1, pixelXMirror.y1, pixel_size, pixel_size);
            
            paintNeighbors(pixelXMirror,scene,ctx,draw,penSize,selectedColor,pixel_size);            

            
        //if there are gaps between the points, fill them with bresenham's algorithm (see scene/buildPath.ts)
        if (scene.lastPixelXMirror !== null && mouse.isPressed && scene.lastPixelXMirror.id !== pixelXMirror.id && (eventName == "mousemove" || "touchmove")) {
            //build path from last pixel to current pixel
            let path = bresenhamsAlgorithm(scene, scene.lastPixelXMirror, pixelXMirror,pixel_size);
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

        scene.lastPixelXMirror = pixelXMirror;
        }
    }

    if(yMirror)
    {

        if(pixelYMirror)
        {
            if(!isPixelAlreadyPaintedInCurrentDraw(pixelYMirror, scene))
            {
                pixelYMirror.colorStack.push(selectedColor);
                scene.currentPixelsMousePressed.set(pixelYMirror.id, true);
                draw.push(pixelYMirror);
            }
            ctx.fillStyle = selectedColor;
            ctx.fillRect(pixelYMirror.x1, pixelYMirror.y1, pixel_size, pixel_size);
            
            paintNeighbors(pixelYMirror,scene,ctx,draw,penSize,selectedColor,pixel_size);            

            
        //if there are gaps between the points, fill them with bresenham's algorithm (see scene/buildPath.ts)
        if (scene.lastPixelYMirror !== null && mouse.isPressed && scene.lastPixelYMirror.id !== pixelYMirror.id && (eventName == "mousemove" || "touchmove")) {
            //build path from last pixel to current pixel
            let path = bresenhamsAlgorithm(scene, scene.lastPixelYMirror, pixelYMirror,pixel_size);
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

        scene.lastPixelYMirror = pixelYMirror;
        }
    }

    if(xMirror && yMirror)
    {
        if(pixelXYMirror)
        {
            if(!isPixelAlreadyPaintedInCurrentDraw(pixelXYMirror, scene))
            {
                pixelXYMirror.colorStack.push(selectedColor);
                scene.currentPixelsMousePressed.set(pixelXYMirror.id, true);
                draw.push(pixelXYMirror);
            }
            ctx.fillStyle = selectedColor;
            ctx.fillRect(pixelXYMirror.x1, pixelXYMirror.y1, pixel_size, pixel_size);
            
            paintNeighbors(pixelXYMirror,scene,ctx,draw,penSize,selectedColor,pixel_size);            

            
        //if there are gaps between the points, fill them with bresenham's algorithm (see scene/buildPath.ts)
        if (scene.lastPixelXYMirror !== null && mouse.isPressed && scene.lastPixelXYMirror.id !== pixelXYMirror.id && (eventName == "mousemove" || "touchmove")) {
            //build path from last pixel to current pixel
            let path = bresenhamsAlgorithm(scene, scene.lastPixelXYMirror, pixelXYMirror,pixel_size);
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

        scene.lastPixelXYMirror = pixelXYMirror;
        }
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