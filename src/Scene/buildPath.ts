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

    //given a start and a end pixel, find all necessary pixels to draw a square box
    //used for square box tool
    export function completeSquare(scene : Scene,start : Pixel,end : Pixel,pixel_size : number){
        
        const path : Pixel[] = [];

        function findAndPush(a : number,b : number)
        {
            const pixel = scene.findPixel(a,b,pixel_size)
                if(pixel)
                {
                    path.push(pixel);
                }
        }


        if(start.x1 <= end.x1)
        {
            for(let i = start.x1;i<=end.x1;i+=pixel_size)
            {
                findAndPush(i,start.y1);
                findAndPush(i,end.y1);
            }
        }

        if(start.x1 > end.x1)
        {
            for(let i = end.x1;i<=start.x1;i+=pixel_size)
            {
                findAndPush(i,start.y1);
                findAndPush(i,end.y1);
            } 
        }

        if(start.y1 <= end.y1)
        {
            for(let i = start.y1;i<=end.y1;i+=pixel_size)
            {
                findAndPush(start.x1,i);
                findAndPush(end.x1,i);
            }
        }

        if(start.y1 > end.y1)
        {
            for(let i = end.y1;i<=start.y1;i+=pixel_size)
            {
                findAndPush(start.x1,i);
                findAndPush(end.x1,i);
            } 
        }


        return path;

    }