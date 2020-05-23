import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController, ToastController, NavController } from '@ionic/angular';
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
import { Subscription } from 'rxjs';
import { Purchase } from '../clases/purchase';
import { TokenService } from '../services/token.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-seller-shop',
  templateUrl: './seller-shop.page.html',
  styleUrls: ['./seller-shop.page.scss'],
})
export class SellerShopPage implements OnInit {

  
  sellerName:string;
  sellerId:string;
  offerId:string;
  user:User;
  user_id:string;
  products:Product[];
  foto:string;
   dataMarker:Seller;
   shop_name:string;
   offer: Offer;
   seller:Seller;
   cart: Cart;
   offerdata:Offer;
   purchase_sub:Subscription;
   is_logged:boolean= false


  constructor(private modalCtrl:ModalController,
    private activatedRoute: ActivatedRoute,
              private dbService:DbService,
              private navParams: NavParamsService,
              private toastController: ToastController,
            private postService:PostService,
          private navCtrl: NavController,
          private iab: InAppBrowser,
          private token: TokenService) { 
    
            this.offer= new Offer();
            this.seller= new Seller();
            this.cart= new Cart();

            this,dbService.getLogged$().subscribe((data)=>
          {
            this.is_logged = data;
            if(this.is_logged)
            {
              this.user = token.GetPayLoad().doc;

              this.cart.user_id= this.user_id;
              this.user_id=this.user._id;

            }

           
            
          })
              

              
              /*this.dbService.checkIsVendor(this.navParams.param.seller).toPromise()
              .then((data:any)=>
            {
              this.dataMarker= data.vendor_data;
            })*/

              


     

         /*   dbService.getUser(this.user_id).subscribe((user:User)=>{
                  
                  this.user=user;
              },
            (data)=>
          {
            console.log(data)          
          },
        ()=>
      {
        console.log("complete")
      })*//*

               this.dbService.getProdOfVendor(this.dataMarker._id).subscribe((data:any)=>{
                
                console.log(data);
                this.products= data.products_vendor
              },
              (data)=>
            {
              console.log("error: ",data, this.dataMarker)          
            },
          ()=>
        {
          console.log("complete")
        })

              */
              
              

              }               /* FIN DEL CONSTRUCTOR */

ionViewDidEnter()
{

                
}






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
      //this.cart.products.push(this.offerdata.product);
      this.cart.currency= this.offerdata.price_currency;
      this.cart.total += this.offerdata.price;
      this.offerdata.stock -= 1;
      
      //Luego se debe registrar el cambio en la oferta en bd
    }

    else
    {
      this.createToast();
    }

    }
   // "return_url":"http://ofertaqr.com/app/purchases/paymentcheck"

     payMobbex()
    {
     
      this.postService.pagarMobbex(

        JSON.stringify( {
           "total": this.offerdata.commission,
           "description": "Unproducto de prueba",
           "currency": "ARS",
          // "test": true,
           "reference": "prueba de compra",
           "redirect":false,
           "webhook": "https://ofertaqr.com/app/purchases/paymentcheck"
         })).subscribe((dataMobexApi:any)=>
     {
       console.log("dataMobexApi",dataMobexApi)
       if(dataMobexApi.result==true)
       {
        let p= new Purchase()
      
        p.influencer_id=this.user._id;
        p.offer_id= this.offerdata._id;
        p.price= this.cart.total;
        p.user_id= this.user._id;
        p.vendor_id= this.seller._id;
        p.transactionId= dataMobexApi.data.id;
        console.log("p: ",p)
       this.dbService.sendPurchase(p)
       .subscribe((dataP:any)=>
      {
        console.log(dataP)

        
        window.open(dataMobexApi.data.url,'_system', 'location=yes');
 
       }
       
       
     )
    }})




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

    
  if(this.navParams.param)
  {
   this.offer=  JSON.parse(this.navParams.param.offer); 
   this.sellerId= this.navParams.param.seller;
  
   console.log (this.navParams.param.seller);

   this.dbService.getVendorById (this.sellerId).subscribe((data:any)=>
  {
    this.seller= data;
    this.dataMarker= data;
    this.shop_name= this.seller.shop_name;
    this.cart.vendor_id= this.seller._id;
    this.products = this.dataMarker.products;
    console.log("vendedor: ", data);
  })
  }
  else{

    if (document.URL.indexOf("?") > 0) {
      let splitURL = document.URL.split("?");
      let splitParams = splitURL[1].split("&");
      let i: any;
      for (i in splitParams){
        let singleURLParam = splitParams[i].split('=');
        if (singleURLParam[0] == "offer"){
          this.offerId = singleURLParam[1];
        }
        if (singleURLParam[0] == "seller"){
          this.sellerName = singleURLParam[1];
        }
      }

      this.dbService.getVendorByName(this.sellerName).toPromise().then((data:any)=>
      {
        this.seller= data;
        this.dataMarker= data;
        this.shop_name= this.seller.shop_name;
        this.cart.vendor_id= this.seller._id;
        this.products = this.dataMarker.products;
      })
      this.dbService.getOffer(this.offerId).toPromise().then((data:any)=>
    {
      this.offer= data ;
      this.offerdata=this.offer;
      console.log(data)
    })

      
    }

  }

/*
    this.activatedRoute.params.subscribe((params) => {
      console.log('Params: ', params);
    });*/
    
//this.offer= this.webParams.get('offer');


/*
    this.dataMarker= this.navParams.param.seller
   //this.shop_name= this.seller.shop_name;
  
    this.offer= this.navParams.param.offer
    */


  }

}
