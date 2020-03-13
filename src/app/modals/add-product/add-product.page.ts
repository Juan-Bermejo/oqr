import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalCategoriesPage } from '../modal-categories/modal-categories.page';
import { CountriesService } from '../../services/countries.service';
import { Product } from '../../clases/product';

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

  

  ngOnInit() {
    this.messaje="";
  }

}
