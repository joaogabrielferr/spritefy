import { Pixel } from "../types";
import Scene from "./Scene";

export function buildPath(scene : Scene,start : Pixel,end : Pixel,pixel_size : number) : Pixel[]{
    if(!start || !end)return [];


    //algorithm for finding the necessary points to create a close approximation of a straight line between two points
    //used in Line tool and in Pencil tool(mousemove event handler doenst fire fast enough when moving the mouse to fast, this algo is used to close the gaps)
    return bresenhamsAlgorithm(start,end,scene,pixel_size);
    


}


function bresenhamsAlgorithm(start : Pixel,end : Pixel,
    scene : Scene,pixel_size : number){
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