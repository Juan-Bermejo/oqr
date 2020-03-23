import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalCategoriesPage } from '../modal-categories/modal-categories.page';
import { CountriesService } from '../../services/countries.service';
import { Product } from '../../clases/product';
import { ZBar, ZBarOptions } from '@ionic-native/zbar/ngx';
//import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {
  

  countries: Object;
 name:string;
 brand:string;
 category:string;
 sub_brand:string;
 currency_price:string;
 price:string;
 messaje:string;
 kind:string;

  constructor(private modalController: ModalController,
    private zbar: ZBar,
    //private barcodeScanner: BarcodeScanner,
    private countrySrv:CountriesService) {
      
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
    if(this.name && this.category && this.kind &&
    this.currency_price && this.price && this.name)
    {
      let p= new Product();
      p.name=this.name;
      p.brand=this.brand;
      p.sub_brand=this.sub_brand;
      p.currency_price= this.currency_price;
      p.price=this.price;
      p.category=this.category;
  
      this.modalController.dismiss({
        "result":{
          "product": p
        },
        'dismissed': true
      })
    }

    else{
      this.messaje="*Tienes que completar todos los datos";
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
   })
   .catch(error => {
      console.log(error); // Error message
   });
  }

  

  ngOnInit() {
    this.messaje="";
  }

}
