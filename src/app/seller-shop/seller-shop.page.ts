import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController, ToastController, NavController, Platform } from '@ionic/angular';
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
import { ActivatedRoute, Router } from '@angular/router';
import { OfferInfluencersPageRoutingModule } from '../offer-influencers/offer-influencers-routing.module';
import { CartDetail } from '../clases/cart-detail';
import { CartComponent } from '../componentes/cart/cart.component';
import { LoginComponent } from '../componentes/login/login.component';
import { EditShopComponent } from '../componentes/edit-shop/edit-shop.component';
import { ModalCategoriesPage } from '../modals/modal-categories/modal-categories.page';
import { TypeOfferModalComponent } from '../componentes/type-offer-modal/type-offer-modal.component';
import { OfferViewComponent } from '../componentes/offer-view/offer-view.component';


@Component({
  selector: 'app-seller-shop',
  templateUrl: './seller-shop.page.html',
  styleUrls: ['./seller-shop.page.scss'],
})
export class SellerShopPage implements OnInit {

  search_tool: boolean;
  aux_products_list: Product[];
  aux_offer_list: any;
  precioanterior: Product;
  type_view:string="products";
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
   is_my_offer:boolean;
  array_prod_offer:Array<Product>;
  other_offers:Array<Offer>;
  offer_of_seller:{
    "association_date":number,
    "offer_products": Product[],
    "offer_id":string,
    "price":number,
    "commission":number,
    "stock":number,
    "currency": string,
    "product_image":string
  }
  cart_lenght:number=0;
  busqueda;

  constructor(private modalCtrl:ModalController,
              private platform: Platform,
              private activatedRoute: ActivatedRoute,
              private dbService:DbService,
              private navParams: NavParamsService,
              private router :Router,
              private toastController: ToastController,
              private postService:PostService,
              private navCtrl: NavController,
              private iab: InAppBrowser,
              private token: TokenService) { 

            this.aux_offer_list = new Array<Offer>();
            this.aux_products_list = new Array<Product>();
            this.other_offers = new Array<Offer>();
            this.array_prod_offer = new Array<Product>();
            this.offer= new Offer();
            this.seller= new Seller();
            this.cart= new Cart();

           /* this,dbService.getLogged$().subscribe((data)=>
          {
            this.is_logged = data;
            if(this.is_logged)
            {
              this.user = token.GetPayLoad().usuario;
              this.cart.user_id= this.user_id;
              this.user_id=this.user._id;
              this.user._id == this.seller.owner ? 
              this.is_my_offer = true : this.is_my_offer = false;
              console.log(this.is_my_offer);

            }

          })*/
            
              }               /* FIN DEL CONSTRUCTOR */

ionViewDidEnter()
{

                
}

async toCart()
{
  this.navParams.SetParam = this.cart;
  
  const modalCart= await this.modalCtrl.create({
    component: CartComponent
  })
  modalCart.present();
  modalCart.onDidDismiss().then((data)=>{
 
   this.cart = data.data.result.cart;
  // this.cart_lenght = this.cart.details.length;
   
   console.log(this.cart);
   
 })
}



  dismissModal()
  {
    this.modalCtrl.dismiss({

      'dismissed': true
    })
  }

  addOfferToCart( p:Product)
  {

    if(this.offer_of_seller.stock >0 )
    {
      let flag:boolean = false;
      let i:any;
      for(i in this.cart.details)
      {
        if(this.cart.details[i].product_id == p._id)
        {
          this.cart.details[i].quantity +=1;
          this.cart.details[i].price += this.offer_of_seller.commission;
          flag=true;
        }
      }
      if(!flag)
      {
        let cd=new CartDetail()
        cd.price = this.offer_of_seller.price;
        cd.product_id = p._id;
        cd.product_name = p.name;
        cd.currency = p.currency_price;
        cd.quantity += 1;
        this.cart.details.push(cd)
        this.cart_lenght++;
        this.cart.products.push(p);
      }

      this.cart.currency= this.offer.price_currency;
      this.cart.total += this.offer_of_seller.price;
      this.offer_of_seller.stock -= 1;
      console.log(this.cart)
      //Luego se debe registrar el cambio en la oferta en bd
    }

    else
    {
      this.createToast();
    }

    }
    removeOfferToCart(offer:Offer)
    {
      console.log(offer)
      let index = this.cart.details.findIndex(d => d.offer_id == offer._id )
      let indexOfferSeller =this.seller.offers.findIndex(o => o.offer_id == offer._id );
      let offerSeller = this.seller.offers.find(o => o.offer_id == offer._id );
      console.log(index)
      console.log(indexOfferSeller)
      console.log(offerSeller)
      if(index > -1)
      {
        if(this.cart.details[index].quantity > 1)
        {
          this.cart.details[index].quantity --;
          this.cart.total -= offerSeller.commission;
        }
        if(this.cart.details[index].quantity == 1)
        {
          this.cart.details[index].quantity --;
          this.cart.total -= offerSeller.commission;
          this.cart.details.splice(index, 1);
        }

      }


     
      console.log(this.cart)
    }



  addProductToCart(p:Product)
  { console.log(p);
    if(p.stock > 0 )
    {
      let flag:boolean = false;
      let i:any;
      for(i in this.cart.details)
      {

          if(this.cart.details[i].product_id == p._id  && this.cart.details[i].offer_id == undefined)
          {
            this.cart.details[i].quantity +=1;
            this.cart.details[i].price += p.price;
            flag=true;
          }
        

      }
      if(!flag)
      {
        let cd=new CartDetail()
        cd.price = p.price;
        cd. currency = p.currency_price;
        cd.product_id = p._id;
        cd.product_name = p.name;
        cd.quantity += 1;
        this.cart.details.push(cd)
        this.cart_lenght++;
        this.cart.products.push(p);
      }

  

      console.log(this.cart)

      this.cart.currency= p.currency_price;
      this.cart.total += p.price;
      p.stock -= 1;
      console.log(this.cart)
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

      this.removeProductToCart(prod)
      
    }

    console.log(this.cart)
  }

  removeProductToCart(p: Product)
  {
    let i:any;
    for( i in this.cart.details)
    {
      if(this.cart.details[i].product_id == p._id)
      {
        this.cart.details[i].quantity -= 1;
        this.cart.details[i].price -= p.price;
        if(this.cart.details[i].quantity == 0)
        {
          this.cart.details.splice(i,1);
          this.cart_lenght--;
        }
        this.cart.total -= p.price;
        p.stock += 1;
        
      }
    }
    console.log(this.cart);
  }

  ngOnInit() {

  
  

    /*

    if (document.URL.indexOf("?") > 0) {
      let splitURL = document.URL.split("?");
      let splitParams = splitURL[1].split("&");
      let i: any;
      for (i in splitParams){
        let singleURLParam = splitParams[i].split('=');
        if (singleURLParam[0] == "offer"){
          this.offerId = singleURLParam[1];
          console.log(singleURLParam[0])
        }
        if (singleURLParam[0] == "seller"){
          this.sellerName = singleURLParam[1];
          console.log(singleURLParam[0])
        }
      }*/

      if (document.URL.indexOf("/") > 0) {
        let splitURL = document.URL.split("/");
       console.log("splitUrlLenght: ",splitURL.length);
       console.log("splitUrl: ",splitURL);

       this.sellerName = splitURL[5].split("?")[0];
      }
      

      this.offerId= this.platform.getQueryParam("offer");



      this.dbService.getVendorByName(this.sellerName).subscribe((data:any)=>
      {
        this.sellerId = data._id;
        this.seller= data;
        console.log("vendedor: ", data)
        this.dataMarker= data;
        this.shop_name= this.seller.shop_name;
        this.cart.vendor_id= this.seller._id;
        this.products = this.dataMarker.products;
        this.aux_products_list= this.products;

        this.dbService.getOffersByVendor(this.sellerId).subscribe((data:any)=>
        {
          this.other_offers = data.offers_data;
          this.aux_offer_list = this.other_offers;
          console.log(data);
    
        })
      })



      this.dbService.getOffer(this.offerId).subscribe((data:any)=>
    {
      this.offer= data ;
      
      console.log("oferta psada por parametro: ", this.offer)
      data.sellers.map((s:Seller)=>
    {
      if(s._id==this.sellerId)
      {
        this.offerdata = data; 
        
        this.precioanterior =   this.products.find(p=> p._id == this.offerdata.products[0]._id);
        this.offer_of_seller = this.seller.offers.find(of=> of.offer_id == this.offerdata._id)
      }
    })

      console.log( this.offer_of_seller)
      console.log("offer data: ",this.offerdata)
    })

      
    

  

  this.dbService.getLogged$().subscribe((data)=>
  {
    this.is_logged = data;
    if(this.is_logged)
    {
      this.user = this.token.GetPayLoad().usuario;
      this.cart.user_id= this.user_id;
      this.user_id=this.user._id;
      this.user._id == this.seller._id ? 
      this.is_my_offer = true : this.is_my_offer = false;
      console.log(this.is_my_offer);

    }

  })

  }

  async addOtherOfferToCart(offer: Offer)
  {
   /* switch(offer.offer_name)
    {
      case "Precio":*/

      let offer_seller = await this.seller.offers.find(o => offer._id == o.offer_id);
      console.log(offer_seller);

      let i: any;
      let flag:boolean = false;
      for(i in this.cart.details)
      { console.log(offer_seller.offer_id)
        if(this.cart.details[i].offer_id == offer_seller.offer_id)
        {
          this.cart.details[i].price += offer_seller.commission;
          this.cart.details[i].quantity += 1;
          
          flag=true;
        }
      }
      if(!flag)
      {
        let cd=new CartDetail()
        cd.offer_id = offer_seller.offer_id;
        cd.price = offer_seller.commission;
        cd.product_id = offer_seller.offer_products[0]._id;
        cd.product_name = offer_seller.offer_products[0].name;
        cd.currency = offer_seller.currency;
        cd.quantity += 1;
        this.cart.details.push(cd)
        this.cart_lenght++;
        this.cart.products.push(offer_seller.offer_products[0]);
      }
      
      this.cart.total += offer_seller.commission;
      offer_seller.stock-=1;
      console.log(this.cart)

      /*   break;

         case "Gratis":

    }*/

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
           "redirect":true,
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



    async goToLogin()
{
  const modal = await this.modalCtrl.create({
    component: LoginComponent,
    cssClass:"modal"
    
  });
   modal.present();

   modal.onDidDismiss().then((data)=>{

     
    
  })

}



async editShop()
{
  this.navParams.SetParam=this.seller._id;
  const editModal = await this.modalCtrl.create({
    component:EditShopComponent,
    
  });
  editModal.draggable= true;
  editModal.present();
  editModal.onDidDismiss().then((data)=>{

     
    
  })
}


 async precioProducto(idProduct)
{

     this.precioanterior =  await this.products.find(p=> p._id == idProduct);
}

async filter(input)
{
  let key = input.detail.value

  switch(this.type_view)
  {
    case "products":

    if(key)
    {
      this.aux_products_list= await this.products.filter(item => item.name.toLowerCase().includes(key) );
    }
    else
    {
      this.aux_products_list=this.products;
    }
    break;

    case "offers":

    if(key)
    {
      this.aux_offer_list= await this.other_offers.filter(item => item.products[0].name.toLowerCase().includes(key) );
    }
    else
    {
      this.aux_offer_list=this.other_offers;
    }

    break;

  }
  
  


}

async searchTools()
{
  this.search_tool = !(this.search_tool);
  console.log(this.search_tool);
}

async categoryModal() {
  this.navParams.param=
  {
    "seller": this.seller
  } 
  const modalCategories = await this.modalCtrl.create({
    component: ModalCategoriesPage,
    cssClass:"modal"
    
  });
  modalCategories.present();

  modalCategories.onDidDismiss().then((data:any)=>{

     console.log(data.data.result.category);
    this.categoryFilter(data.data.result.category);
    
  })

}

async typeOfferModal()
{
  const modalTypes = await this.modalCtrl.create({
    component: TypeOfferModalComponent,
    cssClass:"modal"
    
  });
  modalTypes.present();

  modalTypes.onDidDismiss().then((data:any)=>{

     console.log(data.data.result.type)
    this.typeOfferFilter(data.data.result.type);
    
  })
}

async typeOfferFilter(type:string)
{
  this.aux_offer_list= await this.other_offers.filter(item => item.offer_name.toLowerCase().includes(type.toLowerCase()) );
}
async categoryFilter(type:string)
{
  this.aux_offer_list= await this.other_offers.filter(item => item.category.toLowerCase().includes(type.toLowerCase()) );
  this.aux_products_list= await this.products.filter(item => item.category.toLowerCase().includes(type.toLowerCase()) );
}


async viewOffer(offer:Offer)
{
  console.log(this.seller)
  let offer_seller = await this.seller.offers.find(o=>o.offer_id == offer._id);
console.log(offer_seller)
  this.navParams.SetParam = {
    "offer_seller": offer_seller,
    "offer": offer,
    "cart": this.cart,
    "addOfferCart": this.addOtherOfferToCart,
    "seller": this.seller
  }

  const offerModal = await this.modalCtrl.create(
    {
      component: OfferViewComponent
    }
  ) 

  offerModal.present();
}


ionViewWillEnter()
{
  this.dbService.getLogged$().subscribe((data)=>
  {
    this.is_logged = data;
    
    if(this.is_logged)
    {
      this.user = this.token.GetPayLoad().usuario;
      this.cart.user_id= this.user_id;
      this.user_id=this.user._id;
      this.user._id == this.seller.owner ? 
      this.is_my_offer = true : this.is_my_offer = false;
      console.log(this.is_my_offer);

    }
  })


}

}
