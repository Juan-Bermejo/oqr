import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-type-offer-modal',
  templateUrl: './type-offer-modal.component.html',
  styleUrls: ['./type-offer-modal.component.scss'],
})
export class TypeOfferModalComponent implements OnInit {

  type:string;

  constructor(private modalCtrl: ModalController) { }

  select(type:string)
  {
   this.type = type;
   this.dismissModal();
  }

  dismissModal()
  {
    
    this.modalCtrl.dismiss({
      "result":{
        "type": this.type
      },
      'dismissed': true
    })
  }

  ngOnInit() {}

}
