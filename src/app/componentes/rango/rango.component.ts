import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-rango',
  templateUrl: './rango.component.html',
  styleUrls: ['./rango.component.scss'],
})
export class RangoComponent implements OnInit {

  rango:number;

  constructor(private modalCtrl: ModalController) { }



  dismissModal()
  {
    
    this.modalCtrl.dismiss({
      "result":{
        "rango": this.rango
      },
      'dismissed': true
    })
  }

  ngOnInit() {}

}
