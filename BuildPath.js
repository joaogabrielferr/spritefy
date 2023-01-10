export function buildPath(pixels,start,end,PIXEL_SIZE){
    //function to fill in the gaps left after a fast pen stroke because aparently mousemove event doesnt fire fast enough when moving the mouse tooo fast
    if(!start.value || !end)return;
    const path = [];

    let curr = start.value;
    // console.log("BUILDING PATH:");
    while(curr.id != end.id)
    {
        // console.log("curr:",curr);
        if(curr.id != start.value.id)
            path.push(curr);
        //if same row
        if(curr.i == end.i)
        {
            if(curr.j > end.j)
            {
                // console.log(pixels[curr.i/PIXEL_SIZE][curr.j/PIXEL_SIZE]);

                curr = pixels[curr.i][(curr.j - 1)];
            }else
            {
                // console.log(pixels[curr.i][curr.j]);

                curr = pixels[curr.i][(curr.j + 1)];
            }
            continue;
        }
        //if same column
        if(curr.j == end.j)
        {
            if(curr.i > end.i)
            {
                // console.log(pixels[curr.i][curr.j]);

                curr = pixels[(curr.i - 1)][curr.j];
            }else
            {
                // console.log(pixels[curr.i][curr.j]);
                curr = pixels[(curr.i + 1)][curr.j];
            }
            continue;
        }
        
        //going top left
        if(curr.i > end.i && curr.j > end.j)
        {
            // console.log(pixels[curr.i][curr.j]);

            curr = pixels[(curr.i - 1)][(curr.j - 1)];
        }else
        //going bottom left
        if(curr.i < end.i && curr.j > end.j)
        {
            // console.log(pixels[curr.i][curr.j]);

            curr = pixels[(curr.i + 1)][(curr.j - 1)];
        }else 
        //going top right
        if(curr.i > end.i && curr.j < end.j)
        {
            // console.log(pixels[curr.i][curr.j]);

            curr = pixels[(curr.i - 1)][(curr.j + 1)];
        }else
        //going bottom right
        if(curr.i < end.i && curr.j < end.j)
        {
            // console.log(pixels[curr.i][curr.j]);

            curr = pixels[(curr.i + 1)][(curr.j + 1)];
        }
        
    }

    return path;

}