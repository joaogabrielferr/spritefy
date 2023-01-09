
function buildPath(pixels,start,end,PIXEL_SIZE){
    //function to fill in the gaps left after a fast pen stroke because aparently mousemove event doesnt fire fast enough when moving the mouse tooo fast
    if(!start || !end)return;
    const path = [];

    let curr = start;
    // console.log("BUILDING PATH:");
    while(curr.id != end.id)
    {
        // console.log("curr:",curr);
        if(curr.id != start.id)
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



window.addEventListener("load",()=>{
    
    const PIXEL_SIZE = 10;
    const DISPLAY_SIZE = 64; 

    let isMousePressed = false;
    let painting = true;
    let erasing = false;

    let penSize = PIXEL_SIZE;

    const canvas = document.getElementById("canvas");
    const c = canvas.getContext("2d");
    // canvas.width = 1000;
    // canvas.height = 1000;


    canvas.width = DISPLAY_SIZE*PIXEL_SIZE;
    canvas.height = DISPLAY_SIZE*PIXEL_SIZE;

    const bgcanvas = document.getElementById("bgcanvas");
    const bgc = bgcanvas.getContext("2d");

    var background = new Image();
    background.src = "https://img.freepik.com/premium-vector/fake-transparent-background-16x9_268803-36.jpg?w=2000";

    background.onload = () =>{
        bgc.drawImage(background,0,0);
    };

    // c.clearRect(0, 0, window.innerWidth,window.innerHeight);

    // c.fillStyle = 'rgba(0,0,0,0.5)';
    // c.fillRect(0,0,window.innerWidth,window.innerHeight);


    const pixels = [];
    let pixelID = 0;
    let idxi = 0,idxj = 0;
    for(let i = 0;i<=DISPLAY_SIZE*PIXEL_SIZE;i+=PIXEL_SIZE)
    {
        const row = [];
        // console.log("i:",idxi);
        for(let j = 0;j<=DISPLAY_SIZE*PIXEL_SIZE;j+=PIXEL_SIZE)
        {
            // console.log("j:",idxj);
            let x1 = i;
            let y1 = j;
            let x2 = i + PIXEL_SIZE;
            let y2 = j + PIXEL_SIZE;
            const pixel = {
                x1 : x1,
                y1 : y1,
                x2 : x2,
                y2 : y2,
                r : 0,
                g : 0,
                b : 0,
                a : 0,
                painted : false,
                id : pixelID++,
                i : idxi,
                j : idxj
            }
            row.push(pixel);
            idxj++;
        }
        idxi++;
        idxj = 0;
        pixels.push(row);
    }
    console.log(pixels);
     console.log("especific one:",pixels[30][31]);

    c.willReadFrequently = true;

    // let id = c.createImageData(1,1);
    // let d = id.data;

    // console.log("canvas:",canvas);
    // console.log("context:",c);


    const botao = document.getElementById("button");

    botao.addEventListener('click',()=>{
        let downloadLink = document.createElement('a');
        downloadLink.setAttribute('download', 'pixelart(not realy).png');
        let dataURL = canvas.toDataURL('image/png');
        let url = dataURL.replace(/^data:image\/png/,'data:application/octet-stream');
        downloadLink.setAttribute('href', url);
        downloadLink.click();
    });

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
      }

    
    let lastPixel = null;

    const paint = (event,eventtype) => {
        if(!isMousePressed)return;
        const bounding = canvas.getBoundingClientRect();
        const x = event.clientX - bounding.left;
        const y = event.clientY - bounding.top;
        //const pixel = c.getImageData(x, y, 1, 1);
        //const data = pixel.data;
        if(x > 1280 || x < 0 || y > 1280 || x < 0)return;
        //console.log("last pixel:",lastPixel);
        //console.log("current pixel:",x,y);
        //return;
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
                    //lastPixel = pixel;
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
            // console.log("last pixel:",lastPixel);
            // console.log("current pixel:",pixel);
            //console.log("meu pixel:",pixel);
            // let color = [51, 102, 255, 255];
            // console.log(event.button);
            let color;
            //console.log("painting:",painting);
            //console.log("erasing:",erasing);
            if(painting)
            {
                color = [0, 0, 0, 1];
                c.fillStyle = "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", " + color[3] + ")";
                //c.fillStyle = "rgba(" + getRandomInt(0,256) + ", " + getRandomInt(0,256) + ", " + getRandomInt(0,256) + ", " + getRandomInt(0,256) + ")";
                // c.fillRect(pixel.x1,pixel.y1,PIXEL_SIZE,PIXEL_SIZE);
                c.fillRect(pixel.x1,pixel.y1,penSize,penSize);
                pixel.r = color[0];
                pixel.g = color[1];
                pixel.b = color[2];
                pixel.a = color[3];
                
                
                if(lastPixel !== null && isMousePressed && lastPixel.id !== pixel.id && eventtype == "mousemove")
                {
                    //build path from last pixel to current pixel
                    const path = buildPath(pixels,lastPixel,pixel,PIXEL_SIZE);
                    // console.log(path);
                    for(let p of path)
                    {
                        //c.fillStyle = "rgba(" + 177 + ", " + 150 + ", " + 70 + ", " + 1 + ")";
                        c.fillRect(p.x1,p.y1,penSize,penSize);
                        p.r = color[0];
                        p.g = color[1];
                        p.b = color[2];
                        p.a = color[3];
                    }
                }
                
                lastPixel = pixel;
                
                

            }else if(erasing)
            {
                c.clearRect(pixel.x1,pixel.y1,penSize,penSize);
                pixel.r = 0;
                pixel.g = 0;
                pixel.b = 0;
                pixel.a = 0;
            }
           // console.log(pixels[idxi][idxj]);
        }
        // let pixel;
        // let flag = false;
        // for(let i = 0;i<pixels.length;i++)
        // {
        //     if(flag)break;
        //     for(let j = 0;j<pixels[i].length;j++){
        //         if(x >= pixels[i][j].x1 && x <= pixels[i][j].x1 + 20 && y >= pixels[i][j].y1 && y <= pixels[i][j].y1 + 20)
        //         {
        //             pixel = pixels[i][j];
        //             flag = true;
        //             break;
        //         }
        //     }
        // }
        
        // console.log("MEU X:",x,"MEU Y:",y);
        // console.log("MEU PIXEL:",pixel);

        // if(pixel != undefined)
        // {
        //     c.fillRect(pixel.x1,pixel.x2,20,20);
        // }
        //(x,y) => (x + 50,y + 50)
        // c.fillRect(x,y,50,50);

        // d[0] = 51;
        // d[1] = 102;
        // d[2] = 255;

        // c.putImageData(id,x,y);

    }



    canvas.addEventListener("mousedown",(event)=>{
        console.log(event.button);
        isMousePressed = true;

        paint(event,"mousedown");
        
    });

    canvas.addEventListener("mouseup",(event)=>{
        isMousePressed = false;
        lastPixel = null;
    });

    document.addEventListener("mousemove",(event)=>{
        paint(event,"mousemove");
    });

    // canvas.addEventListener("mouseenter",(event)=>{
    //     paint(event);
    // });

    document.addEventListener("mouseup",(event)=>{
        isMousePressed = false;
    });

    document.addEventListener("keydown",(event)=>{
        console.log(event.key);
        switch(event.key)
        {
            case 'e':
                painting = false;
                erasing = true;
                break;
            
            case 'p':
                painting = true;
                erasing = false;
                break;

            case '1':
                penSize = PIXEL_SIZE;
                break;
            
            case '2':
                penSize = PIXEL_SIZE*2;
                break;
            
            case '3':
                penSize = PIXEL_SIZE*3;
                break;
            
            default:
                break;
         }
    });

    canvas.oncontextmenu = ()=> {return false};

});