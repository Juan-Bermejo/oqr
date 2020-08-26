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
  private dbService:DbService) {}




   goTo(influencerId)
   {

    let params = this.offerId;

    if(influencerId != undefined)
    {
      params += "?influencer=" + influencerId;
    }

     this.navCtrl.navigateRoot("offer/" + params );
   
   }

   ionViewWillEnter()
   {
  
    if (document.URL.indexOf("/") > 0) {
      let splitURL = document.URL.split("/");
      console.log(splitURL)
     this.offerId = splitURL[5].split("?")[0];
    }
    console.log(this.offerId);

    this.dbService.getInfluencersByOffer(this.offerId).subscribe((data:any)=>
  {
    console.log(data);
    if(data.ok)
    {
      this.influencers = data.data
    }
    
  })
      this.dbService.getOffer(this.offerId).toPromise().then((data:any)=>
    {
      this.offer= data ;
      console.log(data)
    })
  
   }

  ngOnInit() {
  }

}
