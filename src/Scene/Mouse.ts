export default class Mouse{

    x : number;
    y : number;
    originX : number;
    originY : number;
    isPressed : boolean;
    isLeftButtonClicked : boolean;
    isRightButtonClicked : boolean;
    zoomed : boolean;

    mouseMoveLastPos : {x : number,y : number} | null;

    history : {x : number,y : number}[];

    constructor(){
        this.x = 0;
        this.y = 0;
        this.originX = 0;
        this.originY = 0;
        this.isPressed = false;
        this.isLeftButtonClicked = false;
        this.isRightButtonClicked = false;
        this.zoomed = false;
        this.history = [];
        this.mouseMoveLastPos = null;
    }


    // toWorldCoordinates(currentScale : number)
    // {
    //     let xs = Math.floor((this.x - this.originX) / currentScale);
    //     let ys = Math.floor((this.y - this.originY) / currentScale);
    //     return [xs,ys];
    // }


}