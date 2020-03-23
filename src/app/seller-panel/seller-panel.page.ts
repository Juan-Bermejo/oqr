import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';

import { DbService } from '../services/db.service';
import { User } from '../clases/user';
import { AddProductPage } from '../modals/add-product/add-product.page';

@Component({
  selector: 'app-seller-panel',
  templateUrl: './seller-panel.page.html',
  styleUrls: ['./seller-panel.page.scss'],
  providers: [DbService]
})
export class SellerPanelPage implements OnInit {

  public user_data: User;

  public name: string = '';
  public user_name: string = '';

  constructor(private navCtrl: NavController,
    private modalctrl: ModalController,
              private dbService: DbService) {
    
   }

  goTo(path:string)
  {
    this.navCtrl.navigateRoot(path);
  }

  ngOnInit() {

  }

  ionViewWillEnter(){
    this.user_data = JSON.parse(localStorage.getItem("user_data"));

    this.name = this.user_data.name;
    this.user_name = this.user_data.user_name;
  }




}
