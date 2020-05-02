import { Component, OnInit, NgZone, ElementRef, ViewChild } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Location } from '../../clases/location';
import { User } from '../../clases/user';
import { DbService } from '../../services/db.service';
import { MapsAPILoader } from '@agm/core';
import { Seller } from '../../clases/seller';


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
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) {

    this.user= JSON.parse(localStorage.getItem('user_data'));
    this.dbService.checkIsVendor(this.user._id).subscribe((data:any)=>
  {
    this.seller= data.vendor_data;
  })
    console.log(this.user)
      this.mapType = 'roadmap';
      this.mapOn=true;
      this.getGeoLocation();

      
     
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
    
    this.nativeGeocoder.forwardGeocode(this.address, this.options)
  .then((result: NativeGeocoderResult[]) => { 
    
    this.latitude= parseFloat(result[0].latitude);
     this.longitude= parseFloat(result[0].longitude);

     this.current_latitude=this.latitude;
     this.current_longitude=this.longitude;
    
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
    console.log(this.latitude)
    if(this.latitude != undefined && this.longitude != undefined )
    {

      this.getGeoCoderAddress(this.latitude, this.longitude).then(()=>{

        let l= new Location();
        l.address=this.address;
        l.city= this.location_data.locality
        l.country=this.location_data.countryName;
        l.latitude=this.latitude;
        l.longitude= this.longitude;
        l.province=this.location_data.administrativeArea;
        l.subLocality= this.location_data.subLocality;
        l.vendor_id=this.user.shops[0];
  
       console.log(this.location_data)
       console.log(l);
       this.seller.location.push(l);

       this.dbService.updateVendor(this.seller).toPromise().then((data)=>
      {
        console.log(data);
      })
  
       /* this.dbService.saveLocation(l).subscribe((data)=>{
  
          console.log("Data:",data);
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

    this.mapOn=true;

    this.geolocation.getCurrentPosition().then((resp) => {
      this.current_latitude=resp.coords.latitude;
      this.current_longitude= resp.coords.longitude;
  
     
      
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }



  dismissModal()
  {
    this.modalCtrl.dismiss()
  }

}
