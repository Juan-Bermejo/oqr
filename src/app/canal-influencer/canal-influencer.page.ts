import { Component, OnInit } from '@angular/core';
import { Offer } from '../clases/offer';
import { DbService } from '../services/db.service';
import { NavController, Platform } from '@ionic/angular';
import { NavParamsService } from '../services/nav-params.service';
import { Influencer } from '../clases/influencer';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-canal-influencer',
  templateUrl: './canal-influencer.page.html',
  styleUrls: ['./canal-influencer.page.scss'],
})
export class CanalInfluencerPage implements OnInit {

  user_data: any;
  offer_list: Array<Offer>;
  aux_offer_list: Array<Offer>;
  influencer:Influencer;
  influencerCode:string;

  constructor(private dbService: DbService,
     private navCtrl:NavController,
     private platform: Platform,
    private paramSrv: NavParamsService,
    private router: Router,
    private token: TokenService,
  private route: ActivatedRoute) {

    this.route.queryParams.subscribe(params => {
      if (params && params.i) {
        this.influencerCode   = params.i;
        console.log(this.influencerCode  )
      }
    });



   }

   goToOfferDetails(offer:Offer)
   {
    //  this.paramSrv.param = {
    //   "influencer": this.influencer,
    //   "offer":offer
    //  }

     
    let params = offer._id;

    if(this.influencerCode != undefined)
    {
      params += "?influencer=" + this.influencerCode;
    }
    console.log(params);

     this.navCtrl.navigateRoot("offer/" + params );
  
    
   }

   ionViewWillEnter()
   {
    // this.influencerCode = this.platform.getQueryParam("i");
    
    
    //this.influencerCode = this.route.snapshot.params['i'];


    console.log(this.influencerCode);



    this.dbService.getOffersInf(this.influencerCode).toPromise().then((data:any)=>
    {
      if(data.ok)
      {
        this.influencer = data.influencer;

        if(data.ofertas)
        {
          this.aux_offer_list=data.ofertas;
        }
      }

      console.log(data)
    })
   }

  ngOnInit() {
  }

}
