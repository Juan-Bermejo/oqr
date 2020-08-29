import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-delivery-address',
  templateUrl: './delivery-address.component.html',
  styleUrls: ['./delivery-address.component.scss'],
})
export class DeliveryAddressComponent implements OnInit {

  constructor(private modalCtrl:ModalController) { }

  ngOnInit() {}


  dismissModal()
  {
    
    this.modalCtrl.dismiss({

      'dismissed': true
    })
  }

}
