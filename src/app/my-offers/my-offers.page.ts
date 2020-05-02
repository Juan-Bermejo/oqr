import { Component, OnInit } from '@angular/core';
import { DbService } from '../services/db.service';
import { Offer } from '../clases/offer';
import { NavController, ToastController } from '@ionic/angular';
import { Seller } from '../clases/seller';
import { NavParamsService } from '../services/nav-params.service';
import { User } from '../clases/user';

@Component({
  selector: 'app-my-offers',
  templateUrl: './my-offers.page.html',
  styleUrls: ['./my-offers.page.scss'],
})
export class MyOffersPage implements OnInit {

  public data_offers: Offer[];
  seller:Seller;
  user:User;

  constructor(private dbService: DbService,
              private navCtrol: NavController,
              private navParams: NavParamsService,
              private toastCtrl: ToastController
  ) {
    this.user= JSON.parse(localStorage.getItem("user_data"));

    this.dbService.checkIsVendor(this.user._id).subscribe((data:any)=>
  {
    this.dbService.getOffersByVendor(data.vendor_data._id).subscribe((offers_data:any)=>
  {
    this.data_offers = offers_data.offers_data;
    console.log(data.vendor_data._id);
    console.log(this.data_offers)
   
  })
  })
                
               }

  
deleteOffer(offer_id)
{
  this.dbService.deleteOffer(offer_id).subscribe((data)=>
{
  const toast= this.toastCtrl.create(
    {
      message: "Oferta eliminada."
    }
  )

})
}
  goTo(path:string)
  {
    this.navCtrol.navigateRoot(path);
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
  
  }

}
