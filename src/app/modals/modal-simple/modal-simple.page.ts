import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-modal-simple',
  templateUrl: './modal-simple.page.html',
  styleUrls: ['./modal-simple.page.scss'],
})
export class ModalSimplePage implements OnInit {

  @Input() list_opt: Array<any>;

  constructor(public modalCtrl: ModalController, private navCtrl: NavController) {

   }
  
  dismissModal(selected)
  {
    this.modalCtrl.dismiss(selected);
  }



  ngOnInit() {
  }


}
