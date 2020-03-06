import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Location } from '../../clases/location';
import { User } from '../../clases/user';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.page.html',
  styleUrls: ['./add-location.page.scss'],
})
export class AddLocationPage implements OnInit {



  mapOn: any;
  address: string;
  city: string;
  province: string;
  country: string;
  latitude:number;
  longitude:number;
  mapType = 'roadmap';
  selectedMarker;
  markers;
  location_data;

   options: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
};



  constructor(private modalCtrl:ModalController,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder) {
      this.mapType = 'roadmap';
      this.mapOn=true;
      this.getGeoLocation();
      
     
     }
    


  getGeoLocation()
  {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude=resp.coords.latitude;
      this.longitude= resp.coords.longitude;

     
      
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

  /*Recibe direccion y devuelve las coordenada*/
  getGeoCoderCoord()
  {
    
    this.nativeGeocoder.forwardGeocode(this.address, this.options)
  .then((result: NativeGeocoderResult[]) => { 
    this.latitude= parseFloat(result[0].latitude);
     this.longitude= parseFloat(result[0].longitude);


    
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


    this.getGeoCoderAddress(this.latitude, this.longitude).then(()=>{
      let l= new Location();
      l.address=this.address;
      l.city= this.city
      l.country=this.location_data.countryName;
      l.latitude=this.latitude;
      l.longitude= this.longitude;
      l.province=this.location_data.administrativeArea;
      l.subLocality= this.location_data.subLocality;
      let user:User=JSON.parse(localStorage.getItem("user"));

      if(user.locations[0])
      {
        user.locations.push(l);
      }
      else{
        user.locations= new Array<Location>();
        user.locations.push(l);
      }
      
      localStorage.setItem("user", JSON.stringify(user));
      this.modalCtrl.dismiss({
        "result":{
          "address":  this.address,
          "city":  this.location_data.locality,
          "province": this.location_data.administrativeArea,
          "country":  this.location_data.countryName,
          "postalCode": this.location_data.postalCode,
          "lat":  this.latitude,
          "lon":  this.longitude,
          "subLocality":this.location_data.subLocality,
          "subAdministrativeArea": this.location_data.subAdministrativeArea
        },
        'dismissed': true
      }).then(()=>{
        this.mapOn=false;
        this.latitude=undefined;
        this.longitude=undefined;
        this.location_data=undefined;
        this.markers=undefined;
      })

    })


  }




  ngOnInit() {

    this.mapOn=true;

    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude=resp.coords.latitude;
      this.longitude= resp.coords.longitude;
  
     
      
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }



  dismissModal()
  {
    this.modalCtrl.dismiss()
  }

}
