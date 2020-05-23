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
    public navCtrl: NavController,
    public paramSrv: NavParamsService,
    private geolocation: Geolocation,
    private dbService: DbService,
    private modalController:ModalController,
    private tokenSrv: TokenService,
    private wrapper: ElementRef, private renderer: Renderer
    ) {
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


    if(this.paramSrv.param)
    {
      this.offer = this.paramSrv.param.offer;
      

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
  
  ionViewDidLoad()
  {
    
  }

  

  ionViewWillEnter(){
  
 /*
    this.map.on('load', async ()=> {
      
      this. layers = this.map.getStyle().layers;
       
      this. labelLayerId;
  
      this.map.addLayer(
      {
      id: '3d-buildings',
      source: 'composite',
      
      "source-layer": 'building',
      filter: ['==', 'extrude', 'true'],
      type: 'fill-extrusion',
      minzoom: 15,
      paint: {
      "fill-extrusion-color":'#aaa',
    
      "fill-extrusion-height": 5,
      "fill-extrusion-base": 3,
      "fill-extrusion-opacity":0.6
      }
      },
      this.labelLayerId
      );
 
      });

      */
  }

  ionViewWillLeave()
  {
    
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
console.log("locationvendor: ",location.vendor_id);
    this.markers.push(
      {
        location: location,
        lat: location.latitude,
         lng: location.longitude,
         address:location.address,
          alpha: 1,
          seller: location.vendor_id,
         // icon: "../../../assets/iconos/User-Blue-icon.png"
        });
  }



  ngOnInit() {
    this.getCurrentPosition();
    console.log("omInit")
  
  }



  async selectMarker(sellerId)
  {
    this.paramSrv.param=
    {
      "offer": JSON.stringify(this.offer) ,
      "seller": sellerId,
    }
    console.log("selected")
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



 async ngAfterViewInit(){

    this.map = new Mapboxgl.Map({
      accessToken:environment.mapBoxKey,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [-58.5733844, -34.6154611],
      zoom: 15.5,
      pitch: 45,
      bearing: -17.6,
      container: 'map',
      antialias: false
      });

      this.map.on('load',async ()=>
    {
      await this.getCurrentPosition();

      this.map.flyTo({
        center: [this.current_latitude, this.current_longitude],
        essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });

        this.map.resize();
      for(let i =0; i <this.markers.length; i++)
      {console.log(this.markers[i])

       const div = window.document.createElement('div');
       div.innerHTML = "<h1>Ir al shop</h1>";
        
    
        div.addEventListener('click',async ()=>
      {
        
        this.selectMarker(this.markers[i].seller)
      })

      let popup = new Mapboxgl.Popup()
              .setDOMContent(div);

      let el = document.createElement('div');
           
      let marker = new Mapboxgl.Marker()
          .setPopup(popup)
          .setLngLat([this.markers[i].lng, this.markers[i].lat])
          .addTo(this.map);

          

            
           
      }


      
    })



  
  }

  getCurrentPosition()
  {
     navigator.geolocation.getCurrentPosition(position => {
      this.current_longitude = position.coords.latitude;
      this.current_latitude = position.coords.longitude;
 
     // this.map.flyTo([this.current_longitude,this.current_latitude])
        })
  }


}





