import { Component, OnInit } from '@angular/core';
import { User } from '../clases/user';
import { ModalController, NavController } from '@ionic/angular';
import { AddLocationPage } from '../modals/add-location/add-location.page';
import { Location } from '../clases/location';
import { DbService } from '../services/db.service';

@Component({
  selector: 'app-my-locations',
  templateUrl: './my-locations.page.html',
  styleUrls: ['./my-locations.page.scss'],
})
export class MyLocationsPage implements OnInit {

  public user:User;
  myLocations;

  constructor(private modalController: ModalController,
     private dbService: DbService,
    private navCtrl: NavController) {

    this.user= JSON.parse(localStorage.getItem("user_data"));
    
    this.dbService.getLocation(this.user.shops[0]).subscribe((data:any)=>{
      console.log(data);
      this.myLocations=data.location_data;
    })

   }

   async ModalNewLocation() {
    /*const modal = await this.modalController.create({
      component: AddLocationPage,
      cssClass:"modal"
      
    });
     modal.present();
     modal.onDidDismiss().then((data)=>{

    })*/
this.navCtrl.navigateRoot('add-location');
    
  }

  ngOnInit() {
  }

}
