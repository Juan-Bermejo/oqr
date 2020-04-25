import { Component, OnInit } from '@angular/core';
import { DbService } from '../../services/db.service';
import { Seller } from '../../clases/seller';
import { User } from '../../clases/user';
import { Product } from '../../clases/product';
import { NavParamsService } from '../../services/nav-params.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-select-related-products',
  templateUrl: './select-related-products.page.html',
  styleUrls: ['./select-related-products.page.scss'],
})
export class SelectRelatedProductsPage implements OnInit {

  category:string;
  seller:Seller;
  user:User;
  all:boolean= false;
  products: {"selected","product"}[];
  selected_products: Product[];
  
  constructor(private dbService: DbService, 
     private modalCtrl:ModalController,
     private paramServ: NavParamsService) {

      this.selected_products= new Array<Product>();

    this.category = this.paramServ.param.category;

    this.user= JSON.parse(localStorage.getItem("user_data"));

    this.dbService.checkIsVendor(this.user._id).toPromise().then( (data:any)=>
    {
    this.seller = data.vendor_data;
   

    let p_filtred =  this.seller.products.filter(p=>p.category == this.category);

    this.products = p_filtred.map((p)=>
  {
    return {
      "product":p,
      "selected":false
    } 
  })

    });

   }

   addProduct(prod:Product, index)
   {
     this.products[index].selected=!this.products[index].selected;

     let iSearch = this.selected_products.findIndex((p) => p.name == prod.name);

     if(iSearch > -1)
     {
      this.selected_products.splice(iSearch);
     }
     else{
       this.selected_products.push(prod);
     }

     
   }


   selectAll(event)
   {
     if(this.all)
     {
       this.selected_products = this.products.map((p)=>
      {
        p.selected=true;
        return p.product;
      })
     }
     else{
      this.products.map((p)=>
      {
        p.selected=false;
        
      })
       this.selected_products.splice(0);
     }
   }


   dismissModal(category_selected)
   {
     this.modalCtrl.dismiss({
       "result":{
         "products": this.selected_products
       },
       'dismissed': true
     })
   }


  ngOnInit() {
  }

}
