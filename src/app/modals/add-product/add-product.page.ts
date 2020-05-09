import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalCategoriesPage } from '../modal-categories/modal-categories.page';
import { CountriesService } from '../../services/countries.service';
import { Product } from '../../clases/product';
import { ZBar, ZBarOptions } from '@ionic-native/zbar/ngx';
import { DbService } from '../../services/db.service';
import { User } from '../../clases/user';
import { Seller } from '../../clases/seller';
import { Subscription } from 'rxjs';

//import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {
  
  searchText: string;
spinner:boolean=false;
  countries: Object;
 name:string;
 category:string;
 currency_price:string;
 price:number;
 messaje:string;
 kind:string="Producto";
 stock:number;
 bar_code:number;
 user:User;
 seller:Seller;
 product:Product;
 aux_product_list:Array<Product>;
 dbProducts:Array<Product>;
 prod_subcribe:Subscription;
 spinnerAC:boolean=false;

  constructor(private modalController: ModalController,
    private zbar: ZBar,
    private dbService:DbService,
    //private barcodeScanner: BarcodeScanner,
    private countrySrv:CountriesService) {
      this.prod_subcribe= new Subscription()
      this.product= new Product();
      this.dbProducts= new Array<Product>();
      this.aux_product_list= new Array<Product>();
      
      this.user=JSON.parse(localStorage.getItem("user_data"));
      this.dbService.checkIsVendor(this.user._id).subscribe((data:any)=>
      {
        this.seller=data.vendor_data;
      })

     /* this.dbService.getFilterProducts("").toPromise() .then((data:any)=>
    {
      console.log(data)
      this.dbProducts= data;
    })*/

      this.countrySrv.getCountries().subscribe((c)=>{
        this.countries= c;
        console.log(c);
      })
     }

     addNote(p)
     {
      this.product= p;
      this.searchText= p.name;
      this.name=p.name;
      this.aux_product_list= new Array<Product>();
      console.log(this.product);
     }
  
      async filter(input)
     {
       //console.log(input)
       if(this.prod_subcribe.closed== false)
       {
         console.log(this.prod_subcribe.closed)
        this.prod_subcribe.unsubscribe();
        console.log("abierto y cierra");
       }
  
       
       let key = this.searchText//input.detail.value
       //let key = input.detail.value
       console.log(key)
       if(key != undefined && key != "" && key != null && key != this.product.name && this.searchText.length > 3 )
       {

        this.spinnerAC=true;
       this.prod_subcribe = this.dbService.getFilterProducts(key).subscribe( (data:any)=>
        {console.log(this.prod_subcribe.closed)
          this.aux_product_list = data;
          console.log(data);
          
          this.spinnerAC=false
        })
       /* setTimeout(() => {
          this.aux_product_list =  this.dbProducts.filter(p => p.name.includes(key) );

          this.spinnerAC=false;
        }, 1000);*/

  
       }
       if( key == undefined || key == "" || key == null || key == this.product.name || this.searchText == this.product.name || this.searchText.length < 3 )
       {
         console.log("hola")
        this.spinnerAC=false;
         this.aux_product_list= new Array<any>();
       }
  
   
     }
     removeFocus(){
       //this.searchText= "";
       console.log("removeFocus");
  
     }


  async ModalCategories() {
    const modal = await this.modalController.create({
      component: ModalCategoriesPage,
      componentProps: {

      },
      cssClass:"modal"
      
    });
     modal.present();
     modal.onDidDismiss().then((data)=>{

      this.category = data.data.result.category;
      
    })
  }


  dismissModal()
  {
    this.modalController.dismiss({
      'dismissed': true
    })
  }

  saveProduct()
  {
    this.spinner=true;

    if(this.name && this.category && this.kind &&
    this.currency_price && this.price && this.name)
    {
     
      let p= new Product();
      p.name=this.searchText;
      p.currency_price= this.currency_price;
      p.price=this.price;
      p.category=this.category;
      p.bar_code=this.bar_code;
      p.kind= this.kind;
      p.stock= this.stock;
      console.log(p);

      this.seller.products.push(p);
      this.dbService.updateVendor(this.seller).toPromise()
      .then((data:any)=>
    {
      console.log(data);
      this.modalController.dismiss({
        "result":{
          "product": p
        },
        'dismissed': true
      }).then(()=>{
  
        this.spinner=false;
  
  
      });
    }
  )//then
      .catch((error)=>
    {
      console.log(error)
    }) //catch
    .finally(()=>
  {
    this.spinner=false;
    
  })//finally

    }

    else{
      this.messaje="*Tienes que completar todos los datos";
      this.spinner=false;
    }

  }

  /*async barCode()
  {
    let options: ZBarOptions = {
      flash: 'off',
      drawSight: false
    }

this.zbar.scan(options)
   .then(result => {
      console.log(result); // Scanned code
      this.bar_code=result;
   })
   .catch(error => {
      console.log(error); // Error message
   });
  }
*/
  

  ngOnInit() {
    this.messaje="";
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
      this.bar_code=result;
      
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
        this.searchText= data.product.name;
       
      }
    })
   })
   .catch(error => {
      console.log(error); // Error message
   });
  }

}
