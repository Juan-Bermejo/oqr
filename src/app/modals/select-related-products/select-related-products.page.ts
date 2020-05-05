import { Component, OnInit } from '@angular/core';
import { DbService } from '../../services/db.service';
import { Seller } from '../../clases/seller';
import { User } from '../../clases/user';
import { Product } from '../../clases/product';
import { NavParamsService } from '../../services/nav-params.service';
import { ModalController } from '@ionic/angular';
import { AddProductPage } from '../add-product/add-product.page';

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
  type_offer:string;
  selected:Product;
  
  constructor(private dbService: DbService, 
     private modalCtrl:ModalController,
     private paramServ: NavParamsService) {

      this.selected= new Product();
      this.selected_products= new Array<Product>();

    this.type_offer = this.paramServ.param.type_offer;
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
     switch(this.type_offer)
     {
      case "Descuento":

      this.products[index].selected=!this.products[index].selected;

      let iSearch = this.selected_products.findIndex((p) => p.name == prod.name);
 
      if(iSearch > -1)
      {
       this.selected_products.splice(iSearch);
      }
      else{
        this.selected_products.push(prod);
      }
 
      break;

      case "Precio":

      if(this.selected._id == prod._id)
      {
        this.selected=new Product();
        this.products[index].selected=!this.products[index].selected;
      }
      else
      {
        if(this.products.findIndex((p) => p.product._id == this.selected._id) > -1)
        {          
          let iSearch = this.products.findIndex((p) => p.product._id == this.selected._id);
          this.products[iSearch].selected=false;
         
          this.products[index].selected=!this.products[index].selected;
        
        this.selected=prod;
        }
        else{
          this.selected= prod;
          this.products[index].selected=!this.products[index].selected;
        }
      }

      break;

      case "Gratis":

      if(this.selected._id == prod._id)
      {
        this.selected=new Product();
        this.products[index].selected=!this.products[index].selected;
      }
      else
      {
        if(this.products.findIndex((p) => p.product._id == this.selected._id) > -1)
        {          
          let iSearch = this.products.findIndex((p) => p.product._id == this.selected._id);
          this.products[iSearch].selected=false;
         
          this.products[index].selected=!this.products[index].selected;
        
        this.selected=prod;
        }
        else{
          this.selected= prod;
          this.products[index].selected=!this.products[index].selected;
        }
      }

      break;

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
        
      })
    
   }


   dismissModal(category_selected)
   {
     if(this.type_offer != "Descuento")
     {
      this.modalCtrl.dismiss({
        "result":{
          "product": this.selected
        },
        'dismissed': true
      })

     }
     if(this.type_offer == "Descuento")
     {
     this.modalCtrl.dismiss({
       "result":{
         "products": this.selected_products
       },
       'dismissed': true
     })
     }

   }


  ngOnInit() {
  }

}
