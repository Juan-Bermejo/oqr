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


@Component({
  selector: 'app-new-home',
  templateUrl: './new-home.page.html',
  styleUrls: ['./new-home.page.scss'],
})
export class NewHomePage implements OnInit {

  user_id: string = '';
  offer_list;
  aux_offer_list:Array<any>;
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
  offer_sellers:string[];
  my_offer:boolean=true;

   

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
     private geolocation: Geolocation

    ) {     
      localStorage.setItem("user_data", JSON.stringify(this.dbService.user_data));
      this.user= JSON.parse(localStorage.getItem("user_data"));
      this.markers= new Array<{}>();
    
    this.offerLocations= new Array<Location>();
      this.search_tool=false;
      this.aux_offer_list= new Array();
      this.search_tool=false;
      
      this.aux_offer_list=this.offer_list;


        this.dbService.getLocation(this.user._id).subscribe((data:any)=>
      {
        
        this.offerLocations=data.location_data;

        this.offerLocations.forEach(location => {
          console.log(location);
          this.addMarker(location);
        });
      })


 
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
    console.log(this.myLat)
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
        alpha: 1
      });
}

ngOnInit()
{

  this.getGeoLocation();
}







}




