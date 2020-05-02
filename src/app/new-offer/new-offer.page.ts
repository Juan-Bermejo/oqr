import { Component, OnInit, ViewChild } from '@angular/core';
import { kind_offer, categories } from '../../environments/environment';
import { IonSlides, IonSlide, ModalController, NavController, PopoverController, AlertController } from '@ionic/angular';
import { User } from '../clases/user';
import { Location } from '../clases/location';
import { CountriesService } from '../services/countries.service';
import { NavParamsService } from '../services/nav-params.service';
import { AddLocationPage } from '../modals/add-location/add-location.page';
import { ModalCategoriesPage } from '../modals/modal-categories/modal-categories.page';
import { ModalSimplePage } from '../modals/modal-simple/modal-simple.page';
import { PopOverProductsComponent } from '../componentes/pop-over-products/pop-over-products.component';
import { Offer } from '../clases/offer';
import { DbService } from '../services/db.service';
import { of, Subscription } from 'rxjs';
import { Seller } from '../clases/seller';
import { ZBar, ZBarOptions } from '@ionic-native/zbar/ngx';
import { Product } from '../clases/product';
import { SelectRelatedProductsPage } from '../modals/select-related-products/select-related-products.page';


@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  
 // @ViewChild('slider',{ read: true, static: false }) private slider: IonSlides;
 @ViewChild('slides', {static: true}) slides: IonSlides;

  slideOpts = {
    initialSlide: 0,
    speed: 400,
  };

  user_id: string;
  user_data: User;
  check_time_discount:boolean;
  categories = categories
  prod_subcribe:Subscription;
  type_offer:string;
  spinner:boolean=false;
  seller:Seller;
  user:User;
  index:number=0;
  id: number;
  product: Product;
  price: number;
  stock: number;
  currency_commission:string;
  commission: number;
  category: string;
  sellers: User;
  locations: Location[];
  is_active:boolean;
  kind: string;
  description:string;
  cuantity:number;
  prod_currency;
  budget:number;
  region:Array<string>;
  countries;
  currencies;
  products:Product[];
  brand:string;
  barcode:number;
  offer_exist:boolean=true;
  percentage:number;
  o_prueba:Offer;
  searchText:string;
  product_list:Array<Product>;
  aux_product_list:Array<Product>;


  constructor(private countrySrv:CountriesService,
    private modalController: ModalController,
    public navCtrl: NavController,
    private ParamSrv: NavParamsService,
    private alertCtrl: AlertController,
    private zbar: ZBar,
    private dbService: DbService )
     {
       this.prod_subcribe= new Subscription()
       this.product= new Product();
       this.products= new Array<Product>();
      this.aux_product_list= new Array<Product>();
       
       
      this.user= JSON.parse(localStorage.getItem("user_data"));
      this.kind="Producto";
      this.countrySrv.getCountries().subscribe((c)=>{
        this.countries= c;
        console.log(c);
      })
      console.log(this.user)

      this.dbService.checkIsVendor(this.user._id).subscribe((data:any)=>
    {
      this.seller=data.vendor_data;
    })
   }



   addNote(p)
   {
    this.product= p;
    this.searchText= p.name;
    this.aux_product_list= new Array<Product>();
    console.log(this.product);
   }

    filter(input)
   {
     if(this.prod_subcribe.closed== false)
     {
       console.log(this.prod_subcribe.closed)
      this.prod_subcribe.unsubscribe();
      console.log("abierto y cierra");
     }

     this.spinner=true;
     let key = this.searchText//input.detail.value
     //let key = input.detail.value
     console.log(key)
     if(key != undefined && key != "" && key != null && key != this.product.name )
     {
     this.prod_subcribe = this.dbService.getFilterProducts(key).subscribe( (data:any)=>
      {console.log(this.prod_subcribe.closed)
        this.aux_product_list = data;
        console.log(data);
        
        this.spinner=false
      })

     }
     if( key == undefined || key == "" || key == null || key == this.product.name || this.searchText == this.product.name)
     {
      this.spinner=false;
       this.aux_product_list= new Array<any>();
     }

 
   }
   removeFocus(){
     this.searchText= "";
     console.log("removeFocus");

   }


  next()
  {

    this.slides.getActiveIndex().then((index)=>{
      
     
      switch(index)
      {
        case 0: 
        console.log(this.type_offer)
        this.type_offer != undefined
        ? this.lockUnlockSwipe() : this.slides.lockSwipeToNext(true)
        break;

        case 1:
        if(this.type_offer == 'Precio')
        {
          this.category != undefined &&
          this.kind != undefined &&
          this.product != undefined /*&&
          this.description != undefined*/
          ? this.lockUnlockSwipe() : this.slides.lockSwipeToNext(true)
        }
        if(this.type_offer == 'Descuento')
        {
          this.category != undefined &&
          this.products != undefined /*&&
          this.description != undefined*/
          ? this.lockUnlockSwipe() : this.slides.lockSwipeToNext(true)
        }
        if(this.type_offer == 'Gratis')
        {
          this.category != undefined &&
          this.kind != undefined &&
          this.product != undefined &&
          this.description != undefined
          ? this.lockUnlockSwipe() : this.slides.lockSwipeToNext(true)
        }




        break;

        case 2:

        if(this.type_offer=='Precio')
        {
          this.stock != undefined &&
          this.price != undefined &&
          this.prod_currency!= undefined &&
          this.commission != undefined &&
          this.currency_commission != undefined 
          ? this.lockUnlockSwipe() : this.slides.lockSwipeToNext(true);
        }
        
        if(this.type_offer!='Precio')
        {
          this.stock != undefined &&
          this.commission != undefined &&
          this.currency_commission != undefined 
          ? this.lockUnlockSwipe() : this.slides.lockSwipeToNext(true);
        }


        break;

        case 3:
       
        break;

        case 4:      
        //this.description != "" ? this.lockUnlockSwipe() : this.slides.lockSwipeToNext(true)
        break;

        case 5:
       // this.commission >= 0 ? this.slides.lockSwipeToNext(false) : this.slides.lockSwipeToNext(true)
        break;

        case 6:
       // this.locations[0] != null ? this.lockUnlockSwipe() : this.slides.lockSwipeToNext(true)
        break;

      }

    })
  }

  lockUnlockSwipe()
  {

    this.slides.lockSwipeToNext(false).then(()=>{
      this.slides.slideNext().then(()=>{
        this.slides.lockSwipeToNext(true);
      })
    }) 
    
  }


  setIndex()
  {
    this.slides.getActiveIndex().then((i)=>{
      this.index= i;
      console.log(this.index)
    })
  }




  back()
  {
    this.slides.slidePrev()
  }

  


  async ModalCategories() {
    this.ParamSrv.param=
    {
      "seller": this.seller
     
    }
    const modal = await this.modalController.create({
      component: ModalCategoriesPage,

      cssClass:"modal"
      
    });
     modal.present();
     modal.onDidDismiss().then((data)=>{
    
      this.category = data.data.result.category;
      this.ParamSrv.param={};
      
    })
  }

  async ModalRelatedProducts()
  {
    this.ParamSrv.param=
    {
      "category": this.category,
      "type_offer":this.type_offer
    }
    const modal = await this.modalController.create({
      component: SelectRelatedProductsPage,

      cssClass:"modal"
      
    });
     modal.present();
     modal.onDidDismiss().then((data)=>{
      console.log(data.data)
      this.products = data.data.result.products;
      this.product = data.data.result.product;
      
    })
  }



  saveOffer()
  {
    this.spinner=true;

    setTimeout( () => {

/*
          const alert = await this.alertCtrl.create({

            backdropDismiss:true,
            header: "Ya existe una oferta de este producto.",
            subHeader:  "Puedes adherirte a la oferta existente o crear una nueva.",
            message: "Si creas una nueva oferta quedará en revisión hasta que se establezca el precio promedio entre todos los vendedores.",
            
    
            buttons: [
              {
                text: 'Cancelar',
                role: 'cancel',
                cssClass: 'parimary',
                
                handler: () => {
    
                }
              }, {
                text: 'Ver oferta existente.',
                handler: () => {
                  this.ParamSrv.param=
                  {
                    
                    seller: this.seller
                  }
                   this.navCtrl.navigateRoot("asociate-offer");
                }
              }
            ]
          });
      
          await alert.present();
            */
    


  let offer = new Offer()
  this.check_time_discount ? offer.time_discount = Date.now() : offer.time_discount=0;
  if(this.type_offer=='Precio')
  {
   
    offer.category = this.category;
    offer.one_product= this.product;
    offer.kind = this.kind;
    offer.currency_commission = this.currency_commission;
    offer.commission = this.commission;
    offer.price = this.price;
    offer.price_currency = this.prod_currency;
    offer.description = this.description;
    offer.offer_name = this.type_offer;
    offer.sellers.push(this.seller._id);
    offer.stock=this.stock;
    offer.views=0;
    offer.sellers_cuantity= offer.sellers.length;
    offer.offer_name= "Precio"
    offer.is_active=false;
    offer.products_id.push(this.product._id);
  }
  if(this.type_offer=='Descuento')
  {
    offer.category = this.category;
    offer.currency_commission = this.currency_commission;
    offer.commission = this.commission;
    offer.percentage= this.percentage;
    offer.description = this.description;
    offer.offer_name = this.type_offer;
    
    offer.sellers.push(this.seller._id);
    offer.stock=this.stock;
    //offer.products_id.push(this.product._id); 
    offer.views=0;
    offer.offer_name= "Descuento";
    offer.sellers_cuantity= offer.sellers.length;
    offer.is_active=false;
        
    for(let i=0; i< this.products.length; i++)
    {
      offer.products_id.push(this.products[i]._id);
    }
  }
  if(this.type_offer=='Gratis')
  {
    offer.category = this.category;
    offer.currency_commission = this.currency_commission;
    offer.commission = this.commission;
    offer.description = this.description;
    offer.offer_name = this.type_offer;
    offer.sellers.push(this.seller._id);
    offer.stock=this.stock;
    offer.one_product= this.product;
    offer.views=0;
    offer.sellers_cuantity= offer.sellers.length;
    offer.is_active=false;
        

  }

  console.log(offer)

  

    this.saveOfferDB(offer);


    
      


    
    }, 1000);
  }



  saveOfferDB(offer)
  {
    this.dbService.createOffer(offer)
      .subscribe((data: any) => {
        if(data.status == 200) {

          this.dbService.offer_id = data.id;
          const toast = document.createElement('ion-toast');
          toast.message = 'Oferta creada con exito';
          toast.duration = 2000;
          document.body.appendChild(toast);
          this.spinner=false;
          return toast.present();

        }
        this.spinner=false;
      });

    this.dbService.updateUser(this.dbService.user_id, this.dbService.offer_id)
      .subscribe((data: any) => {
        if(data.status == 200) {

          this.navCtrl.navigateRoot('home');
          console.log('ok');

        }

      });
  }

  ngOnInit() {
    this.slides.lockSwipeToNext(true);
   /* setTimeout(() => {
      this.slider.lockSwipes(true);
  }, 500);   
   */
  }

  async readBarcode()
  {
    let options: ZBarOptions = {
      flash: 'off',
      drawSight: false,
      text_instructions:"Coloque el codigo en el lector.",
      text_title:"Lector de codigo de barras."
      
    }

this.zbar.scan(options)
   .then(result => {
      console.log(result); // Scanned code
      this.barcode=result;
      
      this.dbService.checkProductByCode(result.toString()).subscribe((data:any)=>
    {
      if(data.product == "not exist")
      {
        const toast = document.createElement('ion-toast');
        toast.message = 'No se encontro ningun producto.';
        toast.duration = 2000;
        toast.position = "top";
        document.body.appendChild(toast);
        return toast.present(); 
      }
      else{
        this.product= data.product;
        this.searchText= this.product.name;
      }
    })
   })
   .catch(error => {
      console.log(error); // Error message
   });
  }

  async validatePercentage(event)
  {
    var msj:string;

    if(this.percentage != undefined)
    {
      if(this.percentage < 1)
      {
        msj="El porcentaje no puede ser menor a 1";
        const alert= await this.alertCtrl.create(
          {
            header: "Advertencia!",
            message:msj,
            buttons: [
              {
                text: 'Ok',
                role: 'cancel',
                cssClass: 'parimary',
                
                handler: () => {
    
                }
              }
            ]
          }
        );
  
        alert.present().then(()=>
      {
        this.percentage=1;
      })

      }
      if(this.percentage > 100)
      {

        msj="El porcentaje no puede ser mayor a 100";
        const alert= await this.alertCtrl.create(
          {
            header: "Advertencia!",
            message:msj,
            buttons: [
              {
                text: 'Ok',
                role: 'cancel',
                cssClass: 'parimary',
                
                handler: () => {
    
                }
              }
            ]
          }
        );
  
        alert.present().then(()=>
        {
          this.percentage=100;
        });
     
      }
      
    }
    
  }

 


}
