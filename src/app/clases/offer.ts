import { User } from './user';

export class Offer {

    id: number;
    product: string;
    price: number;
    stock: number;
    commission: number;
    category: string;
    sellers: User;
    locations: Location[];
    is_active:boolean;
    


}
