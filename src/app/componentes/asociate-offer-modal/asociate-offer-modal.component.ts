import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { NavParamsService } from '../../services/nav-params.service';
import { DbService } from '../../services/db.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-asociate-offer-modal',
  templateUrl: './asociate-offer-modal.component.html',
  styleUrls: ['./asociate-offer-modal.component.scss'],
})

export class AsociateOfferModalComponent implements OnInit {



  fd: FormData;
  data: any;
  ofertaExistente: any;
  spinner = false;
  //@Input() ofertaExistente: any;
  estado;

  constructor(private ModalCtrl: ModalController,
     private paraServ: NavParamsService,
    private dbService: DbService,
    private router: Router,
  private alert: AlertController)
     {


  }

  joinOffer() {

    console.log( this.fd.get("offer_id"));
   
    this.spinner = true;
    this.dbService.joinToOffer(this.fd)
      .toPromise()
      .then((dataJoin: any) => {
       
        this.spinner = false;
        this.router.navigateByUrl('home');
      })
      .catch(async (err)=>
    {
      this.spinner = false;
      const alertErr = await this.alert.create(
        {
          message: "Ha ocurrido un error, vuelve a intentarlo mas tarde."
        }
      )
      alertErr.present();
    })
  }



  ionViewWillEnter() {
    this.data = this.paraServ.GetParam;
    this.fd = this.data.fd;
    console.log(this.data);
  }


  dismiss() {
    this.ModalCtrl.dismiss({
      'dismissed': true
    });
  }


  ngOnInit() { }

}
