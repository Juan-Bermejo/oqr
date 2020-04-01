import { Component, OnInit } from '@angular/core';
import { ModalCategoriesPage } from '../modals/modal-categories/modal-categories.page';
import { MenuController, NavController, ModalController } from '@ionic/angular';
import { NavParamsService } from '../services/nav-params.service';
import { Offer } from '../clases/offer';
import { DbService } from '../services/db.service';
import { Seller } from '../clases/seller';
import { User } from '../clases/user';

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
    private dbServ:DbService) {

      this.search_tool=false;
      this.user=this.dbServ.user_data;
      this.aux_offer_list= new Array();
      this.dbServ.getAllOffers().subscribe((data: Offer[])=>{
        this.offer_list=data;
       this.aux_offer_list=this.offer_list;
      })

      this.dbServ.checkIsVendor(this.user._id).subscribe((data:any)=>
    {
      this.seller=data.vendor_data;
    })





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
    
  this.ParamSrv.param=
  {
    "offer":offer,
    "seller":this.seller
  }

  this.navCtrl.navigateForward(['asociate-offer']);
  
  }

  

  ngOnInit() {
  }




}
