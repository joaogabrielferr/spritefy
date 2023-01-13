import { buildPath } from "./BuildPath.js";

export const Pen = (event,eventtype,isMousePressed,lastPixel,PIXEL_SIZE,DISPLAY_SIZE,pixels,c,penSize,selectedColor,currentPixels) => {
    if(!isMousePressed)return;

    const draw = [];

    const bounding = canvas.getBoundingClientRect();
    const x = event.clientX - bounding.left;
    const y = event.clientY - bounding.top;
    if(x > PIXEL_SIZE*DISPLAY_SIZE || x < 0 || y > PIXEL_SIZE*DISPLAY_SIZE || y < 0)return;
    let pixel = null;
    let flag = false;
    let idxi,idxj;
    for(let i = 0;i<pixels.length;i++)
    {
    if(flag)break;
    for(let j = 0;j<pixels[i].length;j++)
    {
    if(x >= pixels[i][j].x1 && x <= pixels[i][j].x2 && y >= pixels[i][j].y1 && y <= pixels[i][j].y2)
    {
        pixel = pixels[i][j];
        idxi = i;
        idxj = j;
        flag = true;
        break;
    }
    }
    }

    //if this pixel is in currentPixels.value, that means it was already painted in the current stroke (user is moving the mouse after clicking one of its buttons and is holding it)
    if(pixel != null && !isPixelAlreadyPaintedInCurrentUserDrawing(pixel,currentPixels))
    {
        //let color;
        console.log("going to paint ",pixel);
        console.log("current pixels:",currentPixels);

            currentPixels.value.push(pixel);
            c.fillStyle = selectedColor.value;

            c.fillRect(pixel.x1,pixel.y1,penSize,penSize);
            
            pixel.color = selectedColor.value;
            pixel.painted = true;
            pixel.numOfPaints++;
            
            draw.push(pixel);

            //coloring neighbor fake pixels based on pen size
            if(penSize == PIXEL_SIZE*2)
            {
                const jp1 = pixel.j + 1 <= DISPLAY_SIZE && pixel.j + 1 >= 0;
                const ip1 = pixel.i + 1 <= DISPLAY_SIZE && pixel.i + 1 >= 0;
                if(jp1)
                {
                    pixels[pixel.i][pixel.j + 1].color = selectedColor.value;
                    pixels[pixel.i][pixel.j + 1].painted = true;
                    pixels[pixel.i][pixel.j + 1].numOfPaints++;
                    draw.push(pixels[pixel.i][pixel.j + 1]);
                }
                if(ip1)
                {
                    pixels[pixel.i + 1][pixel.j].color = selectedColor.value;
                    pixels[pixel.i + 1][pixel.j].painted = true;
                    pixels[pixel.i + 1][pixel.j].numOfPaints++;
                    draw.push(pixels[pixel.i + 1][pixel.j]);
                }
                if(jp1 + ip1)
                {
                    pixels[pixel.i + 1][pixel.j + 1].color = selectedColor.value;
                    pixels[pixel.i + 1][pixel.j + 1].painted = true;
                    pixels[pixel.i + 1][pixel.j + 1].numOfPaints;
                    draw.push(pixels[pixel.i + 1][pixel.j + 1]);
                }
                
            }

            if(penSize == PIXEL_SIZE*3)
            {
                for(let a = 0;a<=2;a++)
                {
                    for(let b = 0;b <= 2;b++)
                    {
                        if(pixel.i + a <= DISPLAY_SIZE && pixel.i + a >= 0 && pixel.j + b <= DISPLAY_SIZE && pixel.j + b >= 0)
                        {
                            pixels[pixel.i + a][pixel.j + b].color = selectedColor.value;
                            pixels[pixel.i + a][pixel.j + b].painted = true;
                            pixels[pixel.i + a][pixel.j + b].numOfPaints++;
                            draw.push(pixels[pixel.i + a][pixel.j + b]);
                        }
                    }
                }
            }

            if(lastPixel.value !== null && isMousePressed && lastPixel.value.id !== pixel.id && eventtype == "mousemove")
            {
                //build path from last pixel to current pixel
                const path = buildPath(pixels,lastPixel,pixel,PIXEL_SIZE);
                for(let p of path)
                {
                    c.fillRect(p.x1,p.y1,penSize,penSize);
                    p.color = selectedColor.value;
                    p.painted = true;
                    p.numOfPaints++;
                    draw.push(p);
                }
            }

            lastPixel.value = pixel;  
            return draw;
    }
}

const isPixelAlreadyPaintedInCurrentUserDrawing = (pixel,currentPixels) =>{

    for(let p of currentPixels.value)
    {
        if(p.id == pixel.id)return true;
    }

    return false;

}   
