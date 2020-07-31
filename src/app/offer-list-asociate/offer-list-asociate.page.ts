import { Component, OnInit } from '@angular/core';
import { ModalCategoriesPage } from '../modals/modal-categories/modal-categories.page';
import { MenuController, NavController, ModalController } from '@ionic/angular';
import { NavParamsService } from '../services/nav-params.service';
import { Offer } from '../clases/offer';
import { DbService } from '../services/db.service';
import { Seller } from '../clases/seller';
import { User } from '../clases/user';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offer-list-asociate',
  templateUrl: './offer-list-asociate.page.html',
  styleUrls: ['./offer-list-asociate.page.scss'],
})
export class OfferListAsociatePage implements OnInit {

  offer_list: Offer[];
  aux_offer_list:Array<any>;
  busqueda:string;
  notification:boolean=false;
  search_tool:boolean;
  seller:Seller;
  user:User;

  

   

  constructor(private modalController: ModalController,
     public navCtrl: NavController,
     private ParamSrv: NavParamsService,
     private menu: MenuController,
     private dbServ:DbService,
     private router: Router,
    private token: TokenService) {

      this.search_tool=false;
     
      this.aux_offer_list= new Array();

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
     // this.aux_offer_list= await this.offer_list.filter(item => item.product.toLowerCase().includes(key) );
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
    
  this.ParamSrv.param=
  {
    "offer":offer,
    "seller":this.seller
  }

  //this.navCtrl.navigateForward(['asociate-offer']);
  this.router.navigateByUrl('asociate-offer/'+offer._id);
  
  }

  ionViewWillEnter()
  {

    this.user = this.token.GetPayLoad().usuario;

    this.dbServ.getAllOffers(false).subscribe((data: any)=>{
      this.offer_list=data.offers;
     this.aux_offer_list=this.offer_list;
     console.log(this.aux_offer_list)
    })

    this.dbServ.checkIsVendor(this.user._id).subscribe((data:any)=>
    {
      this.seller=data.vendor_data;
      console.log(data.vendor_data)
    })
  }

  

  ngOnInit() {
  }




}
