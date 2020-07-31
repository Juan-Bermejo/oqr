import { Component, OnInit } from '@angular/core';
import { DbService } from '../services/db.service';
import { Offer } from '../clases/offer';
import { NavController, ToastController } from '@ionic/angular';
import { Seller } from '../clases/seller';
import { NavParamsService } from '../services/nav-params.service';
import { User } from '../clases/user';
import { TokenService } from '../services/token.service';

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
              private toastCtrl: ToastController,
              private token: TokenService
  ) {
    
    this.user = this.token.GetPayLoad().usuario;

    this.dbService.checkIsVendor(this.user._id).subscribe((data:any)=>
  {
    this.dbService.getOffersByVendor(data.vendor_data._id).subscribe((offers_data:any)=>
  {
    console.log(offers_data);
    if(offers_data.ok)
    {
      this.data_offers = offers_data.offers_data; 
    }
    else
    {
      console.log("no hay ofertas");
    }

   
  })
  })
                
               }


               async desAssociate(offerId)
               {
                 this.dbService.dropOffer(this.user._id,offerId).subscribe((data:any)=>
               {
                 const toast = document.createElement('ion-toast');
                 toast.message = 'Ya no eres socio de esta oferta';
                 toast.duration = 2000;
                 toast.color= "primary";
                 toast.position="top";
                 document.body.appendChild(toast);
                 return toast.present(); 
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
