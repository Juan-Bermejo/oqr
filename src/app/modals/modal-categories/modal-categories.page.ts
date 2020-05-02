import { Component, OnInit, Input } from '@angular/core';
import { NavParams, ModalController, NavController } from '@ionic/angular';
import { categories } from '../../../environments/environment';
import { Product } from '../../clases/product';
import { DbService } from '../../services/db.service';
import { User } from '../../clases/user';
import { Seller } from '../../clases/seller';
import { NavParamsService } from '../../services/nav-params.service';


@Component({
  selector: 'app-modal-categories',
  templateUrl: './modal-categories.page.html',
  styleUrls: ['./modal-categories.page.scss'],
})
export class ModalCategoriesPage implements OnInit {

  seller: Seller;
  user: User;
  array_products: any[];
  list_cat = categories;
  aux_list_cat;

  constructor(public modalCtrl: ModalController, 
    private navCtrl: NavController,
     private dbserv:DbService,
    private paramServ: NavParamsService) {

      if(this.paramServ.param != undefined && this.paramServ.param.seller)
      {
        this.seller= this.paramServ.param.seller;
        this.array_products= new Array<Product>();
        this.user=JSON.parse(localStorage.getItem("user_data"));

        this.array_products= this.seller.products;
        this.aux_list_cat= this.list_cat.filter((cat)=>
      {
          if( this.array_products.find(prod=>prod.category == cat.name) )
          {
            return cat;
          }
      }) 
   
      console.log(this.aux_list_cat)
      }
      else{
        this.aux_list_cat= new Array();
        this.aux_list_cat= this.sortList(this.list_cat);
      }


   }
  
  dismissModal(category_selected)
  {
    
    this.modalCtrl.dismiss({
      "result":{
        "category": category_selected
      },
      'dismissed': true
    })
  }

  async filter(input)
  {
    let key = input.detail.value
    
    if(key)
    {
      this.aux_list_cat= await this.list_cat.filter(item => item.name.toLowerCase().includes(key) );
    }
    else
    {
      this.aux_list_cat=this.list_cat;
    }

  }
  sortList(array:Array<any>)
  {
    return array.sort(function(a, b){
      
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    
    });
  }


  ngOnInit() {
  }

}
