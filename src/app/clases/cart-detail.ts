export class CartDetail {
    _id:string;
    product_name:string;
    product_id:string;
    offer_id:string;
    price:number
    currency:string;
    quantity:number;

    constructor()
    {
        this.price =0;
        this.quantity = 0;
    }
}

