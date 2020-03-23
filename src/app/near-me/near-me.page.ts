import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NavParamsService } from '../services/nav-params.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Product } from '../clases/product';
import { User } from '../clases/user';
import { Location } from '../clases/location';
import { Offer } from '../clases/offer';
import { DbService } from '../services/db.service';

@Component({
  selector: 'app-near-me',
  templateUrl: './near-me.page.html',
  styleUrls: ['./near-me.page.scss'],
})
export class NearMePage implements OnInit {

  user:User;
  offer: Offer;
  latitude = -28.68352;
  longitude = -147.20785;
  mapType = 'roadmap';

  selectedMarker;
  markers: Array<{}>;
  myLatLng;
  myLat;
  mylong;
  array_products: Product[];
  offerLocations:Location[];
  offer_sellers:string[];
  my_offer:boolean=true;


  constructor(private route: ActivatedRoute, 
    public navCtrl: NavController,
  public paramSrv: NavParamsService,
  private geolocation: Geolocation,
private dbService: DbService) {

  this.user= JSON.parse(localStorage.getItem("user_data"));
  this.markers= new Array<{}>();

this.offerLocations= new Array<Location>();

     /* this.offer.sellers.forEach(seller => {
        console.log(seller)
        if(seller==this.user._id)
        {
          this.my_offer==true;
        }
        console.log(this.user)
        this.dbService.getLocation(seller).subscribe((data:any)=>
      {
        
        this.offerLocations=data.location_data;

        this.offerLocations.forEach(location => {
          console.log(location);
          this.addMarker(location);
        });
      })

      });
    
*/
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
