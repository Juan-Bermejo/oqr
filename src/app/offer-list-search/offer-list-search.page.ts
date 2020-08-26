import { Component, OnInit } from '@angular/core';
import { ModalCategoriesPage } from '../modals/modal-categories/modal-categories.page';
import { MenuController, NavController, ModalController } from '@ionic/angular';
import { NavParamsService } from '../services/nav-params.service';
import { Offer } from '../clases/offer';
import { DbService } from '../services/db.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offer-list-search',
  templateUrl: './offer-list-search.page.html',
  styleUrls: ['./offer-list-search.page.scss'],
})
export class OfferListSearchPage implements OnInit {

  loading: string;
  offer_list: Offer[];
  aux_offer_list:Array<any>;
  busqueda:string;
  notification:boolean=false;
  search_tool:boolean;
  busqeda;
  public event: Event;
  habilitado: number = 1;

   

  constructor(private modalController: ModalController,
     public navCtrl: NavController,
     private ParamSrv: NavParamsService,
     private menu: MenuController,
     private router: Router,
    private dbServ:DbService) {
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
    // let key = input.detail.value
    
    // if(key)
    // {
    //   this.aux_offer_list= await this.offer_list.filter(item => item.titulo.toLowerCase().includes(key) );
    // }
    // else
    // {
    //   this.aux_offer_list=this.offer_list;
    // }

  }

  async searchTools()
  {
    this.search_tool = !(this.search_tool);
    console.log(this.search_tool);
  }

  async goToOfferDetails(offer)
  {
    console.log(offer)
  this.ParamSrv.param=offer
  this.router.navigateByUrl('promote-offer/' + offer._id);
  
  
  }


  ionViewWillEnter()
  {
    this.loading= "cargando";
    this.recargarOffer(this.event, 1);
  }


loadPageOffer(event?, pull: boolean = false )
{

  //   this.dbServ.nearOffersRadio( this.location_data.latitude, this.location_data.longitude, pull
  //   ).subscribe(responde=>
  //   {
  //   console.log(responde)
  //   if(responde)
  //   {
  //     this.aux_offer_list.push(...responde.offers);
  //     this.loading = "ok";

  //     console.log(this.aux_offer_list)
  
  //     if (event) {
  //       event.target.complete();
  //     }
  
  //     if(responde.length === 0)
  //     {
  //       this.habilitado = 0;
  //     }
  //   }

  // })
  }


  getAllOffers( event?, pull: boolean = false )
{
  
this.dbServ.getAllOffersInf(pull).toPromise()
.then((offerData:any)=>
{
console.log(offerData);
  if(offerData.ok)
  {
    this.aux_offer_list.push(...offerData.offers);
    this.loading = "ok";

    console.log(this.aux_offer_list)

    if (event) {
      event.target.complete();
    }

    if(offerData.length === 0)
    {
      this.habilitado = 0;
    }
  }
})
}

  recargarOffer(event, habilitado) {

    
    if(habilitado == 1)
    {
      this.getAllOffers(event, true)
    }
    if(habilitado == 2)
    {
      this.loadPageOffer(event, true);
    }

    this.aux_offer_list= [];
   
    this.habilitado = habilitado;

    console.log(this.habilitado)
    //this.aux_offer_list= [];
  }


  

  ngOnInit() {
    
  }

}
