import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NavParamsService } from '../services/nav-params.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.page.html',
  styleUrls: ['./offer-details.page.scss'],
})
export class OfferDetailsPage implements OnInit {

  offer: any;
  latitude = -28.68352;
  longitude = -147.20785;
  mapType = 'roadmap';

  selectedMarker;
  markers;
  myLatLng;
  myLat;
  mylong;

  constructor(private route: ActivatedRoute, 
    public navCtrl: NavController,
  public paramSrv: NavParamsService,
  private geolocation: Geolocation) {

  }

  getGeoLocation()
  {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.myLat=resp.coords.latitude;
      this.mylong= resp.coords.longitude;
      this.latitude=this.myLat;
      this.longitude=this.mylong;
      this.addMarker(this.latitude, this.longitude);
      this.myLatLng={ lat:this.latitude, lng:this.longitude };
      
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }


  addMarker(lat: number, lng: number) {
    this.markers={ latitude: lat, longitud:lng, alpha: 1};
    console.log(lat, lng);
    //this.addMarker(this.latitude, this.longitude);
  }
  

  ngOnInit() {

    this.getGeoLocation();
    if(this.paramSrv.param)
    {
      this.offer=this.paramSrv.param
    }
    else
    {
      this.offer= {id:1, title: "Descuento del 50% en GYM.", category: "gym", cantidad:1, description:"consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat."}
    }
    //this.offer=this.paramSrv.param;
    console.log(this.offer)
  }

}
