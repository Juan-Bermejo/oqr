import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NavParamsService } from '../../services/nav-params.service';

@Component({
  selector: 'app-respuesta-reserva',
  templateUrl: './respuesta-reserva.component.html',
  styleUrls: ['./respuesta-reserva.component.scss'],
})
export class RespuestaReservaComponent implements OnInit {


  spinner= true;

  constructor(private modalCtrl: ModalController,
    private router: Router,
    private params: NavParamsService) {

   }

   ionViewWillEnter()
   {
  

    setTimeout(() => {
      this.spinner = false;
      
    }, 2000);
   }

   volver()
   {
     this.router.navigateByUrl("home").then(()=>
    {
      this.modalCtrl.dismiss();
    })
   }



  ngOnInit() {

    
  }

}
