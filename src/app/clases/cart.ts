import { Product } from './product';
import { CartDetail } from './cart-detail';

export class Cart {

    _id:string;
    user_id:string;
    vendor_id:string;
    products:Product[];
    currency:string;
    total:number;
    details:CartDetail[];


    constructor()
    {
        this.total=0;
        this.products= new Array<Product>();
        this.details= new Array<CartDetail>();
    }
}
