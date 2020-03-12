import { Component, OnInit } from '@angular/core';
import { ModalCategoriesPage } from '../modals/modal-categories/modal-categories.page';
import { MenuController, NavController, ModalController } from '@ionic/angular';
import { NavParamsService } from '../services/nav-params.service';
import { Offer } from '../clases/offer';

@Component({
  selector: 'app-offer-list-search',
  templateUrl: './offer-list-search.page.html',
  styleUrls: ['./offer-list-search.page.scss'],
})
export class OfferListSearchPage implements OnInit {

  offer_list: Offer[];
  aux_offer_list:Array<any>;
  busqueda:string;
  notification:boolean=false;
  search_tool:boolean;

   

  constructor(private modalController: ModalController,
     public navCtrl: NavController,
     private ParamSrv: NavParamsService,
     private menu: MenuController) {
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
      this.aux_offer_list= await this.offer_list.filter(item => item.product.toLowerCase().includes(key) );
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
  this.navCtrl.navigateForward(['promote-offer']);
  
  }

  

  ngOnInit() {
  }

}
