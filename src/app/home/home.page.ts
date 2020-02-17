import { Component } from '@angular/core';
import { ModalController, NavController, MenuController } from '@ionic/angular';
import { ModalCategoriesPage } from '../modal-categories/modal-categories.page';
import { offer_list } from '../../environments/environment'
import { NavigationOptions } from '@ionic/angular/dist/providers/nav-controller';
import { Router, NavigationExtras } from '@angular/router';
import { NavParamsService } from '../services/nav-params.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  offer_list = offer_list;
  aux_offer_list:Array<any>;
  busqueda:string;
  notification:boolean=false;
  search_tool:boolean;

   

  constructor(private modalController: ModalController,
     public navCtrl: NavController,
     private ParamSrv: NavParamsService,
     private menu: MenuController,
    ) {
      this.search_tool=false;
      this.aux_offer_list= new Array();
      this.aux_offer_list=this.offer_list;

    setTimeout(() => {
      this.notification=true;
    }, 3000);
  }

   async presentModal() {
    const modal = await this.modalController.create({
      component: ModalCategoriesPage,
      cssClass:"modal"
      
    });
    return await modal.present();
  }

 async filter(input)
  {
    let key = input.detail.value
    
    if(key)
    {
      this.aux_offer_list= await this.offer_list.filter(item => item.category.toLowerCase().includes(key) );
    }
    else
    {
      this.aux_offer_list=this.offer_list;
    }

  }

  async searchTools()
  {
    this.search_tool = !(this.search_tool);
    console.log(this.search_tool);
  }

  async goToOfferDetails(offer)
  {
    
  this.ParamSrv.param=offer
  this.navCtrl.navigateForward(['offer-details']);
  
  }


  /*openMenu() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }*/


  dismiss() {

    this.modalController.dismiss({
      'dismissed': true
    });
  }


}




