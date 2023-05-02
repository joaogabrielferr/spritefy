export default class Mouse{

    x : number;
    y : number;
    originX : number;
    originY : number;
    isPressed : boolean;
    zoomed : boolean;

    constructor(){
        this.x = 0;
        this.y = 0;
        this.originX = 0;
        this.originY = 0;
        this.isPressed = false;
        this.zoomed = false;
    }

    toWorldCoordinates(currentScale : number)
    {
        let xs = Math.floor((this.x - this.originX) / currentScale);
        let ys = Math.floor((this.y - this.originX) / currentScale);
        return [xs,ys];
    }


}