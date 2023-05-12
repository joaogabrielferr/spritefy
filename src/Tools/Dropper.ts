import Mouse from "../Scene/Mouse";
import Scene from "../Scene/Scene";
import { Pixel } from "../types";

//return the color of a pixel
export function Dropper(scene : Scene,mouse : Mouse,currentScale : number,pixel_size : number){

    const [x,y] = mouse.toWorldCoordinates(currentScale);

    let pixel : Pixel | null = scene.findPixel(x,y,pixel_size);

    if(!pixel)return null;

    return pixel.colorStack.top();

}