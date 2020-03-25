import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { NavParamsService } from '../services/nav-params.service';
import { DbService } from '../services/db.service';
import { User } from '../clases/user';
import { parse } from 'url';
import { Seller } from '../clases/seller';
import { Product } from '../clases/product';

@Component({
  selector: 'app-seller-shop',
  templateUrl: './seller-shop.page.html',
  styleUrls: ['./seller-shop.page.scss'],
})
export class SellerShopPage implements OnInit {

  
  user:User;
  user_id:string;
  products:Product[];
  public seller:Seller;
  public shop_name:string;
  constructor(private modalCtrl:ModalController,
              private dbService:DbService,
            private navParams: NavParams) { 

                this.seller= JSON.parse(this.navParams.get('seller'));
               
                this.shop_name= this.seller.shop_name;
                this.user_id=JSON.parse(localStorage.getItem("user_data"))._id

                 dbService.getUser(this.user_id).subscribe((user:User)=>{

                  this.user=user;
              })

this.dbService.getProdOfVendor(this.seller._id).subscribe((data:any)=>{
  console.log(data);
  this.products= data.location_data
})

  }


  dismissModal()
  {
    this.modalCtrl.dismiss({

      'dismissed': true
    })
  }

  ngOnInit() {
  }

}
