import { Component, OnInit } from '@angular/core';
import { Offer } from '../clases/offer';
import { Influencer } from '../clases/influencer';
import { NavParamsService } from '../services/nav-params.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-offer-influencers',
  templateUrl: './offer-influencers.page.html',
  styleUrls: ['./offer-influencers.page.scss'],
})
export class OfferInfluencersPage implements OnInit {

  offer: Offer;
  influencers: Influencer[];

  constructor(private navParams: NavParamsService,
  private navCtrl: NavController) {
    this.offer= this.navParams.param.offer
   }

   goTo()
   {
     this.navParams.param =
     {
       "offer": this.offer
     }
     this.navCtrl.navigateRoot("offer-details");
   }

  ngOnInit() {
  }

}
