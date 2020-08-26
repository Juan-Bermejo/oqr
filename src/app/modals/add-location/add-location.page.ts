import { Component, OnInit, NgZone, ElementRef, ViewChild } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Location } from '../../clases/location';
import { User } from '../../clases/user';
import { DbService } from '../../services/db.service';
import { MapsAPILoader } from '@agm/core';
import { Seller } from '../../clases/seller';
import * as Mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { LocationService } from '../../services/location.service';
import { parse } from 'url';


@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.page.html',
  styleUrls: ['./add-location.page.scss'],
})
export class AddLocationPage implements OnInit {


  spinner: boolean;
  labelLayerId: any;
  layers: Mapboxgl.Layer[];
  map: Mapboxgl.Map;
  marker: Mapboxgl.Marker;
  mapOn: any;
  address: string;
  city: string;
  province: string;
  country: string;
  current_latitude:number;
  current_longitude:number;
  latitude:number;
  longitude:number;
  mapType = 'roadmap';
  selectedMarker;
  markers;
  location_data;
  user:User;
  seller:Seller;

   options: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
};

zoom: number;

@ViewChild('search',{static:false})
public searchElementRef: ElementRef;

  constructor(private modalCtrl:ModalController,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private dbService: DbService,
    private toast: ToastController,
    private router :Router,
    private token: TokenService,
    private locationServ: LocationService
    
   ) {

    this.getCurrentPosition();

    this.user= this.token.GetPayLoad().usuario;
    this.dbService.checkIsVendor(this.user._id).subscribe((data:any)=>
  {
    this.seller= data.vendor_data;
  })
    console.log(this.user)
      this.mapType = 'roadmap';
      this.mapOn=true;
     // this.getGeoLocation();

      
     
     }
    



  getGeoLocation()
  {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.current_latitude=resp.coords.latitude;
      this.current_longitude= resp.coords.longitude;

     
      
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

  /*Recibe direccion y devuelve las coordenada*/
  getGeoCoderCoord()
  {
    
    this.locationServ.getLatLong(this.address).toPromise()
  .then((result:any) => { 
    console.log(result);
    this.latitude= parseFloat(result.features[0].geometry.coordinates[1]);
     this.longitude= parseFloat(result.features[0].geometry.coordinates[0]);
     console.log(this.latitude)
     console.log(this.longitude)

     this.current_latitude=this.latitude;
     this.current_longitude=this.longitude;

     this.map.flyTo({
      center: [this.current_longitude, this.current_latitude],
      essential: true // this animation is considered essential with respect to prefers-reduced-motion
      });

      this.marker.remove();
      this.marker 
      .setLngLat([this.current_longitude, this.current_latitude ])
      .addTo(this.map);
  


  
    
  })
  .catch((error: any) => console.log(error));
  }

    /*Recibe coordenadas y devuelve la direccion*/
  getGeoCoderAddress(lat:number, long:number)
  {
    return this.nativeGeocoder.reverseGeocode(lat, long, this.options)
    .then((result: NativeGeocoderResult[]) =>{ 
      this.location_data= result[0];
      console.log(this.location_data);
      console.log(JSON.stringify(result[0]))

    })
    .catch((error: any) => console.log(error));
  }


  addLocation()
  {
    
    if(this.latitude != undefined && this.longitude != undefined )
    {

      this.locationServ.reverse(this.latitude, this.longitude).toPromise()
      .then((dataL:any)=>{
   
        console.log(this.address)
        let l = new Location();
        l.address=this.address;
        l.city= dataL.address.town;
        l.country=dataL.address.country;
        l.latitude=this.latitude;
        l.longitude= this.longitude;
        l.province=dataL.address.state;
        l.subLocality= dataL.address.suburb;
        l.vendor_id=this.seller._id;

        l.location=[l.latitude, l.longitude];

  
 

       this.dbService.saveLocation(l).toPromise().then((data:any)=>
      {
        console.log(data);

        if(data.ok)
        {
          this.dismissModal();
          this.router.navigateByUrl('my-locations');
        }
        else{

          this.toast.create(
            {
              message:"No se pudo guardar la locacion.",
              color:"danger"
            }
          )
          
        }
      })


    /*   this.dbService.updateVendor(this.seller).toPromise().then((data)=>
      {
        console.log(data);
        //this.dismissModal();
        this.router.navigateByUrl('my-locations')
      })*/
        
      })

    }
    else{
      this.toast.create(
        {
          message:"Debes cargar una locacion.",
          color:"danger"
        }
      )
    }

    



  }




  ngOnInit() {
    console.log("ngOnInit")
    this.getCurrentPosition();

    //this.getGeoLocation();
    //////////////////////////////////////// Para cuando se pague el place

/*
     //load Places Autocomplete
     this.mapsAPILoader.load().then(() => {
      //this.setCurrentLocation();
      //this.geoCoder = new google.maps.Geocoder;
 
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
 
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
 
          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });

*/
    ////////////////////////////////////
/*
    this.mapOn=true;

    this.geolocation.getCurrentPosition().then((resp) => {
      this.current_latitude=resp.coords.latitude;
      this.current_longitude= resp.coords.longitude;
  
     
      
     }).catch((error) => {
       console.log('Error getting location', error);
     });*/
  }



  dismissModal()
  {
    //this.modalCtrl.dismiss()
  }

  
  ionViewWillEnter(){
/*
    navigator.geolocation.getCurrentPosition(position => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      })
      */
     /*
    this.spinner=true;
    setTimeout(() => {
      this.spinner=false;
     // this.loadMap();
    }, 2000);
    
    */
  
  }

  ionViewDidEnter()
  {
    console.log("didEnter 2");
 
  }

  ionViewWillLeave()
  {
    console.log("willLeave 3");
  }
  ionViewDidLeave()
  {
    console.log("didLeave 4");
  }

    loadMap(lng, lat)
  {

   
    this.map = new Mapboxgl.Map({
      accessToken:environment.mapBoxKey,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [lng, lat],
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


  this. marker = new Mapboxgl.Marker()
  .setLngLat([lng, lat])
  .addTo(this.map);


  }


    async ngAfterViewInit()
  {
    
      this.map = new Mapboxgl.Map({
        accessToken:environment.mapBoxKey,
        style: 'mapbox://styles/mapbox/light-v10',
        center: [-58.5733844, -34.6154611 ],
        zoom: 15,
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

          this.marker = await new Mapboxgl.Marker()
          .setLngLat([ this.current_latitude, this.current_longitude ])
          .addTo(this.map);

        this.map.resize();
      })


      this. map.addControl(
        new Mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true
        })
      );


  
  /*
    this. marker = new Mapboxgl.Marker()
    .setLngLat([this.current_longitude, this.current_latitude ])
    .addTo(this.map);
    
    */

     


     
  }


/*

  ionViewWillEnter(){
  
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

           
      this. marker = new Mapboxgl.Marker()
          .setLngLat([this.longitude, this.latitude])
          .addTo(this.map);

      
      
  }*/

   getCurrentPosition()
  {
     navigator.geolocation.getCurrentPosition(position => {
      this.current_longitude = position.coords.latitude;
      this.current_latitude = position.coords.longitude;
 
     // this.map.flyTo([this.current_longitude,this.current_latitude])
        })
  }

}
