import { Component, OnInit } from '@angular/core';
import { Product } from '../clases/product';
import { ModalController } from '@ionic/angular';
import { AddProductPage } from '../modals/add-product/add-product.page';
import { DbService } from '../services/db.service';
import { User } from '../clases/user';
import { Seller } from '../clases/seller';
import { TokenService } from '../services/token.service';


@Component({
  selector: 'app-related-products',
  templateUrl: './related-products.page.html',
  styleUrls: ['./related-products.page.scss'],
})
export class RelatedProductsPage implements OnInit {

  user:User;
  array_products:Array<Product>;
  seller:Seller;

  constructor(private modalCtrl: ModalController, private dbserv: DbService, private token: TokenService) {
    this.array_products= new Array<Product>();
    this.user=this.token.GetPayLoad().doc;
    this.dbserv.checkIsVendor(this.user._id).subscribe((data:any)=>
  {
    this.seller= data.vendor_data;
    this.array_products= this.seller.products;
  })


   }


   async addProductModal()
   {
    
      const modal = await this.modalCtrl.create({
        component: AddProductPage,
        componentProps: {
  
        },
        cssClass:"modal"
        
      });
       modal.present();
       modal.onDidDismiss().then((data)=>{
         if(data)
         {
         // this.array_products.push(data.data.result.product);
         this.dbserv.checkIsVendor(this.user._id).subscribe((data:any)=>
         {
           this.seller= data.vendor_data;
           this.array_products= this.seller.products;
         })
         }
        
        
      })
    
   }

   ionViewWillEnter()
   {
    this.user=this.token.GetPayLoad().doc;
    this.dbserv.checkIsVendor(this.user._id).subscribe((data:any)=>
  {
    this.seller= data.vendor_data;
    this.array_products= this.seller.products;
    console.log("seller: ",this.seller)
  })

   }

  ngOnInit() {
  }

}
