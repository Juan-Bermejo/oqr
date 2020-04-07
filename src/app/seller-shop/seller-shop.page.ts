import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams, ToastController, NavController } from '@ionic/angular';
import { NavParamsService } from '../services/nav-params.service';
import { DbService } from '../services/db.service';
import { User } from '../clases/user';
import { parse } from 'url';
import { Seller } from '../clases/seller';
import { Product } from '../clases/product';
import { Offer } from '../clases/offer';
import { Cart } from '../clases/cart';
import { PostService } from '../services/post.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-seller-shop',
  templateUrl: './seller-shop.page.html',
  styleUrls: ['./seller-shop.page.scss'],
})
export class SellerShopPage implements OnInit {

  
  user:User;
  user_id:string;
  products:Product[];
  foto:string;
   dataMarker:any;
   shop_name:string;
   offer: Offer;
   seller:Seller;
   cart: Cart;
   offerdata:any;


  constructor(private modalCtrl:ModalController,
              private dbService:DbService,
              private navParams: NavParamsService,
              private toastController: ToastController,
            private postService:PostService,
          private navCtrl: NavController,
          private iab: InAppBrowser) { 
              
              this.cart= new Cart();
              this.dataMarker= JSON.parse(this.navParams.param.seller)
              this.offer= JSON.parse(this.navParams.param.offer) ;
              this.offerdata=this.offer;
              
              this.user_id=JSON.parse(localStorage.getItem("user_data"))._id


              this.dbService.checkIsVendor(this.user_id).subscribe((data:any)=>
              {
                this.seller= data.vendor_data;
                this.shop_name= this.seller.shop_name;
                this.cart.vendor_id= this.seller._id;
                console.log(this.seller);
              },
              (data)=>
            {
              console.log(data)          
            },
          ()=>
        {
          console.log("complete")
        })

            dbService.getUser(this.user_id).subscribe((user:User)=>{
                  
                  this.user=user;
              },
            (data)=>
          {
            console.log(data)          
          },
        ()=>
      {
        console.log("complete")
      })

               this.dbService.getProdOfVendor(this.dataMarker.seller).subscribe((data:any)=>{
                console.log(this.dataMarker.seller)
                console.log(data);
                this.products= data.products_vendor
              },
              (data)=>
            {
              console.log("error: ",data, this.dataMarker.seller)          
            },
          ()=>
        {
          console.log("complete")
        })

              
              this.cart.user_id= this.user_id;
              

              }               /* FIN DEL CONSTRUCTOR */


  dismissModal()
  {
    this.modalCtrl.dismiss({

      'dismissed': true
    })
  }

  addOfferToCart( )
  {
    if(this.offerdata.stock >0 )
    {
      this.cart.products.push(this.offerdata.product);
      this.cart.currency= this.offerdata.price_currency;
      this.cart.total += this.offerdata.price;
      this.offerdata.stock -= 1;
  
      console.log(this.cart);
      //Luego se debe registrar el cambio en la oferta en bd
    }

    else
    {
      this.createToast();
    }

    }


    payMobbex()
    {

      this.postService.pagarMobbex(

       JSON.stringify( {
          "total": this.cart.total,
          "description": "Unproducto de prueba",
          "currency": "ARS",
          "test": true,
          "reference": "operacion de prueba1",
          "return_url":"http://localhost:8100/pay-return/"
        })).subscribe((data:any)=>
    {
      console.log(data)
      if(data.result==true)
      {
       // const browser = this.iab.create(data.data.url);
       window.open(data.data.url,'_system', 'location=yes');

      }
      
      
    },(error)=>
  {
    console.log(error)
  })
    }


  addProductToCart(product:Product)
  {
    if(product.stock > 0 )
    {
      this.cart.products.push(product.name);
      this.cart.currency= product.currency_price;
      this.cart.total += product.price;
      product.stock -= 1;
  
    }

    else
    {
      this.createToast();
    }

    //Luego se debe registrar el cambio en el producto en bd
  }

 async createToast()
  {
    await this.toastController.create(
      {
        position:"top",
        color:"danger",
        message:"Lo siento, ya no queda stock de este producto.",
        animated:true,
        
      }
    )
  }

  selectProd(prod:Product, data)
  {
    if(data.detail.checked)
    {
      this.addProductToCart(prod)

    }
    else{

      for(let i = 0; i < this.cart.products.length; i++)
      {
        if(prod.name == this.cart.products[i])
        {
          this.cart.products.splice(i);
          this.cart.total -= prod.price;
          prod.stock +=1;
        }
      }
      
    }

    console.log(this.cart)
  }

  ngOnInit() {

    this.dataMarker= this.navParams.param.seller
   //this.shop_name= this.seller.shop_name;
  
    this.offer= this.navParams.param.offer
    
  }

}
