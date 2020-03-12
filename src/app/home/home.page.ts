import { Component, ViewChild, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { ModalController, NavController, MenuController, Platform } from '@ionic/angular';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';


import { NavigationOptions } from '@ionic/angular/dist/providers/nav-controller';
import { Router, NavigationExtras } from '@angular/router';
import { NavParamsService } from '../services/nav-params.service';
import { ModalCategoriesPage } from '../modals/modal-categories/modal-categories.page';
import { ProductsService } from '../services/products.service';

import { PostLink } from '../clases/post-link';
import { PostService } from '../services/post.service';
import { Offer } from '../clases/offer';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {


  post: PostLink[];
  subscription: any;
  offer_list: Offer[];
  aux_offer_list:Array<any>;
  busqueda:string;
  notification:boolean=false;
  search_tool:boolean;
 

   options: StreamingVideoOptions = {
    successCallback: () => { console.log('Video played') },
    errorCallback: (e) => { console.log('Error streaming') },
    orientation: 'landscape',
    shouldAutoClose: true,
    controls: false
  };
  
   

  constructor(private prodSrv:ProductsService,
    private streamingMedia: StreamingMedia,
     private modalController: ModalController,
     public navCtrl: NavController,
     private ParamSrv: NavParamsService,
     private menu: MenuController) {
      this.aux_offer_list= new Array();

      console.log("constructor");
      this.search_tool=false;
      
      this.aux_offer_list=this.offer_list;

 
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
  this.navCtrl.navigateForward(['offer-videos']);
  
  }


  dismiss() {

    this.modalController.dismiss({
      'dismissed': true
    });
  }





}




