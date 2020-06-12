import { Component, OnInit } from '@angular/core';
import { Cart } from '../../clases/cart';
import { ModalController } from '@ionic/angular';
import { NavParamsService } from '../../services/nav-params.service';
import { Offer } from '../../clases/offer';
import { Product } from '../../clases/product';
import { DbService } from '../../services/db.service';

@Component({
  selector: 'app-offer-view',
  templateUrl: './offer-view.component.html',
  styleUrls: ['./offer-view.component.scss'],
})
export class OfferViewComponent implements OnInit {


  cart:Cart;
  message:string;
  offer: Offer;
  products: Product[];


  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParamsService,
    private dbService: DbService) {
      this.offer = new Offer();
      this.products = new Array<Product>();



     }

     deleteCart()
     {
       this.cart = new Cart();

     }
  

  dismissModal()
  {
    
    this.modalCtrl.dismiss({
      "result":{
        "cart": this.cart
      },
      'dismissed': true
    })
  }

  ionViewWillEnter()
  {
    let data: any = this.navParams.GetParam;

    this.offer = data.offer;
    this.cart = data.cart;
    this.offer.products_id.forEach(prodId => {
      
      this.dbService.getProduct(prodId).subscribe((data:any)=>
    {
      console.log(data);
      this.products.push(data);
    })
      
    });
 
}
  

  

  ngOnInit()
  {

  }

}
