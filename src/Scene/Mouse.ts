export default class Mouse{

    x : number;
    y : number;
    originX : number;
    originY : number;
    isPressed : boolean;
    zoomed : boolean;

    history : {x : number,y : number}[];

    constructor(){
        this.x = 0;
        this.y = 0;
        this.originX = 0;
        this.originY = 0;
        this.isPressed = false;
        this.zoomed = false;
        this.history = [];
    }

    toWorldCoordinates(currentScale : number)
    {
        let xs = Math.floor((this.x - this.originX) / currentScale);
        let ys = Math.floor((this.y - this.originY) / currentScale);
        return [xs,ys];
    }


}