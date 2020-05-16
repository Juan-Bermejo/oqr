import { Message } from './message';
import { User } from './user';

export class Chat {
    
    _id:string;
    participants: User[];
    timestamp:number;
    messages: Message[];

    constructor()
    {
        this.timestamp = Date.now();
        this.participants = new Array<User>();
        this.messages = new Array<Message>();
    }

}
