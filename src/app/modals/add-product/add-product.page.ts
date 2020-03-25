import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalCategoriesPage } from '../modal-categories/modal-categories.page';
import { CountriesService } from '../../services/countries.service';
import { Product } from '../../clases/product';
import { ZBar, ZBarOptions } from '@ionic-native/zbar/ngx';
import { DbService } from '../../services/db.service';
import { User } from '../../clases/user';
//import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {
  
spinner:boolean=false;
  countries: Object;
 name:string;
 category:string;
 currency_price:string;
 price:number;
 messaje:string;
 kind:string;
 stock:number;
 bar_code:number;
 user:User;

  constructor(private modalController: ModalController,
    private zbar: ZBar,
    private dbService:DbService,
    //private barcodeScanner: BarcodeScanner,
    private countrySrv:CountriesService) {
      
      this.user=JSON.parse(localStorage.getItem("user_data"));

      this.countrySrv.getCountries().subscribe((c)=>{
        this.countries= c;
        console.log(c);
      })
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
      p.name=this.name;
      p.currency_price= this.currency_price;
      p.price=this.price;
      p.category=this.category;
      p.bar_code=this.bar_code;
      p.kind= this.kind;
      p.stock= this.stock;
      console.log(p);
      this.spinner=false;
      this.modalController.dismiss({
        "result":{
          "product": p
        },
        'dismissed': true
      }).then(()=>{
        this.dbService.createProduct(p, this.user._id).subscribe((data)=>{
          console.log(data);
          this.spinner=false;
        })
        
      });
    }

    else{
      this.messaje="*Tienes que completar todos los datos";
      this.spinner=false;
    }

  }

  async barCode()
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

  

  ngOnInit() {
    this.messaje="";
  }

}
