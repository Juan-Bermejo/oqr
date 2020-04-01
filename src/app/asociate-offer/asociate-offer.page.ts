import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, AlertController } from '@ionic/angular';
import { NavParamsService } from '../services/nav-params.service';
import { DbService } from '../services/db.service';
import { Offer } from '../clases/offer';
import { Seller } from '../clases/seller';

@Component({
  selector: 'app-asociate-offer',
  templateUrl: './asociate-offer.page.html',
  styleUrls: ['./asociate-offer.page.scss'],
})
export class AsociateOfferPage implements OnInit {

  offer:Offer;
  seller:Seller;
  checkProducts:boolean;

  constructor(private modalController: ModalController,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    private ParamSrv: NavParamsService,
   private dbServ:DbService) {

    this.offer=this.ParamSrv.param.offer;
    this.seller=this.ParamSrv.param.seller;
    console.log(this.offer)
    console.log(this.seller)

    }

    async associate()
    {
      let msj:string;

      this.checkProducts ? msj = ' <h3> Confirma para participar de esta oferta.</h3> <br> *Sus productos relacionados se agregaran a tu lista de productos.'
      : msj = '<h3> Confirma para participar de esta oferta.</h3>'

      const alert = await this.alertCtrl.create({
        
        message: msj,

        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'parimary',
            
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'Confirmar',
            handler: () => {
              console.log('Confirm Okay');
            }
          }
        ]
      });
  
      await alert.present();
    }

  ngOnInit() {
  }

}
