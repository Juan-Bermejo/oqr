import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, AlertController } from '@ionic/angular';
import { NavParamsService } from '../services/nav-params.service';
import { DbService } from '../services/db.service';
import { Offer } from '../clases/offer';
import { Seller } from '../clases/seller';
import { User } from '../clases/user';

@Component({
  selector: 'app-asociate-offer',
  templateUrl: './asociate-offer.page.html',
  styleUrls: ['./asociate-offer.page.scss'],
})
export class AsociateOfferPage implements OnInit {

  is_my_offer: boolean;
  user:User;
  offer:Offer;
  seller:Seller;
  checkProducts:boolean;

  constructor(private modalController: ModalController,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    private ParamSrv: NavParamsService,
   private dbServ:DbService) {

    this.user= JSON.parse(localStorage.getItem("user_data"));
    this.offer=this.ParamSrv.param.offer;
    this.seller=this.ParamSrv.param.seller;
    console.log(this.offer)
    console.log(this.seller)
    console.log(this.ParamSrv.param)

      for(let i =0; i< this.offer.sellers.length; i++)
      {
        if(this.offer.sellers[i] == this.seller._id)
        { 
          console.log(this.offer.sellers[i])
          console.log(this.seller._id)
          this.is_my_offer=true;
        }
      }

   

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
            
            handler: () => {

            }
          }, {
            text: 'Confirmar',
            handler: () => {
               this.dbServ.joinToOffer(this.user._id,this.offer._id,false).subscribe((data:any)=>
              {
                console.log(data)
              })
            }
          }
        ]
      });
  
      await alert.present();
    }

    async desAssociate()
    {
      this.dbServ.dropOffer(this.user._id,this.offer._id).subscribe((data:any)=>
    {
      const toast = document.createElement('ion-toast');
      toast.message = 'Ya no eres socio de esta oferta';
      toast.duration = 2000;
      toast.color= "primary";
      toast.position="top";
      document.body.appendChild(toast);
      return toast.present(); 
    })
    }

  ngOnInit() {
  }

}
