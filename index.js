
import { Pen } from "./Pen.js";
import { fillSpace } from "./PaintBucket.js";
import { buildPath } from "./BuildPath.js";


//TODO: CREATE A PAINT FUNCTION FOR PEN, ERASER AND PAINT BUCKET AND PUT THEM IN MODULES


let c; //canvas context
let lastPixel = {
    value: null //last pixel painted in the screen
}
const PIXEL_SIZE = 10;
const DISPLAY_SIZE = 64; 

let isMousePressed = false;
let painting = true;
let erasing = false;
let bucket = false;

let penSize = PIXEL_SIZE;


window.addEventListener("load",()=>{
    
    const canvas = document.getElementById("canvas");
    // const c = canvas.getContext("2d");
     c = canvas.getContext("2d");
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
    let pixelID = 1;
    let idxi = 0,idxj = 0;
    for(let i = 0;i<=DISPLAY_SIZE*PIXEL_SIZE - PIXEL_SIZE;i+=PIXEL_SIZE)
    {
        const row = [];
        // console.log("i:",idxi);
        for(let j = 0;j<=DISPLAY_SIZE*PIXEL_SIZE - PIXEL_SIZE;j+=PIXEL_SIZE)
        {
            // console.log("j:",idxj);
            let x1 = i;
            let y1 = j;
            let x2 = i + PIXEL_SIZE;
            let y2 = j + PIXEL_SIZE;
            // console.log(pixelID);
            const pixel = {
                x1 : x1,
                y1 : y1,
                x2 : x2,
                y2 : y2,
                r : 300,
                g : 300,
                b : 300,
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
    console.log(pixels.length);
     console.log("especific one:",pixels[33][14]);

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

    
      
      

      const paint = (event,eventtype) => {
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

            if(painting)
            {
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
                
                lastPixel.value= pixel;
                
                

            }else if(erasing)
            {
                c.clearRect(pixel.x1,pixel.y1,penSize,penSize);
                pixel.r = 300;
                pixel.g = 300;
                pixel.b = 300;
                pixel.a = 0;

                if(lastPixel.value !== null && isMousePressed && lastPixel.value.id !== pixel.id && eventtype == "mousemove")
                    {
                    const path = buildPath(pixels,lastPixel,pixel,PIXEL_SIZE);
                    for(let p of path)
                    {
                        c.clearRect(p.x1,p.y1,penSize,penSize);
                        p.r = 300;
                        p.g = 300;
                        p.b = 300;
                        p.a = 0;
                    }
                }

                lastPixel.value = pixel;

            }else if(bucket)
            {
                console.log("filling space");
                color = [177,150,70,1];
                fillSpace(pixels,pixel,color,[pixel.r,pixel.g,pixel.b,pixel.a],PIXEL_SIZE,DISPLAY_SIZE,penSize,c);
            }
           
        }

    }



    canvas.addEventListener("mousedown",(event)=>{
        console.log(event.button);
        isMousePressed = true;

        if(painting)
            Pen(event,"mousedown",isMousePressed,lastPixel,PIXEL_SIZE,DISPLAY_SIZE,pixels,c,penSize);
        else paint(event,"mousedown");
        
    });

    canvas.addEventListener("mouseup",(event)=>{
        isMousePressed = false;
        lastPixel.value = null;
    });

    document.addEventListener("mousemove",(event)=>{
        if(painting && isMousePressed)
            Pen(event,"mousemove",isMousePressed,lastPixel,PIXEL_SIZE,DISPLAY_SIZE,pixels,c,penSize);
        else paint(event,"mousemove");
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
                bucket = false;
                break;
            
            case 'p':
                painting = true;
                erasing = false;
                bucket = false;
                break;

            case 'b':
                painting = false;
                erasing = false;
                bucket = true;
                break;

            case 'E':
                painting = false;
                erasing = true;
                bucket = false;
                break;

            case 'P':
                painting = true;
                erasing = false;
                bucket = false;
                break;
            
            case 'B':
                painting = false;
                erasing = false;
                bucket = true;
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