import { Component, OnInit } from '@angular/core';
import { Offer } from '../clases/offer';
import { DbService } from '../services/db.service';
import { NavController } from '@ionic/angular';
import { NavParamsService } from '../services/nav-params.service';
import { Influencer } from '../clases/influencer';

@Component({
  selector: 'app-canal-influencer',
  templateUrl: './canal-influencer.page.html',
  styleUrls: ['./canal-influencer.page.scss'],
})
export class CanalInfluencerPage implements OnInit {

  offer_list: Array<Offer>;
  aux_offer_list: Array<Offer>;
  influencer:Influencer;

  constructor(private dbService: DbService,
     private navCtrl:NavController,
    private paramSrv: NavParamsService) {
    this.dbService.getAllOffers().toPromise().then((data:any)=>
  {
    this.aux_offer_list=data;
    console.log(data)
  })
   }

   goToOfferDetails(offer:Offer)
   {
     this.paramSrv.param = {
      "influencer": this.influencer,
      "offer":offer
     }
    this.navCtrl.navigateRoot('offer-details');
   }

  ngOnInit() {
  }

}
