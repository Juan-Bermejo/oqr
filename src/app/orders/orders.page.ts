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
import { TokenService } from '../services/token.service';

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
    private token: TokenService,
    private paramServ: NavParamsService) {

    this.orders_list = new Array<any>();
  }


  ngOnInit() {
  }


  async ionViewWillEnter() {
    if (document.URL.indexOf("/") > 0) {
      let splitURL = document.URL.split("/");
      this.seller_id = splitURL[5].split("?")[0];
      console.log(this.seller_id)

      this.getOrders()
    }



    await this.dbService.checkIsVendor(this.seller_id).toPromise().then((data: any) => {
      this.seller = data.vendor_data;
    })


    console.log(this.orders_list);

  }

  async clicked(order: any) {
    if (!order.checked) {

      this.changeStatus(order);
    }
    this.paramServ.SetParam = order;

    const orderModal = await this.modal.create({
      component: ViewOrderComponent
    })

    orderModal.draggable = true;
    orderModal.present();
    orderModal.onDidDismiss().then((data) => {

    })

  }


  private changeStatus(order: any) {

    this.dbService.changeStatusOrderVendor(order._id, this.seller_id).toPromise()
    .then((data:any)=>
  {
    if(data.ok)
    {
      this.getOrders();
    }
  })

    let orderIndex = this.orders_list.findIndex(o => o._id == order._id);

    this.orders_list[orderIndex].checked = true;
  }

  private async getOrders()
  {
    await this.dbService.getTransactionVendor(this.seller_id).toPromise()
      .then((dataT: any) => {

        console.log(dataT);

        if (dataT.ok) {
          this.orders_list = dataT.transactions;
        }
      })
  }

}
