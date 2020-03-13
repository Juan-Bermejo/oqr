import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';
 
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent{

 

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

  constructor(private menuSrv:MenuService) {
  
  }

  exitApp()
  { 
  }

  ngOnInit() {
  
  }

  ngAfterViewChecked(): void {
    this.menu_opt = this.menuSrv.menu_data;
  }
  







}
