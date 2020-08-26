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


  
  influencer: any;
  user_data: any;
  locations_data: any;
  dataloc: any[];
  offerVendors: any;
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
  offerLocations:any[];
  offer_sellers:string[];
  my_offer:boolean=true;
  seller:Seller;
  is_seller:boolean;
  zoom:number;
  influencer_id:string;
  is_logged:boolean=false;
  selected_vendor:any;



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
 
      this.markers= new Array<{}>();
      this.offerVendors= new Array<any>();
      this.locations_data= JSON.parse(localStorage.getItem("location_data"));


      if (document.URL.indexOf("/") > 0) {
        let splitURL = document.URL.split("/");
       console.log("splitUrlLenght: ",splitURL.length);
       console.log("splitUrl: ",splitURL);

       this.offerId = splitURL[5].split("?")[0];
       this.influencer_id = splitURL[5].split("?")[1].split("=")[1];
       console.log(this.influencer_id)
      }

      this.dbService.getInfByCode(this.influencer_id).subscribe((data:any)=>{
        console.log(data)
        if(data.ok)
        {
          this.influencer = data.influencer;
        }
      })


        this.dbService.getOffer(this.offerId).toPromise().then((data:any)=>
      {
        this.offer= data ;
        console.log(data)
      })
    

    this.dbService.getOfferLocations(this.offerId, this.locations_data.town, this.locations_data.suburb).toPromise().then((dataLoc:any)=>
    { 
      console.log("data locations: ", dataLoc)
      
     for(let i =0; i< dataLoc.vendors.length; i++)
     {
      console.log(dataLoc.vendors[i])
       this.addMarker(dataLoc.vendors[i]);
     }
    })
      this.getCurrentPosition();
     
      this.dbService.getLogged$().subscribe((logged_check)=>
    {
      this.is_logged=logged_check;
      this.is_logged ? this.user= tokenSrv.GetPayLoad().usuario: this.user= null;
      console.log(this.user);
    })

    this.dbService.getIsSeller$().subscribe((data)=>
    {
      this.is_seller= data;
    })
     


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


   addMarker(data:any) {

    console.log(data)

  this.markers.push(
    {
      //location: location,
      lat: data.location.latitude,
       lng: data.location.longitude,
       address:data.location.address,
        alpha: 1,
        sellerName: data.vendedor.shop_name,
        seller: data.vendedor._id,
        img: data.vendedor.profile_img
       // icon: "../../../assets/iconos/User-Blue-icon.png"
      });
  





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
   //this.router.navigateByUrl('seller-shop/' + sellerId+'?offer='+this.offerId);
  
   if(this.influencer_id)
   {
    this.router.navigateByUrl('offer-land-pange/' + this.offerId +'?seller='+ sellerId + '&influencer=' + this.influencer_id);
   }
   else{

    this.router.navigateByUrl('offer-land-pange/' + this.offerId +'?seller='+ sellerId);

   }
   

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
             
                
             
          await  this.markers.forEach(async (m)=>
        {
          
      
             const div = window.document.createElement('div');
            
             if(m.img)
             {
              div.innerHTML = " <ion-row> <img src='"+m.img+"'/> </ion-row>"+
               "<ion-row> <ion-col size=3> <img src='../../assets/images/delivery.png'/>  </ion-row>";
             }
             else{
              div.innerHTML = "<img src='../../assets/logoOfertaCerca/logoCelesteFondoBlanco.jpg'/>";
             }
             
             div.className ="img-seller";
              
          
              div.addEventListener('click',async ()=>
            {
              
              this.selectMarker(m.sellerName)
            })
      
            let popup = new Mapboxgl.Popup()
                    .setDOMContent(div);
                    
            const el = document.createElement('div');

           
                 
            let marker = await  new Mapboxgl.Marker()
                .setPopup(popup)
                .setLngLat([m.lng, m.lat])
                .addTo(this.map)
                marker.getElement().addEventListener('click', ()=>
              {
                console.log("hola", m)
              })
                this.map.resize();
      
        })

      

        
        this.map.resize();


          })




          await navigator.geolocation.getCurrentPosition(position => {
            this.current_longitude = position.coords.latitude;
            this.current_latitude = position.coords.longitude;  
            
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

  }

  async getCurrentPosition()
  {
     navigator.geolocation.getCurrentPosition(position => {
      this.current_longitude = position.coords.latitude;
      this.current_latitude = position.coords.longitude;

        })
  }




}





