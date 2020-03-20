import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { DbService } from '../../services/db.service';
import { NavController } from '@ionic/angular';

 
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
      "redirectTo": "my-account",
      
    },
    {
      "icon":"md-locate",
      "name":"Punto de venta",
      "redirectTo": "seller-panel",
      
    },
    {
      "icon":"md-megaphone",
      "name":"Panel influencer",
      "redirectTo": "influencer-panel",
    },
    {
      "icon":"md-business",
      "name":"Panel fabricante",
      "redirectTo": "",
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
  is_logged:boolean;

  constructor(private menuSrv:MenuService, private dbService:DbService, private navCtrl: NavController) {
  this.dbService.getLogged$().subscribe((data)=>{
    this.is_logged=data;
    console.log(this.is_logged);
  })
  
  
  }

  closeSession()
  { 
    localStorage.removeItem("user_data");
    this.dbService.setLogged(false);
    this.navCtrl.navigateRoot("/login");
    

  }

  ngOnInit() {
  
  }

  /*ngAfterViewChecked(): void {
    this.menu_opt = this.menuSrv.menu_data;
  }*/
  







}
