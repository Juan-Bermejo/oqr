import { Component, ViewChild, OnInit, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { ModalController, NavController, MenuController } from '@ionic/angular';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NavigationOptions } from '@ionic/angular/dist/providers/nav-controller';
import { Router, NavigationExtras } from '@angular/router';
import { NavParamsService } from '../services/nav-params.service';
import { ModalCategoriesPage } from '../modals/modal-categories/modal-categories.page';
import { ProductsService } from '../services/products.service';
//import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';
import { DbService } from '../services/db.service';
import { MenuService } from '../services/menu.service';

import { PostLink } from '../clases/post-link';
import { PostService } from '../services/post.service';
import { Offer } from '../clases/offer';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { TokenService } from '../services/token.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {

  myAddress: string;
  longitude: number;
  latitude: number;
  user_id: string = '';
  offer_list;
  aux_offer_list:Array<any>;
  busqueda:string;
  notification:boolean=false;
  search_tool:boolean;
  logged:boolean;
  category:string;
  location_data: NativeGeocoderResult;

  options: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
};

  /* options: StreamingVideoOptions = {
    successCallback: () => { console.log('Video played') },
    errorCallback: (e) => { console.log('Error streaming') },
    orientation: 'landscape',
    shouldAutoClose: true,
    controls: false
  };*/
  
   

  constructor(private prodSrv:ProductsService,
    private streamingMedia: StreamingMedia,
     private modalController: ModalController,
     public navCtrl: NavController,
     private ParamSrv: NavParamsService,
     //private afAuth: AngularFireAuth,
     private authService: AuthService,
     private menu: MenuController,
     private dbService: DbService,
     private menuService: MenuService,
     private geolocation: Geolocation,
     private nativeGeocoder: NativeGeocoder,
     private tokenServ: TokenService
    ) {     

  
      this.search_tool=false;
      this.aux_offer_list= new Array();

      console.log("constructor");
      this.search_tool=false;
      
      this.aux_offer_list=this.offer_list;

 
  }

 async ngOnInit() {
    this.dbService.getAllOffers().subscribe((data)=>{
      this.offer_list=data;
      this.aux_offer_list= this.offer_list;
      console.log(this.offer_list);
    })
  }

  ionViewWillEnter(){
    
   /* if(this.dbService.user_data != null){
      this.dbService.is_logged = true;
      this.logged = true;
    }
    else {
      this.logged = false;
      this.dbService.is_logged = false;
    }*/

    if(localStorage.getItem("token")){
      this.dbService.is_logged = true;
      this.logged = true;
      console.log("logeado")
    }
    else {
      this.logged = false;
      this.dbService.is_logged = false;
    }

    this.menuService.getMenuOpt(this.dbService.is_logged);
    
    localStorage.setItem("user_data", JSON.stringify(this.tokenServ.GetPayLoad().doc));
    
  }


  getGeoCoderAddress(lat:number, long:number)
  {
    return this.nativeGeocoder.reverseGeocode(lat, long, this.options)
    .then((result: NativeGeocoderResult[]) =>{ 
      this.location_data= result[0];
      this.myAddress=result[0].thoroughfare + " " + result[0].subThoroughfare +", "+ result[0].locality
      +", "+result[0].countryName;
     
      this.dbService.nearOffers(this.location_data.locality, this.location_data.subLocality).subscribe((data:any)=>
    { 
  
  console.log(data);
  this.aux_offer_list= data.offers[0];
 /* data.locations.forEach(loc => {
    
  });*/
              
    })

    })
    .catch((error: any) => console.log(error));
  }



  getGeoLocation()
{
  this.geolocation.getCurrentPosition().then((resp) => {

    this.latitude=resp.coords.latitude;
    this.longitude=resp.coords.longitude;
    //this.addMarker(this.latitude, this.longitude);
this.getGeoCoderAddress(this.latitude, this.longitude);

   }).catch((error) => {
     console.log('Error getting location', error);
   });
}



   async categoryFilter() {
     
    const modal = await this.modalController.create({
      component: ModalCategoriesPage,
      cssClass:"modal"
      
    });
     modal.present();

     modal.onDidDismiss().then((data)=>{

       
      this.filterCat(data.data.result.category);
      
    })

  }


  async filterCat(cat:string)
  {
      
        this.aux_offer_list= await this.offer_list.filter(item => item.category.includes(cat) );
    console.log(this.aux_offer_list)
  }



 async filter(input)
  {
    let key = input.detail.value
    
    if(key)
    {
      this.aux_offer_list= await this.offer_list.filter(item => item.product.toLowerCase().includes(key) );
    }
    else
    {
      this.aux_offer_list=this.offer_list;
    }

  }

  async searchTools()
  {
    this.search_tool = !(this.search_tool);
    console.log(this.search_tool);
  }

  async goToOfferDetails(offer)
  {
    
  this.ParamSrv.param=offer
  this.navCtrl.navigateForward(['offer-videos']);
  
  }

  /*openMenu() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }*/


  dismiss() {

    this.modalController.dismiss({
      'dismissed': true
    });
  }

  getCurrentUser() {
    
    /*this.authService.isAuth().subscribe( auth => {
      if (auth){
        this.is_logged = true;
      }
      else {
        this.is_logged = false;
      }
    })*/
  }

  goToLogIn() {
    this.navCtrl.navigateRoot('login');
  }

  logOut() {
   // this.afAuth.auth.signOut();
    
  }






}




