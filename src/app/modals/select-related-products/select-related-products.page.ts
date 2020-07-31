import { Component, OnInit } from '@angular/core';
import { DbService } from '../../services/db.service';
import { Seller } from '../../clases/seller';
import { User } from '../../clases/user';
import { Product } from '../../clases/product';
import { NavParamsService } from '../../services/nav-params.service';
import { ModalController } from '@ionic/angular';
import { AddProductPage } from '../add-product/add-product.page';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-select-related-products',
  templateUrl: './select-related-products.page.html',
  styleUrls: ['./select-related-products.page.scss'],
})
export class SelectRelatedProductsPage implements OnInit {

  category:string;
  array_products:Product[];
  seller:Seller;
  user:User;
  all:boolean= false;
  products: {"selected","product"}[];
  selected_products: any[];
  type_offer:string;
  selected:Product;
  
  constructor(private dbService: DbService, 
     private modalCtrl:ModalController,
     private paramServ: NavParamsService,
    private token: TokenService) {

      this.selected= new Product();
      this.selected_products= new Array<Product>();

    this.type_offer = this.paramServ.param.type_offer;
    this.category = this.paramServ.param.category;


   }

   addProduct(prod:any, index)
   {
     switch(this.type_offer)
     {
      case "Descuento":

      this.products[index].selected=!this.products[index].selected;

      let iSearch = this.selected_products.findIndex((p) => p.product_ref.name == prod.product_ref.name);
 
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
      

        this.dbService.checkIsVendor(this.user._id).toPromise().then( async (data:any)=>
        {
        this.seller = data.vendor_data;
       
    
        let p_filtred =  this.array_products.filter(p=>p.category == this.category);
    
        this.products = await p_filtred.map((p)=>
      {
        return {
          "product":p,
          "selected":false
        } 
      })
    
        });
        
      })
      console.log(this.products);
    
   }


   dismissModal()
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

  ionViewWillEnter()
  {
    this.user= this.token.GetPayLoad().usuario;

    this.dbService.checkIsVendor(this.user._id).toPromise().then( (data:any)=>
    {

    if(data)
    {
      this.seller = data.vendor_data;

      this.cargarProductos();
    }
   

    });
  }


  cargarProductos()
  {
    this.dbService.getProductsVendor(this.seller._id)
    .toPromise()
    .then((data:any)=>
  {
    this.array_products = data.data;
    //console.log(this.array_products);

    let p_filtred =  this.array_products.filter(p=>p.category == this.category);
    console.log(p_filtred);
    this.products = p_filtred.map((p)=>
  {
    return {
      "product":p,
      "selected":false
            } 

  })

  })
  }

}
