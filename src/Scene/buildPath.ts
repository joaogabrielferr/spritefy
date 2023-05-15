import { Pixel } from "../types";
import Scene from "./Scene";

export function buildPath(scene : Scene, pixels : Pixel[][],start : Pixel,end : Pixel,pixel_size : number) : Pixel[]{
    if(!start || !end)return [];
    let path : Pixel[] = [];

    
    return bresenhamsAlgorithm(start,end,scene,pixel_size);
    
    //necessary for the version of bresenhams that kind works
    // const dx = Math.abs(end.x1 - start.x1);
    // const dy = Math.abs(end.y1 - start.y1);
    // if(dx > dy)
    // {
    //     path = bresenhamsAlgorithm(start.x1,start.y1,end.x1,end.y1,dx,dy,false,scene,pixel_size,end.x1,end.y1);
    // }else
    // {
    //     path = bresenhamsAlgorithm(start.y1,start.x1,end.y1,end.x1,dy,dx,true,scene,pixel_size,end.x1,end.y1);
    // }

    // return path;


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
                x0+=sx;
            }

            if (e2 < dx) {
                E +=dx; 
                y0+=sy;
            }
        }

        return path;


        //this is the version that kinda works
        // let pk = 2*dy - dx;
        // for(let i = 0;i<=dx;i++)
        // {
        //     if(x1 >= endx1 && x1 < endx1 + pixel_size && y1 >= endy1 && y1 < endy1 + pixel_size)
        //     {
        //         console.log("chegou no ultimo pixel");
        //         break;
        //     }
        //     x1 < x2 ? x1+=pixel_size : x1-=pixel_size;
        //     if(pk < 0)
        //     {
        //         if(!decide)
        //         {
        //             const pixel = scene.findPixel(x1,y1,pixel_size);
        //             if(!pixel)return path;
                    
        //             if(!m.get(pixel.id))
        //             {
        //                 path.push(pixel);
        //                 // console.log(pixel);
        //                 m.set(pixel.id,true);
        //             }
        //         }else
        //         {
        //             const pixel = scene.findPixel(y1,x1,pixel_size);
        //             if(!pixel)return path;

        //             if(!m.get(pixel.id))
        //             {
        //                 path.push(pixel);
        //                 // console.log(pixel);

        //                 m.set(pixel.id,true);
        //             }
        //         }
        //         pk = pk + 2 * dy; 
        //     }else
        //     {
        //         y1 < y2 ? y1+=pixel_size : y1-=pixel_size;
        //         if(!decide)
        //         {
        //             const pixel = scene.findPixel(x1,y1,pixel_size);
        //             if(!pixel)return path;

        //             if(!m.get(pixel.id))
        //             {
        //                 path.push(pixel);
        //                 // console.log(pixel);

        //                 m.set(pixel.id,true);
        //             }
        //         }else
        //         {
        //             const pixel = scene.findPixel(y1,x1,pixel_size);
        //             if(!pixel)return path;

        //             if(!m.get(pixel.id))
        //             {
        //                 path.push(pixel);
        //                 // // console.log(pixel);

        //                 m.set(pixel.id,true);
        //             }
        //         }
        //         pk = pk + 2*dy - 2*dx;
        //     }
        // }
        // // // console.log(path);
        // return path;

    }