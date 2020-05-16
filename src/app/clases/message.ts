import { User } from './user';

export class Message {

    _id: string;
    timestamp: number;
    sender: User;
    recipient: User;
    message: string;
    sent:boolean;
    read:boolean;
}

