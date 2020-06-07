import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Cart } from '../../clases/cart';
import { NavParamsService } from '../../services/nav-params.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {

  cart:Cart;
  message:string;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParamsService) {

      this.cart = new Cart();


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
    this.cart = this.navParams.GetParam;

     this.message = "Pedido de Ofertacerca.com: %0A";
    let i:any;
    for(i in this.cart.details)
    {
      this.message += "Producto: " + this.cart.details[i].product_name +"%0A"+
      "Cantidad: " + this.cart.details[i].quantity +"%0A"+
      "Precio: " + "ARS " + this.cart.details[i].price +"%0A";
      
    }
    this.message += "TOTAL DE LA COMPRA: ARS "+ this.cart.total;

    console.log(this.message);

  }

  ngOnInit() {}

}
