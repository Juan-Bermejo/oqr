import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NavParamsService } from '../../services/nav-params.service';
import { DbService } from '../../services/db.service';


@Component({
  selector: 'app-asociate-offer-modal',
  templateUrl: './asociate-offer-modal.component.html',
  styleUrls: ['./asociate-offer-modal.component.scss'],
})

export class AsociateOfferModalComponent implements OnInit {



  fd: FormData;
  data: any;
  ofertaExistente: any;
  //@Input() ofertaExistente: any;
  estado;

  constructor(private ModalCtrl: ModalController,
     private paraServ: NavParamsService,
    private dbService: DbService) {


  }

  joinOffer() {

    console.log( this.fd.get("offer_id"));
   
    
    this.dbService.joinToOffer(this.fd)
      .toPromise()
      .then((dataJoin: any) => {
        console.log(dataJoin)
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
