import { Component, OnInit } from '@angular/core';
import { User } from '../clases/user';
import { ModalController } from '@ionic/angular';
import { AddLocationPage } from '../modals/add-location/add-location.page';
import { Location } from '../clases/location';

@Component({
  selector: 'app-my-locations',
  templateUrl: './my-locations.page.html',
  styleUrls: ['./my-locations.page.scss'],
})
export class MyLocationsPage implements OnInit {

  public user:User;
  newLocation: Location;

  constructor(private modalController: ModalController) {


   }

   async ModalNewLocation() {
    const modal = await this.modalController.create({
      component: AddLocationPage,
      cssClass:"modal"
      
    });
     modal.present();
     modal.onDidDismiss().then((data)=>{
     /* this.newLocation = new Location();
      this.newLocation.address=data.data.result.address;
      this.newLocation.latitude=data.data.result.lat;
      this.newLocation.longitude=data.data.result.lon;
      this.newLocation.country=data.data.result.country;
      this.newLocation.city=data.data.result.city;
      this.newLocation.province=data.data.result.province;
      //this.newLocation.user_id= this.user.id;*/
    
      
      
    })
  }

  ngOnInit() {
  }

}
