import { Component, OnInit, Input } from '@angular/core';
import { NavParams, ModalController, NavController } from '@ionic/angular';


@Component({
  selector: 'app-modal-categories',
  templateUrl: './modal-categories.page.html',
  styleUrls: ['./modal-categories.page.scss'],
})
export class ModalCategoriesPage implements OnInit {

  list_cat: string[]= Array(10);

  constructor(public modalCtrl: ModalController, private navCtrl: NavController) { }
  
  dismissModal()
  {
    this.modalCtrl.dismiss({
      'dismissed': true
    })
  }

  ngOnInit() {
  }

}
