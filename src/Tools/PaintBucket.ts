import Mouse from "../Scene/Mouse";
import Scene from "../Scene/Scene";
import { Pixel } from "../types";

export const PaintBucket = (scene : Scene,
    mouse : Mouse,
    pixel_size : number,
    display_size : number,
     ctx : CanvasRenderingContext2D,
      currentScale : number,
      penSize : number,
      CANVAS_SIZE : number,
      selectedColor : string) => {
    if (!mouse.isPressed) return [];
  
    const draw : Pixel[] = [];
  
    const [x,y] = mouse.toWorldCoordinates(currentScale);
  
    if (x > pixel_size * display_size || x < 0 || y > pixel_size * display_size || y < 0) return [];
  
    let pixel : Pixel | null = null;
    let flag = false;
    // let idxi, idxj;
    for (let i = 0; i < scene.pixels.length; i++) {
      if (flag) break;
      for (let j = 0; j < scene.pixels[i].length; j++) {
        if (x >= scene.pixels[i][j].x1 && x < scene.pixels[i][j].x1 + penSize && y >= scene.pixels[i][j].y1 && y < scene.pixels[i][j].y1 + penSize) {
          pixel = scene.pixels[i][j];
        //   idxi = i;
        //   idxj = j;
          flag = true;
          break;
        }
      }
    }
  
    if (pixel != null) {
      //fillSpace(scene.pixels, pixel, selectedColor, pixel.colorStack.top() || pixel.bgColor, pixel_size, display_size, penSize, ctx, draw, CANVAS_SIZE);
      const numPixels = display_size * display_size + 1;
      const visited : boolean[] = [];
      for (let i = 0; i <= numPixels; i++) visited.push(false);
      bfs(scene.pixels, pixel, visited, selectedColor, pixel.colorStack.top() || pixel.bgColor, penSize, display_size, pixel_size, ctx, draw, CANVAS_SIZE);

    }
  
    return draw;
  }


//   function fillSpace(pixels : Pixel[][],
//      start : Pixel, 
//      selectedColor : string,
//       startColor : string, 
//       pixel_size : number,
//        display_size : number, 
//        penSize :number,
//         ctx : CanvasRenderingContext2D,
//          draw : Pixel[],
//           CANVAS_SIZE : number) {
//     //fill a closed space with the choosen color at once (that paint bucket functionality)
//     //using BFS
//     const numPixels = display_size * display_size + 1;
//     const visited : boolean[] = [];
//     for (let i = 0; i <= numPixels; i++) visited.push(false);
//     //dfs(scene.pixels,start,visited,selectedColor,startColor,penSize,display_size,pixel_size,c,draw);
//     bfs(pixels, start, visited, selectedColor, startColor, penSize, display_size, pixel_size, c, draw, CANVAS_SIZE);
//     console.log(count);
//   }
  


function canVisitNeighbor(neighbor : Pixel, visited : boolean[], startColor : string) {
    return visited[neighbor.id] === false && (neighbor.colorStack.top() === startColor || neighbor.colorStack.isEmpty());
  }
  
  let count = 0;
  
  function bfs(pixels : Pixel[][], 
    u : Pixel,
     visited : boolean[],
      selectedColor : string,
       startColor : string,
        penSize : number,
         display_size : number,
          pixel_size : number,
           ctx : CanvasRenderingContext2D, 
           draw : Pixel[],
            CANVAS_SIZE : number) {

    visited[u.id] = true;
    // ctx.fillStyle = selectedColor.value;
    // ctx.fillRect(u.x1,u.y1,penSize,penSize);
  
    // u.color = selectedColor.value;
    // u.colorStack.push(selectedColor.value);
    // u.numOfPaints++;
  
    // draw.push(u);
    const queue : Pixel[] = [];
    queue.push(u);
    while (queue.length > 0) {
      u = queue.shift()!;
      count++;
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
  


  