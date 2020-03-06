import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NavParamsService } from '../services/nav-params.service';

@Component({
  selector: 'app-promote-offer',
  templateUrl: './promote-offer.page.html',
  styleUrls: ['./promote-offer.page.scss'],
})
export class PromoteOfferPage implements OnInit {

  offer;

  constructor(private route: ActivatedRoute, 
    public navCtrl: NavController,
  public paramSrv: NavParamsService) { }

  ngOnInit() {

      this.offer=this.paramSrv.param
      console.log(this.offer)

  }

}
