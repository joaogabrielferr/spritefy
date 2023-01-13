function canVisitNeighbor(neighbor,visited,startColor)
{
    return visited[neighbor.id] === false && neighbor.color === startColor;
}

function dfs(pixels,u,visited,selectedColor,startColor,penSize,DISPLAY_SIZE,PIXEL_SIZE,c){

    visited[u.id] = true;
    c.fillStyle = selectedColor.value;
    c.fillRect(u.x1,u.y1,penSize,penSize);

    u.color = selectedColor.value;

    for(let a = -1;a<=1;a++)
    {
        let n;
        if(a == 0)continue;
        if(u.j + a >= 0 && u.j + a <= DISPLAY_SIZE - 1)
        {
            n = pixels[u.i][u.j + a];
            if(n){
                if(canVisitNeighbor(n,visited,startColor))
                {
                    dfs(pixels,n,visited,selectedColor,startColor,penSize,DISPLAY_SIZE,PIXEL_SIZE,c);
                }
                
            }
        }

        if(u.i + a >= 0 && u.i + a <= DISPLAY_SIZE - 1)
        {
            n = pixels[u.i + a][u.j];
            if(n)
            {
                if(canVisitNeighbor(n,visited,startColor))
                {
                    dfs(pixels,n,visited,selectedColor,startColor,penSize,DISPLAY_SIZE,PIXEL_SIZE,c);
                }

            }
        }
    }
}

function fillSpace(pixels,start,selectedColor,startColor,PIXEL_SIZE,DISPLAY_SIZE,penSize,c)
{
    //fill a closed space with the choosen color at once (that paint bucket functionality)
    //using DFS
    const numPixels = DISPLAY_SIZE*DISPLAY_SIZE + 1;
    const visited = [];
    for(let i = 0;i<=numPixels;i++)visited.push(false);
    dfs(pixels,start,visited,selectedColor,startColor,penSize,DISPLAY_SIZE,PIXEL_SIZE,c);

}

export const PaintBucket = (event,isMousePressed,selectedColor,PIXEL_SIZE,DISPLAY_SIZE,pixels,defaultPensize,c) => {
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
        fillSpace(pixels,pixel,selectedColor,pixel.color,PIXEL_SIZE,DISPLAY_SIZE,defaultPensize,c); 
    }

}