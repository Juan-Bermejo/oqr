import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-influencer-panel',
  templateUrl: './influencer-panel.page.html',
  styleUrls: ['./influencer-panel.page.scss'],
})
export class InfluencerPanelPage implements OnInit {
saldo=200;
  constructor(private navCtrl: NavController) { }


  goTo()
  {
    this.navCtrl.navigateRoot('offer-list-search');
  }

  ngOnInit() {
  }

}
