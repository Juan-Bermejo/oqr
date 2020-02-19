import { Component } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { ModalCategoriesPage } from '../modal-categories/modal-categories.page';
import { offer_list } from '../../environments/environment'
import { NavigationOptions } from '@ionic/angular/dist/providers/nav-controller';
import { Router, NavigationExtras } from '@angular/router';
import { NavParamsService } from '../services/nav-params.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {

  offer_list = offer_list;
  aux_offer_list:Array<any>;
  busqueda:string;
  notification:boolean=false;
  search_tool:boolean;
  is_logged:boolean=false;
   

  constructor(private modalController: ModalController,
     public navCtrl: NavController,
     private ParamSrv: NavParamsService,
     private afAuth: AngularFireAuth,
     private authService: AuthService
    ) {

      this.search_tool=false;
      this.aux_offer_list= new Array();
      this.aux_offer_list=this.offer_list;

    setTimeout(() => {
      this.notification=true;
    }, 3000);
  }

  ngOnInit() {
    this.getCurrentUser();
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


  dismiss() {

    this.modalController.dismiss({
      'dismissed': true
    });
  }

  getCurrentUser() {
    this.authService.isAuth().subscribe( auth => {
      if (auth){
        this.is_logged = true;
      }
      else {
        this.is_logged = false;
      }
    })
  }

  goToLogIn() {
    this.navCtrl.navigateRoot('login');
  }

  logOut() {
    this.afAuth.auth.signOut();
    
  }


}




