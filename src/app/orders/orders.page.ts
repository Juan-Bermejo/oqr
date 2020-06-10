import { Component, OnInit } from '@angular/core';
import { Order } from '../clases/order';
import { Cart } from '../clases/cart';
import { Product } from '../clases/product';
import { Seller } from '../clases/seller';
import { DbService } from '../services/db.service';
import { ModalController } from '@ionic/angular';
import { ViewOrderComponent } from '../componentes/view-order/view-order.component';
import { NavParamsService } from '../services/nav-params.service';
import { CartDetail } from '../clases/cart-detail';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  seller_id: string;
  seller: Seller;
  orders_list: Array<Order>;

  constructor(private dbService: DbService,
  private modal: ModalController,
  private paramServ: NavParamsService) {

    this.orders_list = new Array<Order>();
   }

  ngOnInit() {


  }


  async ionViewWillEnter()
  {
    if (document.URL.indexOf("/") > 0) {
      let splitURL = document.URL.split("/");
     this.seller_id = splitURL[5].split("?")[0];
     console.log(this.seller_id)
     
    }

    await this.dbService.checkIsVendor(this.seller_id).toPromise().then((data:any)=>
    {
      this.seller = data.vendor_data;
    })
    
    let p = new Product();
    p._id="PRODUCT_ID";
    p.bar_code = 232132132132132;
    p.category= "Almacen";
    p.kind ="Producto";
    p.name = "Coca-cola x 2.25 lts";
    p.price = 150;
    p.stock = 20;

    let cart = new Cart();
    cart._id="CART_ID";
    cart.currency= "ARS";
    cart.products.push(p);
    cart.total = 150;
    cart.user_id = "5e7fbb798e60f15be3025c33";
    cart.vendor_id = this.seller_id;

    let cd = new CartDetail();

    cd._id="CART_DETAIL _ID";
    cd.currency= cart.currency;
    cd.price = p.price;
    cd.product_id = p._id;
    cd.product_name = p.name;
    cd.quantity = 1;

    cart.details.push(cd);
    


    let o = new Order();
    o.cart = cart;
    o._id= "ORDER_ID";
    o.checked = false;
    o.seller = this.seller;
    o.status = "ordered";

   await this.dbService.getUser(cart.user_id).toPromise().then((data:any)=>
  {
    o.user = data;
  });

  this.orders_list.push(o);

console.log(this.orders_list);
    
  }

  async clicked(order:Order)
  {
    if(!order.checked)
    {
      this.changeStatus(order);
    }
    this.paramServ.SetParam = order;

const orderModal =  await this.modal.create({
  component: ViewOrderComponent
})

orderModal.draggable= true;
orderModal.present();
orderModal.onDidDismiss().then((data)=>{
  
})
    
  }


  private changeStatus(order:Order)
  {
    let orderIndex = this.orders_list.findIndex(o => o._id == order._id);

    this.orders_list[orderIndex].checked = true;
  }

}
