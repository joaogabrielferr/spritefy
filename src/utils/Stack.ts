export class Stack<T>{

    self : T[];

    constructor(){
        this.self = [];
    }

    push(value : T)
    {
        this.self.push(value);
    }

    pop()
    {
        if(this.self.length > 0)
        {
            this.self.pop();
        }
    }

    top()
    {
        if(this.self.length > 0)
            return this.self[this.self.length - 1];
    }

    isEmpty()
    {
        return this.self.length == 0 ? true : false;  
    }

}