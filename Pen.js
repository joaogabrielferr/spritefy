import { buildPath } from "./BuildPath.js";

export const Pen = (event,eventtype,isMousePressed,lastPixel,PIXEL_SIZE,DISPLAY_SIZE,pixels,c,penSize,selectedColor) => {
    if(!isMousePressed)return;
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

    if(pixel != null)
    {
        //let color;

        
            // color = [0, 0, 0, 1];
            //color = "#000000";
            // c.fillStyle = "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", " + color[3] + ")";
            c.fillStyle = selectedColor.value;

            c.fillRect(pixel.x1,pixel.y1,penSize,penSize);
            
            pixel.color = selectedColor.value;
            pixel.painted = true;

            if(penSize == 20)
            {
                const jp1 = pixel.j + 1 <= DISPLAY_SIZE && pixel.j + 1 >= 0;
                const ip1 = pixel.i + 1 <= DISPLAY_SIZE && pixel.i + 1 >= 0;
                if(jp1)
                {
                    pixels[pixel.i][pixel.j + 1].color = selectedColor.value;
                    pixels[pixel.i][pixel.j + 1].painted = true;
                }
                if(ip1)
                {
                    pixels[pixel.i + 1][pixel.j].color = selectedColor.value;
                    pixels[pixel.i + 1][pixel.j].painted = true;
                }
                if(jp1 + ip1)
                {
                    pixels[pixel.i + 1][pixel.j + 1].color = selectedColor.value;
                    pixels[pixel.i + 1][pixel.j + 1].painted = true;
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
                }
            }

            lastPixel.value = pixel;  
        
    }
}
