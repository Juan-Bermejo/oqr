import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent{

 
  subscription: Subscription;
  menu_opt = [
    {
      "icon":"md-person",
      "name":"Mi cuenta",
      "redirectTo": "seller-panel",
      
    },
    {
      "icon":"md-megaphone",
      "name":"Panel influencer",
      "redirectTo": "influencer-panel",
    },
    {
      "icon":"md-card",
      "name":"Ofertas",
      "redirectTo": "offer-details",
      
    },
    {
      "icon":"md-cash",
      "name":"Quiero hacer una oferta",
      "redirectTo": "new-offer",
  
    },
    {
      "icon":"md-megaphone",
      "name":"Quiero promocionar una oferta",
      "redirectTo": "offer-list-search",
    },


  
  
  ]
  
  role:string= "";

  constructor(private platform:Platform) {
  
  }

  exitApp()
  { 
    

  }
  







}
