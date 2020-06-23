import { Component, OnInit, ViewChild, NgZone, HostListener, Renderer, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ModalController, Platform } from '@ionic/angular';
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
import { environment } from '../../environments/environment';
import * as Mapboxgl from 'mapbox-gl'
import { TokenService } from '../services/token.service';





@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.page.html',
  styleUrls: ['./offer-details.page.scss'],
})

export class OfferDetailsPage implements OnInit {


  
  current_latitude: number;
  current_longitude: number;
  @ViewChild('AgmMap', {static:false}) AgmMap:AgmMap;

  offerId: string;
  map: Mapboxgl.Map;
  marker: Mapboxgl.Marker;
  is_my_offer: boolean= false;
  user:User;
  offer: Offer;
  latitude:number;
  longitude:number;
  mapType = 'roadmap';
  labelLayerId:any;
  layers:any;
  selectedMarker;
  markers: Array<any>;
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
  is_logged:boolean=false;


  constructor(private route: ActivatedRoute, 
    private platform: Platform,
    public navCtrl: NavController,
    public paramSrv: NavParamsService,
    private router :Router,
    private geolocation: Geolocation,
    private dbService: DbService,
    private modalController:ModalController,
    private tokenSrv: TokenService,
    private wrapper: ElementRef, private renderer: Renderer
    ) {
 

      if (document.URL.indexOf("/") > 0) {
        let splitURL = document.URL.split("/");
       console.log("splitUrlLenght: ",splitURL.length);
       console.log("splitUrl: ",splitURL);

       this.offerId = splitURL[5].split("?")[0];
      }
        //this.offerId= this.platform.getQueryParam("offer");
    console.log("offerId: ",this.offerId);
        this.dbService.getOffer(this.offerId).toPromise().then((data:any)=>
      {
        this.offer= data ;
        console.log(data)
      })
    
    this.dbService.getOfferLocations(this.offerId).toPromise().then((dataLoc:any)=>
    { 
     this.offerLocations= dataLoc.locations;
     for(let i =0; i< this.offerLocations.length; i++)
     {
       this.addMarker(this.offerLocations[i]);
     }
    })
      this.getCurrentPosition();
      this.markers= new Array<{}>();

      this.offerLocations= new Array<Location>();
     
      this.dbService.getLogged$().subscribe((logged_check)=>
    {
      this.is_logged=logged_check;
      this.is_logged ? this.user= tokenSrv.GetPayLoad().doc: this.user= null;
      console.log(this.user);
    })

    this.dbService.getIsSeller$().subscribe((data)=>
    {
      this.is_seller= data;
    })
     
   // this.getGeoLocation();


      
     /*   this.dbService.getOfferLocations(this.offer._id).subscribe((dataLoc:any)=>
      { 
       this.offerLocations= dataLoc.locations;
       for(let i =0; i< this.offerLocations.length; i++)
       {
         this.addMarker(this.offerLocations[i]);
       }
      })*/



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
     
console.log("locationvendor: ",location);
this.dbService.getVendorById(location.vendor_id).toPromise().then((data:any)=>
{
  console.log("prueba vendor: ", data)
  this.markers.push(
    {
      location: location,
      lat: location.latitude,
       lng: location.longitude,
       address:location.address,
        alpha: 1,
        sellerName: data.shop_name,
        seller: location.vendor_id,
        img: data.profile_img
       // icon: "../../../assets/iconos/User-Blue-icon.png"
      });
})

  }



  ngOnInit() {
    //this.getCurrentPosition();
    console.log("omInit")
  
  }



  async selectMarker(sellerId)
  {

    console.log("selected: ", this.seller)
    //this.navCtrl.navigateRoot('seller-shop/'+'%3F'+ 'seller'+'%3D'+sellerId+'%26'+'offer'+'%3D'+this.offerId);
    //this.navCtrl.navigateRoot('seller-shop/'+'?'+ 'seller'+'='+sellerId+'&'+'offer'+'='+this.offerId);
   // this.navCtrl.navigateRoot('seller-shop/' + sellerId + '/' + this.offerId);
   //this.router.navigate(['seller-shop',{seller: sellerId, offer: this.offerId}]);
   this.router.navigateByUrl('seller-shop/' + sellerId+'?offer='+this.offerId);

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



    async ngAfterViewInit(){

    /* await navigator.geolocation.getCurrentPosition(position => {
      this.current_longitude = position.coords.latitude;
      this.current_latitude = position.coords.longitude;  
      console.log(" location:", position)
        },
      error=>
    {
      console.log("error location:", error)
    },
  {
  
  }) *///current position

        this.map = new Mapboxgl.Map({
          accessToken:environment.mapBoxKey,
          style: 'mapbox://styles/mapbox/light-v10',
          //center: [this.current_longitude, this.current_latitude],
          center: [-58.5733844, -34.6154611],
          zoom: 15.5,
          pitch: 45,
          bearing: -17.6,
          container: 'map',
          antialias: false
          });

        await this.map.on('load',async ()=>
          {
      
              //this.map.resize();
              
          await  this.markers.forEach(async (m)=>
        {
          console.log(m)
      
             const div = window.document.createElement('div');
             console.log("marker: ",m)
             div.innerHTML = "<img src='"+m.img+"'/>";
              
          
              div.addEventListener('click',async ()=>
            {
              
              this.selectMarker(m.sellerName)
            })
      
            let popup = new Mapboxgl.Popup()
                    .setDOMContent(div);
      
            let el = document.createElement('div');
                 
            let marker = await  new Mapboxgl.Marker()
                .setPopup(popup)
                .setLngLat([m.lng, m.lat])
                .addTo(this.map);
                this.map.resize();
      
        })

        this.map.resize();

       /* this.map.flyTo({
          center: [this.current_latitude, this.current_longitude],
          essential: false // this animation is considered essential with respect to prefers-reduced-motion
          });*/


          })///mapOnload

          await navigator.geolocation.getCurrentPosition(position => {
            this.current_longitude = position.coords.latitude;
            this.current_latitude = position.coords.longitude;  
            console.log(" location:", position)
            this.map.flyTo({
              center: [this.current_latitude, this.current_longitude],
              essential: false // this animation is considered essential with respect to prefers-reduced-motion
              });
              },
            error=>
          {
            console.log("error location:", error)
          },
        {
        
        })



    //this.map.resize();
  }

  async getCurrentPosition()
  {
     navigator.geolocation.getCurrentPosition(position => {
      this.current_longitude = position.coords.latitude;
      this.current_latitude = position.coords.longitude;
 
     // this.map.flyTo([this.current_longitude,this.current_latitude])
        })
  }





    ionViewDidLoad()
  {}
  

  ionViewWillEnter()
  {}

  ionViewWillLeave()
  {}

  ionViewDidEnter()
  {}


}





