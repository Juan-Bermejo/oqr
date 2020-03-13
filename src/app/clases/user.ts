import { Offer } from './offer';
import { Location } from './location';

export class User {
    id:string;
    name: string;
    last_name:string;
    user_name: string;
    email: string;
    password: string;
    phone: number;
    role: string;
    offers: string[];
    locations: Location[];
    billing_information:any;


    constructor(name='', last_name='', user_name='', password='', email='', phone=0) {

        this.name = name;
        this.last_name = last_name;
        this.user_name = user_name;
        this.password = password;
        this.email = email;
        this.phone = phone;
        this.locations= new Array<Location>();
    }
}

export class UserLogin {
    
    constructor(user_name='', password='') {
        this.user_name;
        this.password;
    }

    user_name: string;
    password: string;
}
