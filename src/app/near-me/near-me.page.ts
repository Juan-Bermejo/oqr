import { Component, ViewChild, OnInit, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { ModalController, NavController, MenuController } from '@ionic/angular';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';
import { NavigationOptions } from '@ionic/angular/dist/providers/nav-controller';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { NavParamsService } from '../services/nav-params.service';
import { ModalCategoriesPage } from '../modals/modal-categories/modal-categories.page';
import { ProductsService } from '../services/products.service';
//import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';
import { DbService } from '../services/db.service';
import { MenuService } from '../services/menu.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { PostLink } from '../clases/post-link';
import { PostService } from '../services/post.service';
import { Offer } from '../clases/offer';
import { User } from '../clases/user';
import { Product } from '../clases/product';
import { Location } from '../clases/location';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Seller } from '../clases/seller';
import { SellerShopPage } from '../seller-shop/seller-shop.page';

@Component({
  selector: 'app-near-me',
  templateUrl: './near-me.page.html',
  styleUrls: ['./near-me.page.scss'],
})
export class NearMePage implements OnInit {

  location_data: NativeGeocoderResult;
  user_id: string = '';
  busqueda:string;
  notification:boolean=false;
  search_tool:boolean;
  logged:boolean;
  category:string;

  user:User;
  offer: Offer;
  myLat= -28.68352;
  myLong= -147.20785;
  latitude = -28.68352;
  longitude=-28.68352;
  mapType = 'roadmap';
  selectedMarker;
  markers: Array<{}>;
  myLatLng;
  array_products: Product[];
  offerLocations:Location[];
  myAddress:string;

  options: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
};

   

  constructor(private prodSrv:ProductsService,
    private streamingMedia: StreamingMedia,
     private modalController: ModalController,
     public navCtrl: NavController,
     private ParamSrv: NavParamsService,
     private authService: AuthService,
     private menu: MenuController,
     private dbService: DbService,
     private menuService: MenuService,
     private route: ActivatedRoute, 
     public paramSrv: NavParamsService,
     private geolocation: Geolocation,
     private nativeGeocoder: NativeGeocoder,

    ) {     
      localStorage.setItem("user_data", JSON.stringify(this.dbService.user_data));
      this.user= JSON.parse(localStorage.getItem("user_data"));
      this.markers= new Array<{}>();
    
    this.offerLocations= new Array<Location>();
      this.search_tool=false;
      //this.aux_offer_list= new Array();
      this.search_tool=false;
      
     // this.aux_offer_list=this.offer_list;



 
  }



  getGeoCoderAddress(lat:number, long:number)
  {
    return this.nativeGeocoder.reverseGeocode(lat, long, this.options)
    .then((result: NativeGeocoderResult[]) =>{ 
      this.location_data= result[0];
      this.myAddress=result[0].thoroughfare + " " + result[0].subThoroughfare +", "+ result[0].locality
      +", "+result[0].countryName;

      this.dbService.nearOffers(this.location_data.locality, this.location_data.subLocality).subscribe((data:any)=>
{ console.log(data);
  /*data.location_data.forEach(loc => {
    this.addMarker(loc)
  });*/
              
})

    })
    .catch((error: any) => console.log(error));
  }






  ionViewWillEnter(){
    
    if(this.dbService.user_data != null){
      this.dbService.is_logged = true;
      this.logged = true;
    }
    else {
      this.logged = false;
      this.dbService.is_logged = false;
    }

    this.menuService.getMenuOpt(this.dbService.is_logged);

    localStorage.setItem("user_data", JSON.stringify(this.dbService.user_data));
    this.user= JSON.parse(localStorage.getItem("user_data"))
    
  }

   async modalCategory() {
     
    const modal = await this.modalController.create({
      component: ModalCategoriesPage,
      cssClass:"modal"
      
    });
     modal.present();

     modal.onDidDismiss().then((data)=>{
      this.markers= new Array<{}>();
      this.dbService.getVendors(data.data.result.category).subscribe((data_seller:any)=>
      {console.log(data_seller)
        console.log(data.data.result.category);
        if(data_seller.vendor_data)
        {
          data_seller.vendor_data.forEach((seller:Seller) => {
            console.log("seller:",seller);
            this.dbService.getLocation(seller.owner).subscribe((locs:any)=>{
              locs.location_data.forEach(loc => {
                this.addMarker(loc);
              });
              
            })
          });
        }
        else{
          console.log(data_seller);
        }

      })
      
    })

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



  dismiss() {

    this.modalController.dismiss({
      'dismissed': true
    });
  }



  goToLogIn() {
    this.navCtrl.navigateRoot('login');
  }

  logOut() {
   // this.afAuth.auth.signOut();
    
  }


getGeoLocation()
{
  this.geolocation.getCurrentPosition().then((resp) => {
    this.myLat=resp.coords.latitude;
    this.myLong= resp.coords.longitude;
    this.latitude=this.myLat;
    this.longitude=this.myLong;
    //this.addMarker(this.latitude, this.longitude);
    this.myLatLng={ lat:this.myLat, lng:this.myLong };
this.getGeoCoderAddress(this.myLat, this.myLong);
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
        seller: location.vendor_id
    }
      );
      console.log(this.markers)
}



ngOnInit()
{

  this.getGeoLocation();
}






}
