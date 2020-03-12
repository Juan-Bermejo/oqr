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
    let p1= new Product();

    p1.category="Alimentos";
    p1.name="Cafe Dolca";

    p1.currency_price="ARS";
    p1.price="120";

    let p2= new Product();

    p2.category="Alimentos";
    
    p2.name="Azucar Ledesma";
    p2.currency_price="ARS";
    p2.price="80";

    this.array_products.push(p1);
    this.array_products.push(p2);

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
