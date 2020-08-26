import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NavParamsService } from '../../services/nav-params.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mensaje',
  templateUrl: './mensaje.component.html',
  styleUrls: ['./mensaje.component.scss'],
})
export class MensajeComponent implements OnInit {


  data:any;
  spinner= true;

  constructor(private modalCtrl: ModalController,
    private router: Router,
    private params: NavParamsService) {

   }

   ionViewWillEnter()
   {
    this.data = this.params.GetParam;

    setTimeout(() => {
      this.spinner = false;
      
    }, 2000);
   }

   volver()
   {
     this.router.navigateByUrl(this.data.url).then(()=>
    {
      this.modalCtrl.dismiss();
    })
   }



  ngOnInit() {

    
  }

}
