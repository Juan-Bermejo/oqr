export class Cart {

    _id:string;
    user_id:string;
    vendor_id:string;
    products:string[];
    currency:string;
    total:number;


    constructor()
    {
        this.total=0;
        this.products= new Array<string>();
    }
}
