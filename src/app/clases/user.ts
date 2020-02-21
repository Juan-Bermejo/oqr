import { Offer } from './offer';


export class User {
    id:number;
    name: string;
    last_name:string;
    email: string;
    password: string;
    phone: number;
    role: string;
    offers: Offer[];
    billing_information:any;


}
