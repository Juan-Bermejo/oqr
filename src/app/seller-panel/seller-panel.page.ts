import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DbService } from '../services/db.service';

@Component({
  selector: 'app-seller-panel',
  templateUrl: './seller-panel.page.html',
  styleUrls: ['./seller-panel.page.scss'],
  providers: [DbService]
})
export class SellerPanelPage implements OnInit {

  usrName:string='Usuario';

  constructor(public dbService: DbService) { }

  ngOnInit() {

  }

  ionViewWillEnter(){
    
  }

}
