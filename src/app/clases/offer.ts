import { User } from './user';
import { Location } from './location';
import { PostLink } from './post-link';

export class Offer {

    _id:string;
    product: string;
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
    is_active:boolean;

    constructor()
    {
        this.posts= new Array<PostLink>();
        this.sellers= new Array<string>();
        this.locations= new Array<Location>();
    }
    
    public addSeller(sellerId)
    {
        this.sellers.push(sellerId);
        this.sellers_cuantity= this.sellers.length;
    }



}
