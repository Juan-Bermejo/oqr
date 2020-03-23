import { User } from './user';
import { Location } from './location';
import { Product } from './product';

export class Seller {

    _id: string;
    shop_name:string;
    owner:User[];
    cuit:number;
    category:string;
    location:Location[];
    products:Product[];

    constructor() {
        // super(user.name, user.last_name, user.user_name, user.password, user.email,user.phone);
        //this.products= new Array<string>();

    }
}
