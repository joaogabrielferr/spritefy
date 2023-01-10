function canVisitNeighbor(neighbor,visited,startColor)
{
    // return visited[neighbor.id] === false && neighbor.r == startColor[0] && neighbor.g == startColor[1] && neighbor.b == startColor[2];
    return visited[neighbor.id] === false && neighbor.color === startColor;
}

function dfs(pixels,u,visited,selectedColor,startColor,penSize,DISPLAY_SIZE,PIXEL_SIZE,c){

    visited[u.id] = true;
    // c.fillStyle = "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", " + color[3] + ")";
    c.fillStyle = selectedColor.value;
    c.fillRect(u.x1,u.y1,penSize,penSize);
    // u.r = color[0];
    // u.g = color[1];
    // u.b = color[2];
    // u.a = color[3];
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
    //fill a closed space with the choosen color at once (that paint bucket functionaly)
    //using DFS
    const numPixels = DISPLAY_SIZE*DISPLAY_SIZE + 1;
    const visited = [];
    for(let i = 0;i<=numPixels;i++)visited.push(false);
    dfs(pixels,start,visited,selectedColor,startColor,penSize,DISPLAY_SIZE,PIXEL_SIZE,c);

}

export {fillSpace};