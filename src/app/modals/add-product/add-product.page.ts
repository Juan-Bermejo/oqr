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
import { TokenService } from '../../services/token.service';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

//import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {
  
  //file: File;
  photos: any;
//  searchText: string;
spinner:boolean=false;
  countries: Object;
 //name:string;
// category:string;
 //currency_price:string;
// price:number;
 messaje:string;
 kind:string="Producto";
 //stock:number;
 //bar_code:number;
 user:User;
 seller:Seller;
 product:Product;
 aux_product_list:Array<Product>;
 dbProducts:Array<Product>;
 prod_subcribe:Subscription;
 spinnerAC:boolean=false;
currencyF:string;

  constructor(private modalController: ModalController,
    private imagePicker: ImagePicker,
    private zbar: ZBar,
    private dbService:DbService,
    private tokenSrv: TokenService,
    private builder: FormBuilder,
    private countrySrv:CountriesService) {
      this.prod_subcribe= new Subscription()
      this.product= new Product();
      this.dbProducts= new Array<Product>();
      this.aux_product_list= new Array<Product>();
      
      this.user=this.tokenSrv.GetPayLoad().doc;
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


     category = new FormControl('', [
      Validators.required
    ]);
  
    price = new FormControl('', [
      Validators.required
    ]);

    currency_price = new FormControl('', [
      Validators.required
    ]);

    searchText = new FormControl('', [
      Validators.required
    ]);



  
  
    name= new FormControl('', [
      Validators.required
    ]);

    stock = new FormControl('', [
      Validators.required
    ]);

    file = new FormControl('', [
      Validators.required
    ]);

    bar_code = new FormControl('', [
      
    ]);

    
  
  
    registroForm: FormGroup = this.builder.group({
      category: this.category,
      price: this.price,
      currency_price: this.currency_price,
      stock: this.stock,
      name: this.name,
      file: this.file,
      searchText: this.searchText,
      barcode: this.bar_code
      

  
    });


     changeListener($event) : void {
     // this.file = $event.target.files[0];
     this.registroForm.controls['file'].setValue($event.target.files[0])
      console.log(this.file);

    }
    
    addPhoto()
    {
      
      //this.dbService.sendProductImage(fd);
    }

  /*   addPhoto()
     {
       let options: ImagePickerOptions = {
         maximumImagesCount: 1,
         
       }

      this.imagePicker.getPictures(options).then((results) => {
        for (var i = 0; i < results.length; i++) {
            console.log('Image URI: ' + results[i]);
        }
        this.photos= results;
      }, (err) => { });
     }*/

     addNote(p)
     {
      this.product= p;
      
      this.registroForm.controls['searchText'].setValue(p.name);
   
      this.registroForm.controls['name'].setValue(p.name);
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
  
       
       let key = this.registroForm.value.searchText// this.searchText.//input.detail.value
       //let key = input.detail.value
       console.log(this.registroForm)
       if(key != undefined && key != "" && key != null && key != this.product.name && this.registroForm.value.searchText.length > 3  )
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
       if( key == undefined || key == "" || key == null || key == this.product.name || this.registroForm.value.searchText == this.product.name ||this.registroForm.value.searchText.length < 3 )
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

    //  this.category.setValue(data.data.result.category);
      this.registroForm.controls['category'].setValue(data.data.result.category);
      
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

    if( this.registroForm.value.category && this.kind &&
      this.registroForm.value.currency_price && this.registroForm.value.price && this.registroForm.value.searchText)
    {
     /* let fd = new FormData();
      fd.append("image",this.file);

      this.dbService.sendImage(fd).toPromise().then((res:any)=>
     {
       console.log(res);
     })*/
     
      let p= new Product();
      p.name=this.registroForm.value.searchText;
      p.currency_price= this.registroForm.value.currency_price;
      p.price=this.registroForm.value.price;
      p.category=this.registroForm.value.category;
      p.bar_code=this.registroForm.value.bar_code;
      p.kind= this.kind;
      p.stock= this.registroForm.value.stock;
      console.log(p)

      let fd = new FormData();
      fd.append("image", this.registroForm.value.file);
      fd.append("product", JSON.stringify(p));
      fd.append("seller_id", this.seller._id);

    this.dbService.createProduct(fd).toPromise().then((data:any)=>
  {
    console.log(data);

    if(data.status == 200)
    {
      this.spinner =false;
      this.dismissModal();
    }
  }) 

      //this.seller.products.push(p);

/*
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
      this.spinner=false;
      this.messaje ="No se pudo guardar el producto."
    }) //catch
    .finally(()=>
  {
    this.spinner=false;
    
  })//finally*/

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
     // this.registroForm.value.bar_code=result;
      this.registroForm.controls['bar_code'].setValue(result);
      
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
        this.registroForm.controls['searchText'].setValue(data.product.name);
       // this.registroForm.value.searchText= data.product.name;
       
      }
    })
   })
   .catch(error => {
      console.log(error); // Error message
   });
  }

  probar()
  {
    console.log(this.registroForm)
  }

  addCurrency(value)
  {
    this.registroForm.controls['currency_price'].setValue(value);
console.log(value)
  }

}
