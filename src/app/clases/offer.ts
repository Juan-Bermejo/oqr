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

    constructor()
    {
        this.sellers= new Array<string>();
        this.locations= new Array<Location>();
    }

}
