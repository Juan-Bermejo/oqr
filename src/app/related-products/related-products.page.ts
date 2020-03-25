import { Component, OnInit } from '@angular/core';
import { Product } from '../clases/product';
import { ModalController } from '@ionic/angular';
import { AddProductPage } from '../modals/add-product/add-product.page';

@Component({
  selector: 'app-related-products',
  templateUrl: './related-products.page.html',
  styleUrls: ['./related-products.page.scss'],
})
export class RelatedProductsPage implements OnInit {

  array_products:Array<Product>;

  constructor(private modalCtrl: ModalController) {
    this.array_products= new Array<Product>();

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
          this.array_products.push(data.data.result.product);
         }
        
        
      })
    
   }

  ngOnInit() {
  }

}
