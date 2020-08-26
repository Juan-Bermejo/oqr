import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { DbService } from '../../services/db.service';

@Component({
  selector: 'app-input-code-influencer',
  templateUrl: './input-code-influencer.component.html',
  styleUrls: ['./input-code-influencer.component.scss'],
})
export class InputCodeInfluencerComponent implements OnInit {

  spinner: boolean;
  msj: string = "";
  influencer_code: string;

  constructor(private modalCtrl: ModalController,
    private dbservice: DbService,
    private navCtrl: NavController) { }


  influencerCanal() {
    this.spinner = true;
    this.msj = "";

    setTimeout(() => {

      this.dbservice.getInfByCode(this.influencer_code).toPromise()
        .then((data: any) => {
          console.log(data);


          if (data.ok) {
            this.spinner = false;
            this.navCtrl.navigateRoot('canal-influencer?i=' + this.influencer_code).then(() => {
              this.dismissModal();
            })
          }
          else {
            this.spinner = false;
            this.msj = "Codigo incorrecto."
            this.influencer_code = "";
          }

        })
        .catch((err) => {
          this.msj = "Ha ocurrido un error.";
          this.spinner = false;
        })

    }, 1000);


  }

  dismissModal() {

    this.modalCtrl.dismiss({

      'dismissed': true
    }).then(() => {
      this.msj = "";
      this.influencer_code = "";
    })
  }

  ngOnInit() { }

}
