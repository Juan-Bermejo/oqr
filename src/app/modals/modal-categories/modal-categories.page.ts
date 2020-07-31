import { Component, OnInit, Input } from '@angular/core';
import { NavParams, ModalController, NavController } from '@ionic/angular';
import { categories } from '../../../environments/environment';
import { Product } from '../../clases/product';
import { DbService } from '../../services/db.service';
import { User } from '../../clases/user';
import { Seller } from '../../clases/seller';
import { NavParamsService } from '../../services/nav-params.service';
import { TokenService } from '../../services/token.service';


@Component({
  selector: 'app-modal-categories',
  templateUrl: './modal-categories.page.html',
  styleUrls: ['./modal-categories.page.scss'],
})
export class ModalCategoriesPage implements OnInit {

  seller_data: Seller;
  user: User;
  array_products: any[];
  list_cat = categories;
  aux_list_cat;
  busqeda:string;

  constructor(public modalCtrl: ModalController, 
    private navCtrl: NavController,
    private dbserv:DbService,
    private paramServ: NavParamsService,
    private token: TokenService) { }


  
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

  ionViewWillEnter()
  {

     if(this.paramServ.param != undefined && this.paramServ.param.seller)
      {
        this.user=this.token.GetPayLoad().usuario;

        this.array_products= new Array<Product>();

        this.dbserv.checkIsVendor(this.user._id)
        .toPromise()
        .then((dataUser:any)=>
      {
        if(dataUser.ok)
        {
          console.log(dataUser.vendor_data)
          this.seller_data = dataUser.vendor_data;
          
          this.dbserv.getProductsVendor(dataUser.vendor_data._id)
          .toPromise()
          .then((data:any)=>
        {
          console.log(data);
            this.array_products = data.data;
           
      
            if(data)
            {
              this.aux_list_cat= this.list_cat.filter((cat)=>
              {
                  if( this.array_products.find(prod=>prod.category == cat.name) )
                  {
                    return cat;
                  }
              })
            }
          
        })
        }
      })
        console.log(this.paramServ.param.seller)
       
      }
      else{
        this.aux_list_cat= new Array();
        this.aux_list_cat= this.sortList(this.list_cat);
      }
    
  }

  cargarProductos()
  { 
   

    

  }


  ngOnInit() {
  }

}
