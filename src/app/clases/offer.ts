import { User } from './user';
import { Location } from './location';
import { PostLink } from './post-link';
import { Product } from './product';

export class Offer {

    _id:string;
    data_id: string;
    titulo:string;
    offer_name:string;
    products_id: string[];
    products:any[];
    offer_img;
    kind:string;
    price_currency:string;
    price: number;
    stock: number;
    commission: number;
    currency_commission:string;
    category: string;
    sellers: string[];
    locations: Location[];
    description:string;
    views:number;
    sellers_cuantity:number;
    posts: PostLink[];
    percentage:number;
    time_discount:number;
    is_active:boolean;
    fecha;

    constructor()
    {
        this.posts= new Array<PostLink>();
        this.sellers= new Array<string>();
        this.locations= new Array<Location>();
        this.products_id= new Array<string>();
        this.products = new Array<any>();
    }
    
    public addSeller(sellerId)
    {
        this.sellers.push(sellerId);
        this.sellers_cuantity= this.sellers.length;
    }

    public setPercentage(p:number)
    {
        if(p > 100 || p <= 0)
        {
            return false
        }

        else{

            this.percentage=p;
            return true;
        }
    }



}
