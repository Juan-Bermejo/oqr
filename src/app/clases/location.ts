export class Location {

    id:string;
    vendor_id:string;
    latitude: number;
    longitude: number;
    address: string;
    country: string;
    province: string;
    city: string;
    subLocality:string;
    location;

    constructor()
    {
        this.location = new Array();
    }
}
