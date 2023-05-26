import { IEventBus, Subscription, Subscriber } from "./types";

//for triggering events from unrelated components
export class EventBus implements IEventBus {

    private static instance? : EventBus;
    
    private subscribers: Subscriber;
    private static nextId = 0;


    constructor() {
      this.subscribers = {};
    }

    public static getInstance(){
        if(!EventBus.instance)
        {
            EventBus.instance = new EventBus();
        }

        return EventBus.instance;
    }


    public publish<T>(event: string, arg?: T): void {
      const subscriber = this.subscribers[event];
  
      if (!subscriber) {
        return;
      }
  
      Object.keys(subscriber).forEach((id) => subscriber[id](arg));
    }
  
    public subscribe(event: string, callback: ()=> void): Subscription {
      const id = this.getNextId();
      if (!this.subscribers[event]) this.subscribers[event] = {};
  
      this.subscribers[event][id] = callback;
  
      return {
        unsubscribe: () => {
          delete this.subscribers[event][id];
          if (Object.keys(this.subscribers[event]).length === 0)
            delete this.subscribers[event];
        },
      };
    }
  
    private getNextId(): number {
      return EventBus.nextId++;
    }
  }