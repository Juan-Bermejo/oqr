import { Component, OnInit } from '@angular/core';
import { Cart } from '../../clases/cart';
import { ModalController, ToastController } from '@ionic/angular';
import { NavParamsService } from '../../services/nav-params.service';
import { Offer } from '../../clases/offer';
import { Product } from '../../clases/product';
import { DbService } from '../../services/db.service';
import { CartDetail } from '../../clases/cart-detail';
import { Seller } from '../../clases/seller';
import { CartComponent } from '../cart/cart.component';

@Component({
  selector: 'app-offer-view',
  templateUrl: './offer-view.component.html',
  styleUrls: ['./offer-view.component.scss'],
})
export class OfferViewComponent implements OnInit {


  addOfferCart: any;
  cart:Cart;
  message:string;
  offer: Offer;
  products: Product[];
  offer_seller:any;
  seller:Seller;


  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParamsService,
    private dbService: DbService,
    private toastController: ToastController) {
      this.offer = new Offer();
      this.products = new Array<Product>();



     }

     deleteCart()
     {
       this.cart = new Cart();

     }
  

  dismissModal()
  {
    
    this.modalCtrl.dismiss({
      "result":{
        "cart": this.cart
      },
      'dismissed': true
    })
  }

  ionViewWillEnter()
  {
    let data: any = this.navParams.GetParam;

    this.offer = data.offer;
    this.cart = data.cart;
    this.offer_seller = data.offer_seller;
    let auxP:Product[] = new Array<Product>();
     auxP = data.offer_seller.offer_products;
    this.seller = data.seller;
    console.log(this.seller)

    let i:any;
    let j: any;
    this.products = new Array<Product>();
  for (i in this.seller.products)
  {
    console.log(this.seller.products[i])
    for(j in auxP)
    {
      if(this.seller.products[i]._id == auxP[j]._id)
      {
        this.products.push(this.seller.products[i])
      }
    }
  }

    console.log(data.offer_seller);
  console.log(this.products);
  console.log(data)
 
}

removeProduct(p:Product)
{
let index = this.cart.details.findIndex(item => item.product_id == p._id && item.offer_id == this.offer._id);
console.log(index);
if(index != -1)
{
  if(this.cart.details[index].quantity > 1)
  {
    //this.cart.details[index].price -= this.offer_seller.commission;
    this.cart.details[index].quantity--;
  }
  if(this.cart.details[index].quantity == 1 )
  {
    this.cart.details[index].price -= this.offer_seller.commission;
    this.cart.details[index].quantity--;
    this.cart.total -= this.offer_seller.commission;
    this.cart.details.splice(index,1);
  }
  //this.cart.total -= this.offer_seller.commission;
}
console.log(this.cart)
}

selectProduct(p:Product)
{
 
  if(this.offer_seller.stock > 0 )
  {
    let flag:boolean = false;
    let i:any;

    for(i in this.cart.details)
    {
      if(this.cart.details[i].offer_id == this.offer_seller.offer_id)
      {
        if(this.cart.details[i].product_id == p._id)
        {
          this.cart.details[i].quantity +=1;
          //this.cart.details[i].price += this.offer_seller.commission;
          flag=true;
        }
        if(flag)
        {
          break;
        }
      }
    }
    if(!flag)
    {
      console.log("adentro");
      let cd=new CartDetail()
      cd.price = this.offer_seller.commission;
      cd. currency = this.offer.currency_commission;
      cd.product_id = p._id;
      cd.product_name = p.name;
      cd.offer_id = this.offer_seller.offer_id
      cd.quantity += 1;

      this.cart.details.push(cd)
      this.cart.currency= this.offer.currency_commission;
      this.cart.total += this.offer_seller.commission;
      this.cart.products.push(p);
    }
    



    console.log(this.cart)

    /*this.cart.currency= this.offer.currency_commission;
    this.cart.total += this.offer_seller.commission;*/
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
  

  ngOnInit()
  {

  }

}
