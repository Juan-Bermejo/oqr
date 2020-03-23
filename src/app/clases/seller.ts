import { User } from './user';

export class Seller extends User {

    cuit:number;
    category;
    products:string[];

    constructor(user:User, cuit="", category="") {

        super(user.name, user.last_name, user.user_name, user.password, user.email,user.phone);
        this.products= new Array<string>();

    }
}
