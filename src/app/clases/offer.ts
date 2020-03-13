import { User } from './user';
import { Location } from './location';
import { PostLink } from './post-link';

export class Offer {

    id:string;
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


    // ESTE ES EL ESQUEMA DE LOS PRODUCTOS EN LA BASE DE DATOS 
    /*
    name: {type: String, required: true},
    description: {type: String, required: true},
    category: {type: String, required: true},
    price: {type: Number, required: true},
    stock: {type: Number, required: true},
    registration_date: {type: Date, required: true},
    supplier: [{type: Schema.Types.ObjectId, ref: 'Vendors', required: true, unique: true}],
    publishing: [{type: Schema.Types.ObjectId, ref: 'Users', required: false, unique: true, default: null}]
    */

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
