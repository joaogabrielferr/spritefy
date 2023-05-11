import Mouse from "../Scene/Mouse";
import Scene from "../Scene/Scene";
import { Pixel } from "../types";
import { BG_COLORS } from "../utils/constants";

export function PaintBucket(scene : Scene,
    mouse : Mouse,
    pixel_size : number,
    display_size : number,
     ctx : CanvasRenderingContext2D,
      currentScale : number,
      penSize : number,
      CANVAS_SIZE : number,
      selectedColor : string){

    if (!mouse.isPressed) return [];
  
    const draw : Pixel[] = [];
  
    const [x,y] = mouse.toWorldCoordinates(currentScale);
  
    if (x > pixel_size * display_size || x < 0 || y > pixel_size * display_size || y < 0) return [];
  
    let pixel : Pixel | null = scene.findPixel(x,y,pixel_size);
  
    if (pixel != null) {
      //fillSpace(scene.pixels, pixel, selectedColor, pixel.colorStack.top() || pixel.bgColor, pixel_size, display_size, penSize, ctx, draw, CANVAS_SIZE);
      const numPixels = display_size * display_size + 1;
      const visited : boolean[] = [];
      for (let i = 0; i <= numPixels; i++) visited.push(false);
      bfs(scene.pixels, pixel, visited, selectedColor, pixel.colorStack.top() || pixel.bgColor, penSize, ctx, draw, CANVAS_SIZE);

    }
  
    return draw;
  }

  //breadth first search
  function bfs(pixels : Pixel[][], 
    u : Pixel,
     visited : boolean[],
      selectedColor : string,
       startColor : string,
        penSize : number,
         ctx : CanvasRenderingContext2D, 
          draw : Pixel[],
           CANVAS_SIZE : number) {

    visited[u.id] = true;

    const queue : Pixel[] = [];
    queue.push(u);
    while (queue.length > 0) {
      u = queue.shift()!;
      ctx.fillStyle = selectedColor;
      ctx.fillRect(u.x1, u.y1, penSize, penSize);
  
    //   u.color = selectedColor.value;
      u.colorStack.push(selectedColor);
    //   u.numOfPaints++;
      draw.push(u);
  
      for (let a = -1; a <= 1; a++) {
        let n;
        if (a == 0) continue;
        if (u.j + a >= 0 && u.j + a < CANVAS_SIZE) {
          n = pixels[u.i][u.j + a];
          if (n) {
            if (canVisitNeighbor(n, visited, startColor)) {
              visited[n.id] = true;
              queue.push(n);
            }
          }
        }
  
        if (u.i + a >= 0 && u.i + a < CANVAS_SIZE) {
          n = pixels[u.i + a][u.j];
          if (n) {
            if (canVisitNeighbor(n, visited, startColor)) {
              visited[n.id] = true;
              queue.push(n);
            }
          }
        }
      }
    }
  }
  
  function canVisitNeighbor(neighbor : Pixel, visited : boolean[], startColor : string) {
    return visited[neighbor.id] === false && (neighbor.colorStack.top() === startColor || (BG_COLORS.includes(startColor) && neighbor.colorStack.isEmpty()));
}


  