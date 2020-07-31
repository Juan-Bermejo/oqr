import { User } from './user';
import { Location } from './location';
import { Product } from './product';

export class Seller {

    _id: string;
    shop_name:string;
    currency:string;
    owner:string;
    registration_date:number;
    cuit:number;
    category:string;
    location:Location[];
    products:Product[];
    profile_img;
    delivery;
    banner_img;
    offers:Array<{
        "association_date":number,
        "offer_id":string,
        "offer_products": Product[],
        "price":number,
        "commission":number,
        "stock":number,
        "currency":string,
        "product_image": string
      }>;

    constructor() {
       this.products= new Array<Product>()
       this.location= new Array<Location>();
        // super(user.name, user.last_name, user.user_name, user.password, user.email,user.phone);
        //this.products= new Array<string>();

    }
}
