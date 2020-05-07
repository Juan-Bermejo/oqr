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





@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.page.html',
  styleUrls: ['./offer-details.page.scss'],
})

export class OfferDetailsPage implements OnInit {


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
       
      /* for(let i =0; i< this.offerLocations.length; i++)
       {
         this.addMarker(this.offerLocations[i]);
       }
     */
        
      })
    
    }


  }
  
  ionViewDidLoad()
  {
    
  }

  

  ionViewWillEnter(){
  
    //this.buildMap();
    this.map.on('load', ()=> {
      
      this. layers = this.map.getStyle().layers;
       
      this. labelLayerId;
     /* for (var i = 0; i < this.layers.length; i++) {
      if (this.layers[i].type === 'symbol' && this.layers[i].layout['text-field']) {
        this.labelLayerId = this.layers[i].id;
      break;
      }
      }*/



       
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
 

      this.map.on('click', 'mark', (e) =>{
       console.log("hola")
        });
      });

     /* this.marker = new Mapboxgl.Marker()
      .setLngLat([-58.3884179, -34.8636133])
      .addTo(this.map);*/
      let amar= [
        {
        long: -58.5084179,
        lat:-34.9636133
        },
        {
          long: -58.6084190,
          lat:-34.6336140
          },
          {
            long: -59.0884220,
            lat:-35.0036180
            },
      ]
      for(let i =0; i <amar.length; i++)
      {
        let m = new Mapboxgl.Marker({
          
          draggable: true,
          
          
          })
          .setLngLat([amar[i].long, amar[i].lat])
          .addTo(this.map);
           
      }
      


   





/*
this.map.on('load', function() {
  // Add a GeoJSON source with 3 points.

  
   
  // Center the map on the coordinates of any clicked symbol from the 'symbols' layer.
  this.map.on('click', 'symbols', function(e) {
  this.map.flyTo({ center: e.features[0].geometry.coordinates });
  });
   
  // Change the cursor to a pointer when the it enters a feature in the 'symbols' layer.
  this.map.on('mouseenter', 'symbols', function() {
  this.map.getCanvas().style.cursor = 'pointer';
  });
   
  // Change it back to a pointer when it leaves.
  this.map.on('mouseleave', 'symbols', function() {
  this.map.getCanvas().style.cursor = '';
  });
  });



*/




















































      
  }

  ionViewWillLeave()
  {
    
  }



  ionViewDidEnter()
  {
    
  }


  addMarkerMapbox()
  {
    let lat:-34.8636133;
    let long:-58.3884179;
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




buildMap()
{
    /*----------------------------- mapa mapbox -----------------------------*/


    this.map = new Mapboxgl.Map({
      accessToken:environment.mapBoxKey,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [-58.3884179, -34.8636133],
      zoom: 15.5,
      pitch: 45,
      bearing: -17.6,
      container: 'map',
      antialias: false
      });
       
      // The 'building' layer in the mapbox-streets vector source contains building-height
      // data from OpenStreetMap.
     /* this.map.on('load', function() {
      // Insert the layer beneath any symbol layer.
      var layers = this.map.getStyle().layers;
       
      var labelLayerId;
      for (var i = 0; i < layers.length; i++) {
      if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
      labelLayerId = layers[i].id;
      break;
      }
      }
       
      this.map.addLayer(
      {
      'id': '3d-buildings',
      'source': 'composite',
      'source-layer': 'building',
      'filter': ['==', 'extrude', 'true'],
      'type': 'fill-extrusion',
      'minzoom': 15,
      'paint': {
      'fill-extrusion-color': '#aaa',
       
      // use an 'interpolate' expression to add a smooth transition effect to the
      // buildings as the user zooms in
      'fill-extrusion-height': [
      'interpolate',
      ['linear'],
      ['zoom'],
      15,
      0,
      15.05,
      ['get', 'height']
      ],
      'fill-extrusion-base': [
      'interpolate',
      ['linear'],
      ['zoom'],
      15,
      0,
      15.05,
      ['get', 'min_height']
      ],
      'fill-extrusion-opacity': 0.6
      }
      },
      labelLayerId
      );
      });*/
      
      /*---------------------------------fin mapa mapbox ------------------------------*/
     /* this.marker = new Mapboxgl.Marker()
      .setLngLat([-58.3884179, -34.8636133])
      .addTo(this.map);*/
      
}


  

  ngOnInit() {
    console.log("omInit")
  
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

    this.map = new Mapboxgl.Map({
      accessToken:environment.mapBoxKey,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [-58.3884179, -34.8636133],
      zoom: 15.5,
      pitch: 45,
      bearing: -17.6,
      container: 'map',
      antialias: false
      });

      this.map.on('load',()=>
    {
      this.map.resize();
    })
  
  }




}





