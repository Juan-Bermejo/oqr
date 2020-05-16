import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-input-code-influencer',
  templateUrl: './input-code-influencer.component.html',
  styleUrls: ['./input-code-influencer.component.scss'],
})
export class InputCodeInfluencerComponent implements OnInit {

  influencer_code:string;

  constructor(private modalCtrl: ModalController, private navCtrl: NavController) { }


  influencerCanal()
  {
    this.navCtrl.navigateRoot('canal-influencer').then(()=>
  {
    this.dismissModal();
  })
  }

  dismissModal()
  {
    
    this.modalCtrl.dismiss({

      'dismissed': true
    })
  }

  ngOnInit() {}

}
