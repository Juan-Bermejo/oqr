import { Component, OnInit } from '@angular/core';
import { User } from '../clases/user';
import { ModalController, NavController } from '@ionic/angular';
import { AddLocationPage } from '../modals/add-location/add-location.page';
import { Location } from '../clases/location';
import { DbService } from '../services/db.service';
import { TokenService } from '../services/token.service';
import { Seller } from '../clases/seller';

@Component({
  selector: 'app-my-locations',
  templateUrl: './my-locations.page.html',
  styleUrls: ['./my-locations.page.scss'],
})
export class MyLocationsPage implements OnInit {

  private user:User;
  private seller: Seller;
  myLocations;

  constructor(private modalController: ModalController,
     private dbService: DbService,
    private navCtrl: NavController,
  private token: TokenService) {

    this.user= this.token.GetPayLoad().doc

    this.dbService.checkIsVendor(this.user._id).toPromise().then((data:any)=>
  {
    this.myLocations = data.vendor_data.location;
    console.log(this.myLocations)
  })
  
   /* this.dbService.getLocation(this.user.shops[0]).toPromise().then((data:any)=>{
      console.log(data);
      this.myLocations=data.location_data;
    })*/

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

  ionViewWillEnter()
  {
    this.user= this.token.GetPayLoad().doc

    this.dbService.checkIsVendor(this.user._id).toPromise().then((data:any)=>
    {
      this.seller = data.vendor_data;
      this.myLocations = data.vendor_data.location;
      console.log(this.myLocations)
    })
  }


  deleteLocation(location: Location)
  {
     let index = this.seller.location.findIndex( l => location.id == l.id)
    this.seller.location.splice(index,1);
    
    this.dbService.updateVendor(this.seller).toPromise().then((data:any)=>
    {
      console.log(data);
      this.seller = data.vendor_data;
      this.myLocations = data.vendor_data.location;
      
      
    })
  }

  ngOnInit() {
  }

}
