import { Component, OnInit, ViewChild } from '@angular/core';
import { kind_offer, categories } from '../../environments/environment';
import { IonSlides, IonSlide, ModalController, NavController, PopoverController } from '@ionic/angular';
import { User } from '../clases/user';
import { Location } from '../clases/location';
import { CountriesService } from '../services/countries.service';
import { NavParamsService } from '../services/nav-params.service';
import { AddLocationPage } from '../modals/add-location/add-location.page';
import { ModalCategoriesPage } from '../modals/modal-categories/modal-categories.page';
import { ModalSimplePage } from '../modals/modal-simple/modal-simple.page';
import { PopOverProductsComponent } from '../componentes/pop-over-products/pop-over-products.component';
import { Offer } from '../clases/offer';
import { DbService } from '../services/db.service';
import { of } from 'rxjs';
import { Seller } from '../clases/seller';


@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  
 // @ViewChild('slider',{ read: true, static: false }) private slider: IonSlides;
 @ViewChild('slides', {static: true}) slides: IonSlides;

  slideOpts = {
    initialSlide: 0,
    speed: 400,
  };

  user_id: string;
  user_data: User;
  
  categories = categories

  spinner:boolean=false;
  seller:Seller;
  user:User;
  index:number=0;
  id: number;
  product: string;
  price: number;
  stock: number;
  currency_commission:string;
  commission: number;
  category: string;
  sellers: User;
  locations: Location[];
  is_active:boolean;
  kind: string;
  description:string;
  cuantity:number;
  prod_currency;
  budget:number;
  region:Array<string>;
  countries;
  currencies;
  products;
 

  constructor(private countrySrv:CountriesService,
    private modalController: ModalController,
    public navCtrl: NavController,
    private ParamSrv: NavParamsService,
    private dbService: DbService )
     {
      this.user= JSON.parse(localStorage.getItem("user_data"));
      this.kind="Producto";
      this.countrySrv.getCountries().subscribe((c)=>{
        this.countries= c;
        console.log(c);
      })
      console.log(this.user)

      this.dbService.checkIsVendor(this.user._id).subscribe((data:any)=>
    {
      this.seller=data.vendor_data;
    })
   }


  next()
  {

    this.slides.getActiveIndex().then((index)=>{
  
      switch(index)
      {
        case 0:
        this.category != undefined &&
        this.kind != undefined &&
        this.product != undefined &&
        this.description != undefined
        ? this.lockUnlockSwipe() : this.slides.lockSwipeToNext(true)

        break;

        case 1:
        this.stock != undefined &&
        this.price != undefined &&
        this.prod_currency!= undefined &&
        this.commission != undefined &&
        this.currency_commission != undefined 
        ? this.lockUnlockSwipe() : this.slides.lockSwipeToNext(true)

        break;

        case 2:
       
        break;

        case 3:      
        this.description != "" ? this.lockUnlockSwipe() : this.slides.lockSwipeToNext(true)
        break;

        case 4:
        this.commission >= 0 ? this.slides.lockSwipeToNext(false) : this.slides.lockSwipeToNext(true)
        break;

        case 5:
        this.locations[0] != null ? this.lockUnlockSwipe() : this.slides.lockSwipeToNext(true)
        break;

      }

    })
  }

  lockUnlockSwipe()
  {

    this.slides.lockSwipeToNext(false).then(()=>{
      this.slides.slideNext().then(()=>{
        this.slides.lockSwipeToNext(true);
      })
    }) 
    
  }


  setIndex()
  {
    this.slides.getActiveIndex().then((i)=>{
      this.index= i;
      console.log(this.index)
    })
  }




  back()
  {
    this.slides.slidePrev()
  }

  


  async ModalCategories() {
    const modal = await this.modalController.create({
      component: ModalCategoriesPage,

      cssClass:"modal"
      
    });
     modal.present();
     modal.onDidDismiss().then((data)=>{

      this.category = data.data.result.category;
      
    })
  }



  saveOffer()
  {
    this.spinner=true;

    setTimeout(() => {
      
      
 

    let offer = new Offer()
    offer.category = this.category;
    offer.kind = this.kind;
    offer.currency_commission = this.currency_commission;
    offer.commission = this.commission;
    offer.price = this.price;
    offer.price_currency = this.prod_currency;
    offer.description = this.description;
    offer.product = this.product;
    offer.sellers.push(this.seller._id);
    offer.stock=this.stock;
    offer.views=0;
    offer.sellers_cuantity= offer.sellers.length;
console.log("offer: ", offer)
    this.dbService.createOffer(offer)
      .subscribe((data: any) => {
        if(data.status == 200) {

          this.dbService.offer_id = data.id;
          const toast = document.createElement('ion-toast');
          toast.message = 'Oferta creada con exito';
          toast.duration = 2000;
          document.body.appendChild(toast);
          this.spinner=false;
          return toast.present();

        }
        this.spinner=false;
      });

    this.dbService.updateUser(this.dbService.user_id, this.dbService.offer_id)
      .subscribe((data: any) => {
        if(data.status == 200) {

          this.navCtrl.navigateRoot('home');
          console.log('ok');

        }

      });
    }, 2000);
  }

  ngOnInit() {
    this.slides.lockSwipeToNext(true);
   /* setTimeout(() => {
      this.slider.lockSwipes(true);
  }, 500);   
   */
  }

}
