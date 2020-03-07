import { Offer } from './offer';
import { Location } from './location';


export class User {
    id:string;
    name: string;
    last_name:string;
    email: string;
    password: string;
    phone: number;
    role: string;
    offers: Offer[];
    locations: Location[];
    billing_information:any;


    constructor(){
        this.locations= new Array<Location>();
    }
}
