import { Component, ViewChild, OnInit, Input, AfterViewInit, OnChanges, SimpleChanges, ɵConsole } from '@angular/core';
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
import { InputCodeInfluencerComponent } from '../componentes/input-code-influencer/input-code-influencer.component';
import { LoginComponent } from '../componentes/login/login.component';
import { ZBar, ZBarOptions } from '@ionic-native/zbar/ngx';
import { ActivatedRoute } from '@angular/router';
import { RangoComponent } from '../componentes/rango/rango.component';
import { LocationService } from '../services/location.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {


  public event: Event;
  habilitado: number = 1;
  lng: number;
  lat: number;
  myAddress: string;
  longitude: number;
  latitude: number;
  user_id: string = '';
  offer_list:Array<Offer>;
  aux_offer_list: any[] = [];
  busqueda:string;
  notification:boolean=false;
  search_tool:boolean;
  logged:boolean;
  category:string;
  location_data: any;
  is_logged:boolean= false;
  rango: number = 20;
  loading = "cargando"

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
  
   nombres:Array<string>;

  constructor(private prodSrv:ProductsService,
    private zbar: ZBar,
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
     private tokenServ: TokenService,
     private router :Router,
     private locationServ: LocationService
    ) {     

      this.dbService.getLogged$().subscribe((data)=>
    {
      this.is_logged = data;
    })
      this.nombres= new Array<string>();
  
      this.search_tool=false;
     // this.aux_offer_list= new Array();

   
      this.search_tool=false;
      
      //this.aux_offer_list=this.offer_list;

      

      
 
  }

 async ngOnInit() {

  this.loading= "cargando";

  this.setLocation();

  this.recargarOffer(this.event, 1);
 // navigator.geolocation.getCurrentPosition(position => {
    //  this.current_longitude = position.coords.latitude;
    //  this.current_latitude = position.coords.longitude;

     //this.getGeoCoderAddress(position.coords.latitude, position.coords.longitude);
   

    //  })
      

/*
    this.dbService.getAllOffers().subscribe((data:any)=>{
      this.offer_list=data;
      this.aux_offer_list= this.offer_list;
      console.log(this.offer_list);
      this.offer_list.map((o)=>
    {
      if(o.offer_name=="Precio")
    {
      this.nombres.push(o.products_id[0]);
    }
    else{
      this.nombres.push("array de productos");
    }
     
    })
    })*/
  }


getAllOffers( event?, pull: boolean = false )
{
  
this.dbService.getAllOffers(pull).toPromise()
.then((offerData:any)=>
{
console.log(offerData);
  if(offerData.ok)
  {
    this.aux_offer_list.push(...offerData.offers);
    this.loading = "ok";

    console.log(this.aux_offer_list)

    if (event) {
      event.target.complete();
    }

    if(offerData.length === 0)
    {
      this.habilitado = 0;
    }
  }
})
}

setLocation()
{
  this.geolocation.getCurrentPosition().then((resp) => {

    this.latitude=resp.coords.latitude;
    this.longitude=resp.coords.longitude;
    
    //this.addMarker(this.latitude, this.longitude);
this.getGeoCoderAddress(this.latitude, this.longitude, 2);

   }).catch((error) => {
     console.log('Error getting location', error);
   });
}

  


  ionViewWillEnter(){
    

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

    //this.getGeoLocation();

    
   



    
    localStorage.setItem("user_data", JSON.stringify(this.tokenServ.GetPayLoad().usuario));
    
  }

  loadPageOffer(event?, pull: boolean = false )
  {

    

    this.dbService.nearOffers( this.location_data.town, this.location_data.suburb, pull
    ).subscribe(responde=>
  {
    console.log(responde)
    if(responde)
    {
      this.aux_offer_list.push(...responde.offers);
      this.loading = "ok";

      console.log(this.aux_offer_list)
  
      if (event) {
        event.target.complete();
      }
  
      if(responde.length === 0)
      {
        this.habilitado = 0;
      }
    }

  })
  }

  recargarOffer(event, habilitado) {

    
    if(habilitado == 1)
    {
      this.getAllOffers(event, true)
    }
    if(habilitado == 2)
    {
      this.loadPageOffer(event, true);
    }

    this.aux_offer_list= [];
   
    this.habilitado = habilitado;

    console.log(this.habilitado)
    //this.aux_offer_list= [];
  }

  getGeoCoderAddress(lat:number, long:number, habilitado)
  {
     this.locationServ.reverse(lat, long).toPromise()
    .then((result:any) =>{ 

      this.location_data= result.address;

      // this.myAddress=result[0].thoroughfare + " " + result[0].subThoroughfare +", "+ result[0].locality
      // +", "+result[0].countryName;

      localStorage.setItem("location_data", JSON.stringify(this.location_data));
     
     // this.recargarOffer(this.event, habilitado);

    })
    .catch((error: any) => console.log(error));
  }



  getGeoLocation()
{
  this.geolocation.getCurrentPosition().then((resp) => {

    this.latitude=resp.coords.latitude;
    this.longitude=resp.coords.longitude;
    
    //this.addMarker(this.latitude, this.longitude);
this.getGeoCoderAddress(this.latitude, this.longitude, true) ;

   }).catch((error) => {
     console.log('Error getting location', error);
   });
}

async inputInfluecerCode()
{
  const modal = await this.modalController.create({
    component: InputCodeInfluencerComponent,
    cssClass:"modal"
    
  });
   modal.present();

   modal.onDidDismiss().then((data)=>{

     
    
  })

}

async goToLogin()
{
  const modal = await this.modalController.create({
    component: LoginComponent,
    cssClass:"modal"
    
  });
   modal.present();

   modal.onDidDismiss().then((data)=>{

     
    
  })

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
  getProd(id:string)
  {
    this.dbService.getProduct(id).toPromise().then((data:any)=>
  {
    
    console.log(data)
    return data;
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
      this.aux_offer_list= await this.offer_list.filter(item => item.category.toLowerCase().includes(key) );
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

   goToOfferDetails(offer)
  {
console.log(offer._id)
 // this.navCtrl.navigateForward(['offer-details/?offer='+offer._id]);
 //this.router.navigateByUrl('offer-details/?offer='+offer._id);
 this.router.navigateByUrl('offer-influencers/' + offer._id);

  
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


  async readBarcode()
  {
 
    let options: ZBarOptions = {
      flash: 'off',
      drawSight: false,
      text_instructions:"Coloque el codigo en el lector.",
      text_title:"Lector de codigo de barras."
      
    }



     this.zbar.scan(options)
   .then(result => {
      console.log(result); // Scanned code
      let sn = result.split("/")[5];
      console.log(sn)
      
      this.dbService.getVendorByName(sn.toString()).toPromise()
      .then((data:any)=>
    {


        this.router.navigateByUrl('seller-shop/' + sn);
       
    })
    .catch((err)=>
  {
    const toast = document.createElement('ion-toast');
    toast.message = 'Código invalido.';
    toast.duration = 3000;
    toast.position = "top";
    document.body.appendChild(toast);
    return toast.present(); 
  })
   })
   .catch((error:any) => {
      console.log(error); // Error message
      const toast = document.createElement('ion-toast');
      toast.message = 'No se pudo leer el código.';
      toast.duration = 3000;
      toast.position = "top";
      document.body.appendChild(toast);
      return toast.present(); 
    })
  
  }


  async rangoDeBusqueda()
  {
    const  rangoModal = await this.modalController.create({
      component: RangoComponent,
      cssClass: "modal-rango"

    })
    rangoModal.present();


    rangoModal.onDidDismiss().then((data)=>{

       
      this.rango = data.data.result.rango
      
    })
  }






}




