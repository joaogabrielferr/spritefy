import { Pixel } from "../types";
import Scene from "./Scene";

//set of algorithms to complete a path given a start and an end point

//algorithm for finding the necessary points to create a close approximation of a straight line between two points
//used in Line tool, also used to close gaps in Pencil tool and eraser tool(mousemove event handler doenst fire fast enough when moving the mouse to fast, leaving some gaps)
export function bresenhamsAlgorithm(scene : Scene,start : Pixel,end : Pixel,pixel_size : number){
        if(!start || !end)return [];
        const path : Pixel[] = [];
        const m = new Map<number,boolean>();

        let x0 = start.x1;
        let y0 = start.y1;
        let x1 = end.x1;
        let y1 = end.y1;

        let dx = Math.abs(x1-x0);
        let dy = Math.abs(y1-y0);
        let sx = (x0 < x1 ? 1 : -1);
        let sy = (y0 < y1 ? 1 : -1);
        let E = dx-dy;
        
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const p = scene.findPixel(x0,y0,pixel_size);
            if(!p)break;
            if(!m.get(p.id))
            {
                path.push(p);
                m.set(p.id,true);
            }

            if ((x0==x1) && (y0==y1)) break;
            let e2 = 2*E;

            if (e2 >-dy) {
                E -=dy; 
                x0+=sx*pixel_size;
            }

            if (e2 < dx) {
                E +=dx; 
                y0+=sy*pixel_size;
            }
        }

        return path;

    }

    //given a start and a end pixel, find all necessary pixels to draw a ractangule box
    export function completeSquare(scene : Scene,start : Pixel,end : Pixel,pixel_size : number){
        
        const path : Pixel[] = [];

        if(start.x1 <= end.x1)
        {
            for(let i = start.x1;i<=end.x1;i+=pixel_size)
            {
                findAndPush(i,start.y1,scene,pixel_size,path);
                findAndPush(i,end.y1,scene,pixel_size,path);
            }
        }

        if(start.x1 > end.x1)
        {
            for(let i = end.x1;i<=start.x1;i+=pixel_size)
            {
                findAndPush(i,start.y1,scene,pixel_size,path);
                findAndPush(i,end.y1,scene,pixel_size,path);
            } 
        }

        if(start.y1 <= end.y1)
        {
            for(let i = start.y1;i<=end.y1;i+=pixel_size)
            {
                findAndPush(start.x1,i,scene,pixel_size,path);
                findAndPush(end.x1,i,scene,pixel_size,path);
            }
        }

        if(start.y1 > end.y1)
        {
            for(let i = end.y1;i<=start.y1;i+=pixel_size)
            {
                findAndPush(start.x1,i,scene,pixel_size,path);
                findAndPush(end.x1,i,scene,pixel_size,path);
            } 
        }


        return path;

    }


    //function to find all necessary points to draw an elipse given its middle point and the major and minor radius
    export function drawElipse(midPoint : Pixel,majorRadius : number,minorRadius : number,scene : Scene,pixel_size : number)
    {

        const path : Pixel[] = [];

        let rx = majorRadius;
        let ry = minorRadius;
        let xc = midPoint.x1;
        let yc = midPoint.y1;
      
        let dx, dy, d1, d2, x, y;
      
        x = 0;
        y = ry;
      
        d1 = (ry * ry) - (rx * rx * ry) + (0.25 * rx * rx);
        dx = 2 * ry * ry * x;
        dy = 2 * rx * rx * y;
      
        while (dx < dy) {
          // Print points based on 4-way symmetry
        findAndPush(x + xc,y+yc,scene,pixel_size,path);
        findAndPush(-x + xc,y+yc,scene,pixel_size,path);
        findAndPush(x + xc,-y+yc,scene,pixel_size,path);
        findAndPush(-x + xc,-y+yc,scene,pixel_size,path);
      
          if (d1 < 0) {
            x++;
            dx = dx + (2 * ry * ry);
            d1 = d1 + dx + (ry * ry);
          } else {
            x++;
            y--;
            dx = dx + (2 * ry * ry);
            dy = dy - (2 * rx * rx);
            d1 = d1 + dx - dy + (ry * ry);
          }
        }
      
        d2 = ((ry * ry) * ((x + 0.5) * (x + 0.5))) + ((rx * rx) * ((y - 1) * (y - 1))) - (rx * rx * ry * ry);
      
        while (y >= 0) {
          // Print points based on 4-way symmetry
        findAndPush(x + xc,y+yc,scene,pixel_size,path);
        findAndPush(-x + xc,y+yc,scene,pixel_size,path);
        findAndPush(x + xc,-y+yc,scene,pixel_size,path);
        findAndPush(-x + xc,-y+yc,scene,pixel_size,path);
      
          if (d2 > 0) {
            y--;
            dy = dy - (2 * rx * rx);
            d2 = d2 + (rx * rx) - dy;
          } else {
            y--;
            x++;
            dx = dx + (2 * ry * ry);
            dy = dy - (2 * rx * rx);
            d2 = d2 + dx - dy + (rx * rx);
          }
        }
      
        return path;


    
    }


    

    function findAndPush(a : number,b : number,scene : Scene,pixel_size : number,path : Pixel[])
    {
        const pixel = scene.findPixel(a,b,pixel_size)
            if(pixel)
            {
                path.push(pixel);
            }
    }