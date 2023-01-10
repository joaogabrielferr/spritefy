function canVisitNeighbor(neighbor,visited,startColor)
{
    return visited[neighbor.id] === false && neighbor.r == startColor[0] && neighbor.g == startColor[1] && neighbor.b == startColor[2];
}

function dfs(pixels,u,visited,color,startColor,penSize,DISPLAY_SIZE,PIXEL_SIZE,c){

    visited[u.id] = true;
    // console.log("olhando ",u.id);
    // console.log("STARTING COLOR:",startColor);
    c.fillStyle = "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", " + color[3] + ")";
    c.fillRect(u.x1,u.y1,penSize,penSize);
    // console.log("pintou ",u.id);
    u.r = color[0];
    u.g = color[1];
    u.b = color[2];
    u.a = color[3];

    for(let a = -1;a<=1;a++)
    {
        let n;
        if(a == 0)continue;
        //console.log(u.i,u.j+1);
        if(u.j + a >= 0 && u.j + a <= DISPLAY_SIZE - 1)
        {
           //console.log("entrou");
            n = pixels[u.i][u.j + a];
            if(n){
                if(canVisitNeighbor(n,visited,startColor))
                {
                    // if(a < 0)console.log("em ",u.id,"foi pra esquerda pra", n.id);
                    // else console.log("em ",u.id,"foi pra direita pra",n.id);
                    dfs(pixels,n,visited,color,startColor,penSize,DISPLAY_SIZE,PIXEL_SIZE,c);
                }
                
            }
        }

        //console.log(u.i + 1,u.j);
        if(u.i + a >= 0 && u.i + a <= DISPLAY_SIZE - 1)
        {
            //console.log("entrou");
            // console.log(u.i + a);
            //console.log(u.i + a,u.j);
            n = pixels[u.i + a][u.j];
            if(n)
            {
                if(canVisitNeighbor(n,visited,startColor))
                {
                    // if(a < 0)console.log("em",u.id,"foi pra baixo",n.id);
                    // else console.log("em",u.id,"foi pra cima",n.id);
                    dfs(pixels,n,visited,color,startColor,penSize,DISPLAY_SIZE,PIXEL_SIZE,c);
                }

            }
        }
    }
}

function fillSpace(pixels,start,color,startColor,PIXEL_SIZE,DISPLAY_SIZE,penSize,c)
{
    //fill a closed space with the choosen color at once (that paint bucket functionaly)
    //using DFS here
    // const numPixels = PIXEL_SIZE*DISPLAY_SIZE*PIXEL_SIZE*DISPLAY_SIZE;
    const numPixels = DISPLAY_SIZE*DISPLAY_SIZE + 1;
    // console.log("num pixels:",numPixels);
    // console.log("color to fill:",color);
    // console.log("starting color:",startColor);
    // console.log("")
    const visited = [];
    for(let i = 0;i<=numPixels;i++)visited.push(false);
    // console.log(visited);

    dfs(pixels,start,visited,color,startColor,penSize,DISPLAY_SIZE,PIXEL_SIZE,c);

}

export {fillSpace};