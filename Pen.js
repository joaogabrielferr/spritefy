import { buildPath } from "./BuildPath.js";

export const Pen = (event,eventtype,isMousePressed,lastPixel,PIXEL_SIZE,DISPLAY_SIZE,pixels,c,penSize) => {
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
        let color;

        
            color = [0, 0, 0, 1];
            c.fillStyle = "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", " + color[3] + ")";

            c.fillRect(pixel.x1,pixel.y1,penSize,penSize);
            pixel.r = color[0];
            pixel.g = color[1];
            pixel.b = color[2];
            pixel.a = color[3];

            if(lastPixel.value !== null && isMousePressed && lastPixel.value.id !== pixel.id && eventtype == "mousemove")
            {
                //build path from last pixel to current pixel
                const path = buildPath(pixels,lastPixel,pixel,PIXEL_SIZE);
                for(let p of path)
                {
                    c.fillRect(p.x1,p.y1,penSize,penSize);
                    p.r = color[0];
                    p.g = color[1];
                    p.b = color[2];
                    p.a = color[3];
                }
            }

            lastPixel.value = pixel;  
        
    }
}
