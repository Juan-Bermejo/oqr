import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Cart } from '../../clases/cart';
import { NavParamsService } from '../../services/nav-params.service';
import { DbService } from '../../services/db.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {

  message_whatsapp: string;
  cart:Cart;
  message:string= '';
  spinner: boolean = false;
  ok:string="";

  constructor(
    private dbs: DbService,
    private modalCtrl: ModalController,
    private navParams: NavParamsService) {

      this.cart = new Cart();


     }

     deleteCart()
     {
       this.cart = new Cart();

     }

     createCart()
     {
       this.spinner =true;
     
       setTimeout(() => {

        this.dbs.createCart(this.cart).toPromise().then((data:any)=>
        {
          console.log("retorno:", data);

          if(data.status==200)
          {
            this.spinner = false;
            this.message = "El pedido fue creado con exito."
            this.ok= "ok";
            this.cart = new Cart();
          }
          else{
            this.spinner = false;
            this.message = "No se pudo generar el pedido, intente mas tarde.";
            this.ok = "no";
          }
        })
        .catch((error:any)=>
      {
        console.log(error);
        this.spinner = false;
        this.message = "No se pudo generar el pedido, intente mas tarde.";
        this.ok = "no";
      })
         
       }, 1000);


     }
  

  dismissModal()
  {
    this.message ="";
    this.spinner = false;
    
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

     this.message_whatsapp = "Pedido de Ofertacerca.com: %0A";
    let i:any;
    for(i in this.cart.details)
    {
      this.message_whatsapp += "Producto: " + this.cart.details[i].product_name +"%0A"+
      "Cantidad: " + this.cart.details[i].quantity +"%0A"+
      "Precio: " + "ARS " + this.cart.details[i].price +"%0A";
      
    }
    this.message_whatsapp += "TOTAL DE LA COMPRA: ARS "+ this.cart.total;

    console.log(this.message_whatsapp);

  }

  ngOnInit() {}

}
