import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TokenService } from '../services/token.service';
import { DbService } from '../services/db.service';

@Component({
  selector: 'app-influencer-panel',
  templateUrl: './influencer-panel.page.html',
  styleUrls: ['./influencer-panel.page.scss'],
})
export class InfluencerPanelPage implements OnInit {
  influencer: any;
  user_data: any;
saldo=200;
  constructor(private navCtrl: NavController,
  private token: TokenService,
private dbService: DbService) { }


  goTo()
  {
    this.navCtrl.navigateRoot('offer-list-search');
  }

  ionViewWillEnter()
  {
    this.user_data = this.token.GetPayLoad().usuario;
    this.dbService.getInfluencerByUser(this.user_data._id).toPromise().then((data:any)=>
  {
    this.influencer= data.influencer_data;
    console.log(data);
  })
  .catch(err=>
  {
    console.log("Error: ", err)
  })
  }

  ngOnInit() {
  }

}
