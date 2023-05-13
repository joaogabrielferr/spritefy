import { Pixel } from "../types";

export function buildPath(pixels : Pixel[][],start : Pixel,end : Pixel) : Pixel[]{
    //TODO: Refactor this, the gaps are filled in a "unnatural" way, it should loke like a stroke made by a person
    //function to fill in the gaps left after a fast pen stroke because aparently mousemove event doesnt fire fast enough when moving the mouse tooo fast
    if(!start || !end)return [];
    const path : Pixel[] = [];

    let curr : Pixel = start;
    while(curr.id != end.id)
    {
        if(curr.id != start.id && curr.id != end.id)
            path.push(curr);
        //if same row
        if(curr.i == end.i)
        {
            if(curr.j > end.j)
            {

                curr = pixels[curr.i][(curr.j - 1)];
            }else
            {

                curr = pixels[curr.i][(curr.j + 1)];
            }
            continue;
        }
        //if same column
        if(curr.j == end.j)
        {
            if(curr.i > end.i)
            {

                curr = pixels[(curr.i - 1)][curr.j];
            }else
            {
                curr = pixels[(curr.i + 1)][curr.j];
            }
            continue;
        }
        
        //going top left
        if(curr.i > end.i && curr.j > end.j)
        {

            curr = pixels[(curr.i - 1)][(curr.j - 1)];
        }else
        //going bottom left
        if(curr.i < end.i && curr.j > end.j)
        {

            curr = pixels[(curr.i + 1)][(curr.j - 1)];
        }else 
        //going top right
        if(curr.i > end.i && curr.j < end.j)
        {

            curr = pixels[(curr.i - 1)][(curr.j + 1)];
        }else
        //going bottom right
        if(curr.i < end.i && curr.j < end.j)
        {

            curr = pixels[(curr.i + 1)][(curr.j + 1)];
        }
        
    }
    // if(path.length === 1)
    // {
    //     path[0] = {...path[0]};
    // }
    return path;

}