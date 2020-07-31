import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, AlertController } from '@ionic/angular';
import { NavParamsService } from '../services/nav-params.service';
import { DbService } from '../services/db.service';
import { Offer } from '../clases/offer';
import { Seller } from '../clases/seller';
import { User } from '../clases/user';
import { TokenService } from '../services/token.service';
import { CountriesService } from '../services/countries.service';

@Component({
  selector: 'app-asociate-offer',
  templateUrl: './asociate-offer.page.html',
  styleUrls: ['./asociate-offer.page.scss'],
})
export class AsociateOfferPage implements OnInit {

  offerId: string;
  is_my_offer: boolean;
  user:User;
  offer:Offer;
  seller:Seller;
  countries;
  checkProducts:boolean;
  myCommission:number;
  currencyCommission:string;
  myStock:number;
  checkTimeDiscount:boolean;
  is_logged=false;
  average_commission:number; 
  stock;
  time_value;
  time_type;
  commision;
  prod_currency;
  check_time_discount;
  currency_commission;

  constructor(private modalController: ModalController,
    private countrySrv:CountriesService,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    private ParamSrv: NavParamsService,
   private dbServ:DbService,
  private token: TokenService) {
    

    this.dbServ.getLogged$().subscribe((logged_check)=>
    {
      this.is_logged=logged_check;
    })

    if(token.GetPayLoad())
    {
     // this.user= JSON.parse(localStorage.getItem("user_data"));
      this.user = token.GetPayLoad().usuario;
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

              let time_discount: number;
              this.checkTimeDiscount ? time_discount = Date.now() : time_discount = -1;
              let fd = new FormData();
              fd.append("vendor_id", JSON.stringify(this.seller._id));
              fd.append("location", JSON.stringify(this.seller.location));
              fd.append("vendor_stock", this.stock);
              fd.append("offer", JSON.stringify(this.offer));
              fd.append("offer_id", this.offer._id);  ///despues cambiar
             // fd.append("asociatePage", "true");  

             this.dbServ.joinToOffer(fd).subscribe((data:any)=>
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


    ionViewWillEnter()
    {
      this.user = this.token.GetPayLoad().usuario;

      if (document.URL.indexOf("/") > 0) {

        let splitURL = document.URL.split("/");

            this.offerId = splitURL[5].split("?")[0];
            console.log(this.offerId)
      }


        
        this.dbServ.getOffer(this.offerId).toPromise().then((data:any)=>
      {
        console.log(data)

      if(data)
      {
        this.offer = data;
      }
          
        
      

      })
      
      this.dbServ.checkIsVendor(this.user._id).subscribe((data:any)=>
    {
      this.seller = data.vendor_data;
      // for(let i =0; i< this.offer.sellers.length; i++)
      // {
      //   if(this.offer.sellers[i] == data.vendor_data._id)
      //   { 
      //     console.log(this.offer.sellers[i])
          
      //     this.is_my_offer=true;
      //   }
      // }
      
    })

    // for (let i in this.offer.sellers)
    // {
    //   if(this.offer.sellers[i] == this.seller._id)
    //   {
    //     this.is_my_offer = true;
    //   }
    // }
      this.countrySrv.getCountries().subscribe((c)=>{
        this.countries= c;
        console.log(c);
      })
    }
  ngOnInit() {
  }

}
