import { Cart } from './cart';
import { User } from './user';
import { Seller } from './seller';

export class Order {
    _id;
    user: User;
    seller: Seller;
    cart : Cart;
    checked: boolean;
    status: string;
    deleted:boolean;
    date_value:number;
    constructor()
    {
        this.cart= new Cart();
    }

    
}
