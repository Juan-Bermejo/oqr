import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, AlertController } from '@ionic/angular';
import { NavParamsService } from '../services/nav-params.service';
import { DbService } from '../services/db.service';
import { Offer } from '../clases/offer';
import { Seller } from '../clases/seller';
import { User } from '../clases/user';
import { TokenService } from '../services/token.service';
import { CountriesService } from '../services/countries.service';
import { MensajeComponent } from '../componentes/mensaje/mensaje.component';

@Component({
  selector: 'app-asociate-offer',
  templateUrl: './asociate-offer.page.html',
  styleUrls: ['./asociate-offer.page.scss'],
})
export class AsociateOfferPage implements OnInit {

  join: boolean;
  currency:string;
  total_vendors: any;
  offerId: string;
  is_my_offer: boolean;
  user: User;
  offer: Offer;
  seller: Seller;
  countries;
  checkProducts: boolean;
  myCommission: number;
  currencyCommission: string;
  myStock: number;
  checkTimeDiscount: boolean;
  is_logged = false;
  average_commission: number;
  stock;
  time_value;
  time_type;
  commission;
  prod_currency = "ARS";
  check_time_discount;
  currency_commission;

  constructor(private modalController: ModalController,
    private countrySrv: CountriesService,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    private ParamSrv: NavParamsService,
    private dbServ: DbService,
    private token: TokenService) {


    this.dbServ.getLogged$().subscribe((logged_check) => {
      this.is_logged = logged_check;
    })

    if (token.GetPayLoad()) {
      // this.user= JSON.parse(localStorage.getItem("user_data"));
      this.user = token.GetPayLoad().usuario;
    }





  }

  async associate() {
    let msj: string;

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

            let time_discount: number;
            this.checkTimeDiscount ? time_discount = Date.now() : time_discount = -1;
            let fd = new FormData();
            fd.append("commission", this.commission);
            fd.append("vendor_id", JSON.stringify(this.seller._id));
            fd.append("location", JSON.stringify(this.seller.location));
            fd.append("vendor_stock", this.stock);
            fd.append("offer", JSON.stringify(this.offer));
            fd.append("offer_id", this.offer._id);  ///despues cambiar
            // fd.append("asociatePage", "true");  

            this.dbServ.joinToOffer(fd).subscribe(async (data: any) => {

              console.log(data)

              if(data.ok)
              {
                const obj = {
                  offer: this.offer,
                  mensaje: "Te asociaste a esta oferta existosamente!",
                  url: "my-offers",

                }
      
                this.ParamSrv.SetParam = obj;
                
                const mejsModal = await this.modalController.create({
                  component: MensajeComponent,
                })
      
               return await mejsModal.present().then(()=>
              {
      
              });
              }
            })
          }
        }
      ]
    });

    await alert.present();
  }
  

  async desAssociate() {

    this.dbServ.dropOffer(this.seller._id, this.offer._id).subscribe((data: any) => {

      console.log(data)


      if(data.ok)
      {      

        this.dbServ.getOfferVend(this.offerId, this.seller._id).toPromise().then((offerData: any) => {
          console.log(offerData)
    
          if (offerData) {
            this.offer = offerData.offer;
            this.total_vendors = offerData.total_vendors;
            this.is_my_offer = offerData.join;
          }
    
        })
        
      const toast = document.createElement('ion-toast');
      toast.message = 'Ya no eres socio de esta oferta';
      toast.duration = 2000;
      toast.color = "primary";
      toast.position = "top";
      document.body.appendChild(toast);
      return toast.present();


      
      }

    })


  }


  ionViewWillEnter() {
    this.user = this.token.GetPayLoad().usuario;

    if (document.URL.indexOf("/") > 0) {

      let splitURL = document.URL.split("/");

      this.offerId = splitURL[5].split("?")[0];
      console.log(this.offerId)
    }

   

    this.dbServ.checkIsVendor(this.user._id).subscribe((vendorData: any) => {
      this.seller = vendorData.vendor_data;

      if(vendorData)
      {

        this.dbServ.getOfferVend(this.offerId, this.seller._id).toPromise().then((offerData: any) => {
          console.log(offerData)
    
          if (offerData) {
            this.offer = offerData.offer;
            this.total_vendors = offerData.total_vendors;
            this.is_my_offer = offerData.join;
          }
    
        })


      }

      

    })






    // for (let i in this.offer.sellers)
    // {
    //   if(this.offer.sellers[i] == this.seller._id)
    //   {
    //     this.is_my_offer = true;
    //   }
    // }
    this.countrySrv.getCountries().subscribe((c) => {
      this.countries = c;
      console.log(c);
    })
  }
  ngOnInit() {
  }

}
