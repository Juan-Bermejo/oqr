import { User } from './user';
import { Location } from './location';

export class Offer {

    
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
        this.sellers= new Array<string>();
        this.locations= new Array<Location>();
    }

}
