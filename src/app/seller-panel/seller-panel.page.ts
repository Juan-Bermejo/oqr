import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { DbService } from '../services/db.service';
import { User } from '../clases/user';

@Component({
  selector: 'app-seller-panel',
  templateUrl: './seller-panel.page.html',
  styleUrls: ['./seller-panel.page.scss'],
  providers: [DbService]
})
export class SellerPanelPage implements OnInit {

  user:User;

  usrName:string="Usuario1";

  constructor(private navCtrl: NavController) {
    
   }

  goTo(path:string)
  {
    this.navCtrl.navigateRoot(path);
  }

  ngOnInit() {

  }

  ionViewWillEnter(){
    
  }

}
