import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NavParamsService } from '../../services/nav-params.service';
import { DbService } from '../../services/db.service';

@Component({
  selector: 'app-edit-shop',
  templateUrl: './edit-shop.component.html',
  styleUrls: ['./edit-shop.component.scss'],
})
export class EditShopComponent implements OnInit {

  bannerImg: File;
  sellerImg: any;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParamsService,
    private dbs: DbService) {

  
     }

     enviar()
     { 
       let fd = new FormData();
       fd.append("image",this.bannerImg);
       console.log(this.bannerImg);
       this.dbs.sendImage(fd).toPromise().then((res:any)=>
      {
        console.log(res);
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
