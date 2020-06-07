import { Component, OnInit } from '@angular/core';
import { Offer } from '../clases/offer';
import { Influencer } from '../clases/influencer';
import { NavParamsService } from '../services/nav-params.service';
import { NavController } from '@ionic/angular';
import { DbService } from '../services/db.service';

@Component({
  selector: 'app-offer-influencers',
  templateUrl: './offer-influencers.page.html',
  styleUrls: ['./offer-influencers.page.scss'],
})
export class OfferInfluencersPage implements OnInit {

  offerId: string;
  offer: Offer;
  influencers: Influencer[];

  constructor(private navParams: NavParamsService,
  private navCtrl: NavController,
private dbService:DbService) {
  console.log(document.URL )
  console.log(document.URL.indexOf("%3F") )
  
    if (document.URL.indexOf("%3F") > 0) {
      let splitURL = document.URL.split("%3F");
      let splitParams = splitURL[1].split("&");
      let i: any;
      for (i in splitParams){
        let singleURLParam = splitParams[i].split('%3D');
        if (singleURLParam[0] == "offer"){
          this.offerId = singleURLParam[1];
        }
      }
  
      this.dbService.getOffer(this.offerId).toPromise().then((data:any)=>
    {
      this.offer= data ;
      console.log(data)
    })
  }
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
