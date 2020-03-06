import { Component, OnInit, Input } from '@angular/core';
import { NavParams, ModalController, NavController } from '@ionic/angular';
import { categories } from '../../../environments/environment';


@Component({
  selector: 'app-modal-categories',
  templateUrl: './modal-categories.page.html',
  styleUrls: ['./modal-categories.page.scss'],
})
export class ModalCategoriesPage implements OnInit {

  list_cat = categories;
  aux_list_cat;

  constructor(public modalCtrl: ModalController, private navCtrl: NavController) {
    this.aux_list_cat= new Array();
    this.aux_list_cat=this.list_cat;
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


  ngOnInit() {
  }

}
