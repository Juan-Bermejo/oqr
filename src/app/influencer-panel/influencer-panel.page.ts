import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TokenService } from '../services/token.service';
import { DbService } from '../services/db.service';
import { Router, NavigationExtras } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-influencer-panel',
  templateUrl: './influencer-panel.page.html',
  styleUrls: ['./influencer-panel.page.scss'],
})
export class InfluencerPanelPage implements OnInit {
  vistas = 0;
  total_comisiones=0;
  promocionadas=0;
  ventas=0;
  influencer: any;
  user_data: any;
  saldo=0;
  constructor(private navCtrl: NavController,
    private router: Router,
  private token: TokenService,
private dbService: DbService) { }


  goTo()
  {
    this.navCtrl.navigateRoot('offer-list-search');
  }

  goToCanal()
  {
    //this.navCtrl.navigateForward( `canal-influencer/i ${ this.influencer.code}` );
  //  this.router.navigateByUrl("canal-influencer/" + this.influencer.code);
  let navigationExtras: NavigationExtras = {
    queryParams: {
      i: this.influencer.code
    }
  };
  this.router.navigate(['canal-influencer'], navigationExtras);
  }



  ionViewWillEnter()
  {
    this.user_data = this.token.GetPayLoad().usuario;
    this.dbService.getInfluencerByUser(this.user_data._id).toPromise().then((data:any)=>
  {

    this.influencer= data.influencer_data;
    if(this.influencer)
    {
      this.dbService.getInfluencerByUserTotales().subscribe((dataTotales:any)=>
    {
      console.log(dataTotales)
      if(dataTotales.ok)
      {
        this.saldo = dataTotales.saldo; // saldo del influencer, por seprado en caso de haber alguna ganancia que no sea de las comisiones, ej: creditos
        this.ventas = dataTotales.total_ventas; //cantidad de ventas
        this.promocionadas = dataTotales.total_offers; // cantidad de ofertas promocionadas
        this.total_comisiones = dataTotales.total_comisiones; // ganancias por comisiones
        this.total_comisiones = dataTotales.total_comisiones; // ganancias por comisiones
        this.vistas = dataTotales.visitas; // visitas de ofertas por influencer
      }
      
    })
    }
    console.log(data);
  })
  .catch(err=>
  {
    console.log("Error: ", err)
  })
  }

  ngOnInit() {
  }

}
