import { Component, OnInit, ViewChild, NgZone, HostListener, Renderer, ElementRef } from '@angular/core';
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
import { Seller } from '../clases/seller';
import { AgmMap, MapsAPILoader, GoogleMapsAPIWrapper } from '@agm/core';



@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.page.html',
  styleUrls: ['./offer-details.page.scss'],
})
export class OfferDetailsPage implements OnInit {


  @ViewChild('AgmMap', {static:false}) AgmMap:AgmMap;


  is_my_offer: boolean= false;
  user:User;
  offer: Offer;
  latitude:number;
  longitude:number;
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
  seller:Seller;
  is_seller:boolean;
  zoom:number;
  influencer_id:string;
  


  constructor(private route: ActivatedRoute, 
    public navCtrl: NavController,
    public paramSrv: NavParamsService,
    private geolocation: Geolocation,
    private dbService: DbService,
    private modalController:ModalController,
    private wrapper: ElementRef, private renderer: Renderer
    ) {
      
    this.getGeoLocation();

     
      this.markers= new Array<{}>();

      this.offerLocations= new Array<Location>();

      this.user= JSON.parse(localStorage.getItem("user_data"))
      
      this.dbService.checkIsVendor(this.user._id).subscribe((data:any)=>
      {
        
        this.seller = data.vendor_data;
        console.log(this.seller)

      })


    if(this.paramSrv.param)
    {
      this.offer = this.paramSrv.param

      if(this.seller)
      {
        console.log(this.seller)
      }
      
        this.dbService.getOfferLocations(this.offer._id).subscribe((dataLoc:any)=>
      { 

       this.offerLocations= dataLoc.locations;
       
       for(let i =0; i< this.offerLocations.length; i++)
       {
         this.addMarker(this.offerLocations[i]);
       }
     
        
      })
    
    }


  }


  ionViewWillEnter(){

  }

  ionViewDidEnter()
  {
   
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
        location: location,
        lat: location.latitude,
         lng: location.longitude,
         address:location.address,
          alpha: 1,
          seller: location.vendor_id,
          icon: "../../../assets/iconos/User-Blue-icon.png"
        });
  }


  

  ngOnInit() {

  }



  async selectMarker(seller)
  {
    this.paramSrv.param=
    {
      "offer": JSON.stringify(this.offer) ,
      "seller": JSON.stringify(seller)
    }
    this.navCtrl.navigateRoot('seller-shop')

  }

  joinOffer()
  {
    this.paramSrv.param=
    {
      "offer":this.offer,
      "seller": this.seller
    }
    this.navCtrl.navigateRoot('asociate-offer');
  }


  change(event)
  {
  
  }
  

  ngAfterViewInit(){

  
  }




}





