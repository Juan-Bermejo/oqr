import { Component, OnInit } from '@angular/core';
import { Order } from '../../clases/order';
import { NavParamsService } from '../../services/nav-params.service';
import { ModalController } from '@ionic/angular';
import { DbService } from '../../services/db.service';
import { Seller } from '../../clases/seller';


@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.scss'],
})
export class ViewOrderComponent implements OnInit {

  seller_id: string;
  seller: Seller;
  order: any;



  constructor(private dbService: DbService,
  private modal: ModalController,
  private paramServ: NavParamsService) {

   }


  ionViewWillEnter()
  {
   // this.order= this.paramServ.GetParam;

  }

  dismissModal()
  {
    
    this.modal.dismiss({

      'dismissed': true
    })
  }


  closeTrabsaction()
  {
    this.dbService.closeTransaction(this.order._id, this.order.vendor_id )
    .toPromise()
    .then((data:any)=>
  {
    if(data.ok)
    {
      this.order.status="finalizada";
    }
    
  })
   
  }

  ngOnInit() {
    this.order= this.paramServ.GetParam;
    console.log(this.order)
  }

}
