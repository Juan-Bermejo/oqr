import { User } from './user';

export class Offer {

    id: number;
    product: string;
    price: number;
    stock: number;
    commission: number;
    category: string;
    sellers: Array<User>;


     async isPartner(usr_id): Promise<boolean>
    {
        let isPartner = false;

         await this.sellers.forEach(partner => {
             
             if(partner.id ==  usr_id)
             {
                isPartner = true
             }
            
        });

        return isPartner;
    }

}
