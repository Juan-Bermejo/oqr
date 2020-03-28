import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ModalController } from '@ionic/angular';
import { NavParamsService } from '../services/nav-params.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Product } from '../clases/product';
import { User } from '../clases/user';
import { Location } from '../clases/location';
import { Offer } from '../clases/offer';
import { DbService } from '../services/db.service';
import { SellerShopPage } from '../seller-shop/seller-shop.page';

@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.page.html',
  styleUrls: ['./offer-details.page.scss'],
})
export class OfferDetailsPage implements OnInit {

  user:User;
  offer: Offer;
  latitude = -28.68352;
  longitude = -147.20785;
  mapType = 'roadmap';

  selectedMarker;
  markers: Array<{}>;
  myLatLng;
  myLat;
  mylong;
  array_products: Product[];
  offerLocations:Location[];
  offer_sellers:string[];
  my_offer:boolean=true;


  constructor(private route: ActivatedRoute, 
    public navCtrl: NavController,
    public paramSrv: NavParamsService,
    private geolocation: Geolocation,
    private dbService: DbService,
    private modalController:ModalController) {

this.user= JSON.parse(localStorage.getItem("user_data"))
  this.markers= new Array<{}>();

this.offerLocations= new Array<Location>();

    if(this.paramSrv.param)
    {
      this.offer = this.paramSrv.param;

     
      
        this.dbService.getOfferLocations(this.offer._id).subscribe((dataLoc:any)=>
      { console.log(dataLoc);
        dataLoc.locations.forEach(location => {
          console.log(location);
          this.addMarker(location);
        });
     
      /* this.offerLocations.forEach((location:Location)=>
      {
        this.addMarker(location);
      })*/
        
      })
    
    }


  }

  getGeoLocation()
  {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.myLat=resp.coords.latitude;
      this.mylong= resp.coords.longitude;
      this.latitude=this.myLat;
      this.longitude=this.mylong;
      //this.addMarker(this.latitude, this.longitude);
      this.myLatLng={ lat:this.latitude, lng:this.longitude };
      
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }


  addMarker(location:Location) {
    this.markers.push(
      {
        lat: location.latitude,
         lng: location.longitude,
         address:location.address,
          alpha: 1,
          user: location.vendor_id,
          icon: "../../../assets/iconos/User-Blue-icon.png"
        });
  }
  

  ngOnInit() {

    this.getGeoLocation();

 
  }



  async selectMarker(seller)
  {
    console.log(seller)
     let modal = await this.modalController.create({
      component: SellerShopPage,
      cssClass:"modal",
      componentProps:
      {
        "seller": JSON.stringify(seller)
      }
      
    });
     modal.present();

     modal.onDidDismiss()
  }


}
